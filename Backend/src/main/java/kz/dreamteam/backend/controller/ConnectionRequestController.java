package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.ConnectionRequest;
import kz.dreamteam.backend.model.ConnectionStatus;
import kz.dreamteam.backend.service.ConnectionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connection-requests")
public class ConnectionRequestController {

    private final ConnectionRequestService connectionRequestService;

    public ConnectionRequestController(ConnectionRequestService connectionRequestService) {
        this.connectionRequestService = connectionRequestService;
    }

    // Create a connection request (POST)
    @PostMapping
    public ResponseEntity<ConnectionRequest> createConnectionRequest(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        ConnectionRequest connectionRequest = connectionRequestService.createConnectionRequest(userId1, userId2);
        return ResponseEntity.status(HttpStatus.CREATED).body(connectionRequest);
    }

    // Get all connection requests involving a specific user (GET)
    @GetMapping
    public ResponseEntity<List<ConnectionRequest>> getConnectionRequests(@RequestParam Long userId) {
        List<ConnectionRequest> connectionRequests = connectionRequestService.getConnectionRequests(userId);
        return ResponseEntity.ok(connectionRequests);
    }

    // Update the status of a connection request (PUT)
    @PutMapping
    public ResponseEntity<ConnectionRequest> updateConnectionRequest(
            @RequestParam Long userId1,
            @RequestParam Long userId2,
            @RequestParam ConnectionStatus status) {
        ConnectionRequest connectionRequest = connectionRequestService.updateConnectionRequest(userId1, userId2, status);
        return ResponseEntity.ok(connectionRequest);
    }

    // Delete a connection request (DELETE)
    @DeleteMapping
    public ResponseEntity<Void> deleteConnectionRequest(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        connectionRequestService.deleteConnectionRequest(userId1, userId2);
        return ResponseEntity.noContent().build();
    }
}
