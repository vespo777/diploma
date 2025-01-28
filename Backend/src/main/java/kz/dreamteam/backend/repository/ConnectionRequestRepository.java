package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
    // Find all connection requests involving a specific user
    List<ConnectionRequest> findByUserId1OrUserId2(Long userId1, Long userId2);

    // Find a specific connection request between two users
    Optional<ConnectionRequest> findByUserId1AndUserId2(Long userId1, Long userId2);
}
