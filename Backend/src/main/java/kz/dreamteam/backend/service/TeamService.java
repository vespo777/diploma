package kz.dreamteam.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.Team;
import kz.dreamteam.backend.model.TeammateRequest;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.enums.RequestStatus;
import kz.dreamteam.backend.repository.ConnectionsRepository;
import kz.dreamteam.backend.repository.TeamRepository;
import kz.dreamteam.backend.repository.TeammateRequestRepository;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {


    private final TeamRepository teamRepository;
    private final TeammateRequestRepository teammateRequestRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository,
                              TeammateRequestRepository teammateRequestRepository,
                              UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teammateRequestRepository = teammateRequestRepository;
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

    public String sendJoinRequest(Long senderId, Long receiverId) {


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
            Optional<Team> userTeam = teamRepository.findTeamByMemberId(userId);

            if (userTeam.isPresent()) {
                // Remove user from the team
                teammateRequestRepository.updateStatusToExited(userId, userTeam.get().getOwner().getUserId(), RequestStatus.EXITED, LocalDateTime.now());
                return "User exited the team successfully";
            } else {
                return "Error: User is not in any team";
            }

        }

        // Remove the user from the current team
//        teammateRequestRepository.updateStatusToExited(userId, RequestStatus.EXITED, LocalDateTime.now());

        return "User exited the team successfully";
    }


    public String answerToInvite(Long userId, Long teamId, String status) {
        // Validate the status input
        RequestStatus requestStatus;
        try {
            requestStatus = RequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return "Invalid status. Allowed values: ACCEPTED, REJECTED";
        }

        // Find the invite request
        Optional<TeammateRequest> requestOpt = teammateRequestRepository
                .findBySenderIdAndReceiverIdAndStatus(userId, teamId, RequestStatus.PENDING);

        if (requestOpt.isEmpty()) {
            return "No pending invite found for this user and team";
        }

        TeammateRequest request = requestOpt.get();
        request.setStatus(requestStatus);

        // Set start time if accepted
        if (requestStatus == RequestStatus.ACCEPTED) {
            request.setStartedAt(LocalDateTime.now());
        }

        teammateRequestRepository.save(request);
        return "Invitation " + status.toLowerCase() + " successfully";
    }

    public boolean checkIsUserAlreadyInTeam(Long userId) {
        return teammateRequestRepository.existsBySenderIdAndStatus(userId, RequestStatus.ACCEPTED) ||
                teammateRequestRepository.existsByReceiverIdAndStatus(userId, RequestStatus.ACCEPTED);
    }
}
