package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.Team;
import kz.dreamteam.backend.model.dto.NotificationDTO;
import kz.dreamteam.backend.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.management.Notification;
import java.util.List;

@RestController
@RequestMapping("/teams")
public class TeamController {
    
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/get-all-teams")
    public ResponseEntity<List<Team>> getAllTeams(@RequestParam Long teamId) {
        return ResponseEntity.ok(this.teamService.getAllTeams(teamId));
    }

    @GetMapping("/get-team-by-userId")
    public ResponseEntity<Team> getUserTeam(@RequestParam Long userId) {
        return ResponseEntity.ok(this.teamService.getUserTeam(userId));
    }

    @GetMapping("/get-team-by-teamId")
    public ResponseEntity<Team> getTeam(@RequestParam Long teamId) {
        return ResponseEntity.ok(teamService.getTeam(teamId));
    }

    @GetMapping("/is-user-team-request-sent")
    public ResponseEntity<Boolean> isUserToTeamRequestSent(@RequestParam Long userId, @RequestParam Long teamId) {
        return ResponseEntity.ok(teamService.isUserToTeamRequestSent(userId, teamId));
    }

    @GetMapping("/received-invitations-and-requests")
    public ResponseEntity<List<NotificationDTO>> getAllInvitesAndRequests(@RequestParam Long userId) {
        List<NotificationDTO> receivedInvitesAndRequests = teamService.getAllInvitesAndRequestsForUser(userId);
        return ResponseEntity.ok(receivedInvitesAndRequests);
    }

//    @PostMapping("/send-join-request")
//    public ResponseEntity<String> sendJoinRequest(@RequestParam Long senderId, @RequestParam Long receiverId) {
//        return ResponseEntity.ok(this.teamService.sendJoinRequest(senderId, receiverId));
//    }

    @PostMapping("/send-join-request")
    public ResponseEntity<String> sendJoinRequest(@RequestParam Long senderId, @RequestParam Long teamId) {
        return ResponseEntity.ok(this.teamService.sendJoinRequest(senderId, teamId));
    }

    @PostMapping("/exit-team")
    public ResponseEntity<String> exitTeam(@RequestParam Long userId) {
        String result = teamService.exitTeam(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/answer-to-request")
    public ResponseEntity<String> answerToRequest(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String status) {

        String result = teamService.answerToRequest(senderId, receiverId, status);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/answer-to-invite")
    public ResponseEntity<String> answerToInvite(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String status) {

        String result = teamService.answerToInvite(senderId, receiverId, status);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/check-is-user-already-in-team")
    public ResponseEntity<Boolean> checkIsUserAlreadyInTeam(@RequestParam Long userId) {
        return ResponseEntity.ok(teamService.isUserInTeam(userId));
    }

    @PostMapping("/send-invite")
    public ResponseEntity<String> sendInvite(@RequestParam Long senderId, @RequestParam Long receiverId) {
        String result = teamService.sendInvite(senderId, receiverId);
        return ResponseEntity.ok(result);
    }

}
