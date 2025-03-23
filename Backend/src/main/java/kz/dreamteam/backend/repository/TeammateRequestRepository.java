package kz.dreamteam.backend.repository;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.TeammateRequest;
import kz.dreamteam.backend.model.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TeammateRequestRepository extends JpaRepository<TeammateRequest, Long> {
    boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, RequestStatus status);
    Optional<TeammateRequest> findBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, RequestStatus status);
//    Optional<TeammateRequest> findByReceiverIdAndTeamIdAndStatus(Long receiverId, Long teamId, RequestStatus status);

    boolean existsBySenderIdAndStatus(Long senderId, RequestStatus status);
    boolean existsByReceiverIdAndStatus(Long receiverId, RequestStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE TeammateRequest tr SET tr.status = :status, tr.finishedAt = :finishedAt " +
            "WHERE (tr.senderId = :userId AND tr.receiverId = :ownerId) " +
            "   OR (tr.senderId = :ownerId AND tr.receiverId = :userId)")
    void updateStatusToExited(@Param("userId") Long userId,
                              @Param("ownerId") Long ownerId,
                              @Param("status") RequestStatus status,
                              @Param("finishedAt") LocalDateTime finishedAt);


}
