package kz.dreamteam.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.Team;
import kz.dreamteam.backend.model.TeammateRequest;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.NotificationDTO;
import kz.dreamteam.backend.model.enums.RequestStatus;
import kz.dreamteam.backend.repository.TeamRepository;
import kz.dreamteam.backend.repository.TeammateRequestRepository;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import javax.management.Notification;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    private final ApplicationContext applicationContext;
    private final TeamRepository teamRepository;
    private final TeammateRequestRepository teammateRequestRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public TeamService(TeamRepository teamRepository,
                              ApplicationContext applicationContext,
                              TeammateRequestRepository teammateRequestRepository,
                              UserService userService,
                              UserRepository userRepository) {
        this.applicationContext = applicationContext;
        this.teamRepository = teamRepository;
        this.teammateRequestRepository = teammateRequestRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getUserTeam(Long userId) {
        return teamRepository.findByOwnerId(userId)
                .or(() -> teamRepository.findByMemberId(userId))
                .orElseThrow(() -> new EntityNotFoundException("Team not found for user: " + userId));
    }

    public Team getTeam(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found"));
    }

    public Boolean isUserToTeamRequestSent(Long userId, Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found"));

        Long receiverId = team.getOwner().getUserId();
        Long senderId = userId;

        // Check if request already exists
        return teammateRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, RequestStatus.PENDING); // Request already pending
    }

    public List<NotificationDTO> getAllInvitesAndRequestsForUser(Long userId) {
        List<NotificationDTO> inviteRequestList = new ArrayList<>();

        // Получаем все инвайты и запросы, где пользователь является отправителем или получателем
        List<TeammateRequest> teammateRequests = new ArrayList<>();
        teammateRequests.addAll(teammateRequestRepository.findByReceiverIdAndStatus(userId, RequestStatus.INVITED));
        teammateRequests.addAll(teammateRequestRepository.findByReceiverIdAndStatus(userId, RequestStatus.PENDING));

        // Перебираем все найденные запросы и инвайты
        for (TeammateRequest request : teammateRequests) {
            NotificationDTO notificationDTO = new NotificationDTO();

            // Определяем тип (invite или request)
            String type = request.getStatus() == RequestStatus.INVITED ? "invite" : "request";
            notificationDTO.setType(type);

            // Заполняем данные пользователя
            notificationDTO.setUser(userRepository.findByUserId(request.getSenderId()).get());
            notificationDTO.setTeam(teamRepository.findTeamByUserId(request.getSenderId()).get());

            inviteRequestList.add(notificationDTO);
        }

        return inviteRequestList;
    }

