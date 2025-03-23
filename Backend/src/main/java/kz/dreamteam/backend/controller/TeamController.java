package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.Team;
import kz.dreamteam.backend.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teams")
public class TeamController {
    
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/get-all-teams")
    public ResponseEntity<List<Team>> getUserTeam() {
        return ResponseEntity.ok(this.teamService.getAllTeams());
    }

    @GetMapping("/get-team-by-userId")
    public ResponseEntity<Team> getUserTeam(@RequestParam Long userId) {
        return ResponseEntity.ok(this.teamService.getUserTeam(userId));
    }

    @GetMapping("/get-team-by-teamId")
    public ResponseEntity<Team> getTeam(@RequestParam Long teamId) {
        return ResponseEntity.ok(teamService.getTeam(teamId));
    }

    @PostMapping("/send-request-to-join-team")
    public ResponseEntity<String> sendRequestToJoinTeam(@RequestParam Long senderId, @RequestParam Long receiverId) {
        return ResponseEntity.ok(this.teamService.sendJoinRequest(senderId, receiverId));
    }

    @PostMapping("/exit-team")
    public ResponseEntity<String> exitTeam(@RequestParam Long userId) {
        String result = teamService.exitTeam(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/answer-to-invite")
    public ResponseEntity<String> answerToInvite(
            @RequestParam Long userId,
            @RequestParam Long teamId,
            @RequestParam String status) {

        String result = teamService.answerToInvite(userId, teamId, status);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/check-is-user-already-in-team")
    public ResponseEntity<Boolean> checkIsUserAlreadyInTeam(@RequestParam Long userId) {
        return ResponseEntity.ok(teamService.checkIsUserAlreadyInTeam(userId));
    }

}
