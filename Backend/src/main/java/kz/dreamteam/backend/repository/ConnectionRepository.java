package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c.senderId FROM Connection c WHERE c.receiverId = :receiverId AND c.status = 'PENDING'")
    List<Long> findSenderIdsByReceiverId(@Param("receiverId") Long receiverId);

    boolean existsBySenderIdAndReceiverId(Long senderId, Long receiverId);

    Optional<List<Connection>> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    Optional<Connection> findFirstBySenderIdAndReceiverId(Long senderId, Long receiverId);


    List<Connection> findBySenderId(Long senderId);

    boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, String status);

    @Query("SELECT c FROM Connection c WHERE c.senderId = :userId OR c.receiverId = :userId AND c.status = 'ACCEPTED'")
    List<Connection> getAllMyConnections(@Param("userId") Long userId);



}
