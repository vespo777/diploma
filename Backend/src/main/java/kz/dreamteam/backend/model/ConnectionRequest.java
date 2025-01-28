package kz.dreamteam.backend.model;

import jakarta.persistence.*;

@Entity
public class ConnectionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id1", nullable = false)
    private Long userId1;

    @Column(name = "user_id2", nullable = false)
    private Long userId2;

    @Enumerated(EnumType.STRING)
    private ConnectionStatus status; // e.g., PENDING, ACCEPTED, REJECTED

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId1() {
        return userId1;
    }

    public void setUserId1(Long userId1) {
        this.userId1 = userId1;
    }

    public Long getUserId2() {
        return userId2;
    }

    public void setUserId2(Long userId2) {
        this.userId2 = userId2;
    }

    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
    }
}

