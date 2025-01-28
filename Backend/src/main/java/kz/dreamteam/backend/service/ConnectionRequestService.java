package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.ConnectionRequest;
import kz.dreamteam.backend.model.ConnectionStatus;
import kz.dreamteam.backend.repository.ConnectionRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConnectionRequestService {

    private final ConnectionRequestRepository connectionRequestRepository;

    public ConnectionRequestService(ConnectionRequestRepository connectionRequestRepository) {
        this.connectionRequestRepository = connectionRequestRepository;
    }

    // Create a connection request
    public ConnectionRequest createConnectionRequest(Long userId1, Long userId2) {
        ConnectionRequest connectionRequest = new ConnectionRequest();
        connectionRequest.setUserId1(userId1);
        connectionRequest.setUserId2(userId2);
        connectionRequest.setStatus(ConnectionStatus.PENDING); // Default status
        return connectionRequestRepository.save(connectionRequest);
    }

    // Get all connection requests involving a specific user
    public List<ConnectionRequest> getConnectionRequests(Long userId) {
        return connectionRequestRepository.findByUserId1OrUserId2(userId, userId);
    }

    // Update the status of a connection request
    public ConnectionRequest updateConnectionRequest(Long userId1, Long userId2, ConnectionStatus status) {
        ConnectionRequest connectionRequest = connectionRequestRepository.findByUserId1AndUserId2(userId1, userId2)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));
        connectionRequest.setStatus(status);
        return connectionRequestRepository.save(connectionRequest);
    }

    // Delete a connection request
    public void deleteConnectionRequest(Long userId1, Long userId2) {
        ConnectionRequest connectionRequest = connectionRequestRepository.findByUserId1AndUserId2(userId1, userId2)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));
        connectionRequestRepository.delete(connectionRequest);
    }
}