//    public String sendJoinRequest(Long senderId, Long receiverId) {
//
//        // Check if request already exists
//        if (teammateRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, RequestStatus.PENDING)) {
//            return "Request already pending"; // Request already pending
//        }
//
//        // Create new request
//        TeammateRequest request = new TeammateRequest();
//        request.setSenderId(senderId);
//        request.setReceiverId(receiverId);
//        request.setStatus(RequestStatus.PENDING);
//
//        teammateRequestRepository.save(request);
//        return "Request sent successfully";
//    }

    public String sendJoinRequest(Long senderId, Long teamId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found"));

        Long receiverId = team.getOwner().getUserId();

        // Check if request already exists
        if (teammateRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, RequestStatus.PENDING)) {
            return "Request already pending"; // Request already pending
        }

        // Create new request
        TeammateRequest request = new TeammateRequest();
        request.setSenderId(senderId);
        request.setReceiverId(receiverId);
        request.setStatus(RequestStatus.PENDING);

        teammateRequestRepository.save(request);
        return "Request sent successfully";
    }

    @Transactional
    public String answerToRequest(Long senderId, Long receiverId, String status) {
        // Validate the status input
        RequestStatus requestStatus;
        try {
            requestStatus = RequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return "Invalid status. Allowed values: ACCEPTED, REJECTED";
        }

        // Find the invite request
        Optional<TeammateRequest> requestOpt = teammateRequestRepository
                .findBySenderIdAndReceiverIdAndStatus(senderId, receiverId, RequestStatus.PENDING);

        if (requestOpt.isEmpty()) {
            return "No pending invite found for this user and team";
        }

        TeammateRequest request = requestOpt.get();
        request.setStatus(requestStatus);

        Optional<Team> team = teamRepository.findTeamByUserId(receiverId);
        User newMember = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender user not found"));

        // Set start time if accepted
        // Insert new member into team
        if (requestStatus == RequestStatus.ACCEPTED) {
            if(team.isPresent()) {
                Team curTeam = team.get();

                if (curTeam.getMembers().contains(newMember)) {
                    return "User is already in the team";
                }

                // Получаем бин TeamService через ApplicationContext
                TeamService self = applicationContext.getBean(TeamService.class);
                self.exitTeam(newMember.getUserId());
                self.joinTeam(newMember, curTeam);

                // Delete all other pending join requests
                teammateRequestRepository.deletePendingRequestsByReceiverId(newMember.getUserId(), RequestStatus.PENDING);
            } else {
                return "The team you are trying to join does not exist.";
            }
        }

        teammateRequestRepository.save(request);
        return "Invitation " + status.toLowerCase() + " successfully";
    }

    @Transactional
    public String exitTeam(Long userId) {
        // Find the team where the user is a leader
        Optional<Team> teamOpt = teamRepository.findByOwnerId(userId);

        if (teamOpt.isPresent()) {
            Team team = teamOpt.get();

            // Find a random teammate to become the new leader
            List<User> teammates = teamRepository.findTeammatesByTeamId(team.getId());

            if (!teammates.isEmpty()) {
                User newLeader = teammates.get(0); // Pick first teammate as new leader

                // Assign new leader
                team.setOwner(newLeader);
                teamRepository.save(team);
            } else {
                // No teammates left, return an error
                return "Error: team size is one";
            }
        } else {
            // If the user is not a leader, check if they are a team member
            Optional<Team> team = teamRepository.findTeamByUserId(userId);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            if (team.isPresent()) {
                // Remove user from the team
                team.get().getMembers().remove(userService.getUserById(userId));
                user.setTeam(null);
                teammateRequestRepository.deleteBySenderIdAndReceiverId(userId, team.get().getOwner().getUserId());
                createSoloTeam(userId);
                return "User exited the team successfully";
            } else {
                return "Error: User is not member in any team";
            }
        }
        return "User exited the team successfully";
    }

    @Transactional
    public String sendInvite(Long senderId, Long receiverId) {

        // Проверяем, есть ли уже приглашение
        if (teammateRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, RequestStatus.INVITED)) {
            return "Invite already sent";
        }

        // Создаем новый инвайт
        TeammateRequest invite = new TeammateRequest();
        invite.setSenderId(senderId);
        invite.setReceiverId(receiverId);
        invite.setStatus(RequestStatus.INVITED);
        invite.setCreatedAt(LocalDateTime.now());

        teammateRequestRepository.save(invite);
        return "Invite sent successfully";
    }

    @Transactional
    public String answerToInvite(Long senderId, Long receiverId, String status) {
        // Проверяем, существует ли приглашение
        TeammateRequest invite = teammateRequestRepository.findBySenderIdAndReceiverIdAndStatus(senderId, receiverId, RequestStatus.INVITED)
                .orElseThrow(() -> new EntityNotFoundException("No invite found"));

        if (status.equalsIgnoreCase("ACCEPTED")) {
            // Принимаем приглашение
            invite.setStatus(RequestStatus.ACCEPTED);

            // Добавляем пользователя в команду
            Team team = teamRepository.findTeamByUserId(senderId)
                    .orElseThrow(() -> new EntityNotFoundException("Team not found"));

            User user = userRepository.findById(receiverId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            // Получаем бин TeamService через ApplicationContext
            TeamService self = applicationContext.getBean(TeamService.class);
            self.exitTeam(user.getUserId());
            self.joinTeam(user, team);

            teamRepository.save(team);

            return "Invite accepted";
        } else if (status.equalsIgnoreCase("rejected")) {
            // Отклоняем приглашение
            invite.setStatus(RequestStatus.REJECTED);
            teammateRequestRepository.deleteBySenderIdAndReceiverId(receiverId, senderId);
            return "Invite rejected";
        } else {
            return "Invalid status. Use 'accepted' or 'rejected'";
        }
    }

    public boolean isUserInTeam(Long userId) {
        return teammateRequestRepository.existsBySenderIdAndStatus(userId, RequestStatus.ACCEPTED) ||
                teammateRequestRepository.existsByReceiverIdAndStatus(userId, RequestStatus.ACCEPTED);
    }

    @Transactional
    public void createSoloTeam(Long userId) {
        // Найти пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Создать новую команду
        Team newTeam = new Team();
        newTeam.setOwner(user);
        newTeam.setName("Team_" + user.getPersonalInfo().getName());

        // Сохранить команду
        teamRepository.save(newTeam);
    }


    @Transactional
    public void joinTeam(User user, Team newTeam) {

        Team currentTeam = user.getTeam();

        if (currentTeam != null && currentTeam.getOwner().equals(user) ) {
            // Удаляем текущую команду, так как он единственный участник
            teamRepository.delete(currentTeam);
        }

        // Добавляем пользователя в новую команду
        newTeam.getMembers().add(user);
        user.setTeam(newTeam);

        teamRepository.save(newTeam);
        userRepository.save(user);
    }

}
