package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.Connections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionsRepository extends JpaRepository<Connections, Long> {

    @Query("SELECT c.senderId FROM Connections c WHERE c.receiverId = :receiverId AND c.status = 'PENDING'")
    List<Long> findSenderIdsByReceiverId(@Param("receiverId") Long receiverId);

    boolean existsBySenderIdAndReceiverId(Long senderId, Long receiverId);

    Optional<Connections> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    List<Connections> findBySenderId(Long senderId);

    boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, String status);

    @Query("SELECT c FROM Connections c WHERE c.senderId = :userId OR c.receiverId = :userId AND c.status = 'ACCEPTED'")
    List<Connections> getAllMyConnections(@Param("userId") Long userId);

}
