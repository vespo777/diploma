package kz.dreamteam.backend.service;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.Connection;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.repository.ConnectionRepository;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    public ConnectionService(ConnectionRepository connectionsRepository,
                              UserRepository userRepository) {
        this.connectionRepository = connectionsRepository;
        this.userRepository = userRepository;
    }

    public List<User> getAllReceivedConnectionRequests(Long userId) {
        List<Long> senderIds = connectionRepository.findSenderIdsByReceiverId(userId);
        return userRepository.findAllById(senderIds);
    }

    public List<User> getAllSentConnectionRequests(Long userId) {
        List<Connection> sentConnections = connectionRepository.findBySenderId(userId);
        return sentConnections.stream()
                .map(connection -> userRepository.findById(connection.getReceiverId()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    public List<User> getAllMyConnections(Long userId) {
        List<Connection> myConnections = connectionRepository.getAllMyConnections(userId);
        return myConnections.stream()
                .map(conn -> conn.getSenderId().equals(userId) ? conn.getReceiverId() : conn.getSenderId())
                .distinct()
                .map(userIds -> userRepository.findById(userIds).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    public String isTwoUsersConnected(Long userId1, Long userId2) {
        Optional<Connection> connection = connectionRepository
                .findFirstBySenderIdAndReceiverId(userId1, userId2)
                .or(() -> connectionRepository.findFirstBySenderIdAndReceiverId(userId2, userId1));

        return connection.map(conn -> "Connection exists with status: " + conn.getStatus())
                .orElse("No connection found.");
    }

    @Transactional
    public void sendConnectionRequest(Long senderId, Long receiverId) {
        if (!userRepository.existsById(senderId) || !userRepository.existsById(receiverId)) {
            throw new RuntimeException("Sender or receiver not found.");
        }

        if (connectionRepository.existsBySenderIdAndReceiverId(senderId, receiverId)) {
            throw new RuntimeException("Connection request already exists.");
        }

        Connection connection = new Connection();
        connection.setSenderId(senderId);
        connection.setReceiverId(receiverId);
        connection.setStatus("PENDING");

        connectionRepository.save(connection);
    }

    @Transactional
    public void answerConnectionRequest(Long senderId, Long receiverId, Boolean answer) {
        Connection connection = (Connection) connectionRepository
                .findBySenderIdAndReceiverId(senderId, receiverId)
                .orElseThrow(() -> new RuntimeException("Connection request not found."));

        if (!"PENDING".equals(connection.getStatus())) {
            throw new RuntimeException("Connection request is already processed.");
        }

        connection.setStatus(answer ? "ACCEPTED" : "DECLINED");
        connectionRepository.save(connection);
    }


}
