package kz.dreamteam.backend.controller;


import kz.dreamteam.backend.model.Connection;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.service.ConnectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connections")
public class ConnectionsController {

    private final ConnectionService connectionService;

    public ConnectionsController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping("/received")
    public ResponseEntity<List<User>> getAllReceivedConnectionRequests(@RequestParam Long userId) {
        return ResponseEntity.ok(this.connectionService.getAllReceivedConnectionRequests(userId));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<User>> getAllSentConnectionRequests(@RequestParam Long userId) {
        List<User> sentRequests = connectionService.getAllSentConnectionRequests(userId);
        return ResponseEntity.ok(sentRequests);
    }

    @GetMapping("/my-connections")
    public ResponseEntity<List<User>> getAllMyConnections(@RequestParam Long userId) {
        List<User> myConnections = connectionService.getAllMyConnections(userId);
        return ResponseEntity.ok(myConnections);
    }

    @GetMapping("/is-connected")
    public ResponseEntity<String> isTwoUsersConnected(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        String isConnected = connectionService.isTwoUsersConnected(userId1, userId2);
        return ResponseEntity.ok(isConnected);
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendConnectionRequest(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {

        connectionService.sendConnectionRequest(senderId, receiverId);
        return ResponseEntity.ok("Connection request sent successfully.");
    }

    @PostMapping("/answer")
    public ResponseEntity<String> answerConnectionRequest(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam Boolean answer) {

        connectionService.answerConnectionRequest(senderId, receiverId, answer);
        return ResponseEntity.ok("Connection request " + (answer ? "accepted" : "declined") + " successfully.");
    }
}
