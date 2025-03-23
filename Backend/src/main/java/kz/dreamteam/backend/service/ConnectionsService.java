package kz.dreamteam.backend.service;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.Connections;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.UpdateSocialDetailsDto;
import kz.dreamteam.backend.repository.ConnectionsRepository;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ConnectionsService {

    private final ConnectionsRepository connectionsRepository;
    private final UserRepository userRepository;

    public ConnectionsService(ConnectionsRepository connectionsRepository,
                              UserRepository userRepository) {
        this.connectionsRepository = connectionsRepository;
        this.userRepository = userRepository;
    }

    public List<User> getAllReceivedConnectionRequests(Long userId) {
        List<Long> senderIds = connectionsRepository.findSenderIdsByReceiverId(userId);
        return userRepository.findAllById(senderIds);
    }

    public List<User> getAllSentConnectionRequests(Long userId) {
        List<Connections> sentConnections = connectionsRepository.findBySenderId(userId);
        return sentConnections.stream()
                .map(connection -> userRepository.findById(connection.getReceiverId()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    public List<User> getAllMyConnections(Long userId) {
        List<Connections> myConnections = connectionsRepository.getAllMyConnections(userId);
        return myConnections.stream()
                .map(conn -> conn.getSenderId().equals(userId) ? conn.getReceiverId() : conn.getSenderId())
                .distinct()
                .map(userIds -> userRepository.findById(userIds).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    public boolean isTwoUsersConnected(Long userId1, Long userId2) {
        return connectionsRepository.existsBySenderIdAndReceiverIdAndStatus(userId1, userId2, "ACCEPTED") ||
                connectionsRepository.existsBySenderIdAndReceiverIdAndStatus(userId2, userId1, "ACCEPTED");
    }

    @Transactional
    public void sendConnectionRequest(Long senderId, Long receiverId) {
        if (!userRepository.existsById(senderId) || !userRepository.existsById(receiverId)) {
            throw new RuntimeException("Sender or receiver not found.");
        }

        if (connectionsRepository.existsBySenderIdAndReceiverId(senderId, receiverId)) {
            throw new RuntimeException("Connection request already exists.");
        }

        Connections connection = new Connections();
        connection.setSenderId(senderId);
        connection.setReceiverId(receiverId);
        connection.setStatus("PENDING");

        connectionsRepository.save(connection);
    }

    @Transactional
    public void answerConnectionRequest(Long senderId, Long receiverId, Boolean answer) {
        Connections connection = connectionsRepository
                .findBySenderIdAndReceiverId(senderId, receiverId)
                .orElseThrow(() -> new RuntimeException("Connection request not found."));

        if (!"PENDING".equals(connection.getStatus())) {
            throw new RuntimeException("Connection request is already processed.");
        }

        connection.setStatus(answer ? "ACCEPTED" : "DECLINED");
        connectionsRepository.save(connection);
    }


}
