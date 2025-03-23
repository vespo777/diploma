//package kz.dreamteam.backend.model;
//
//import jakarta.persistence.*;
//
//@Entity
//public class Invitation {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "sender_id", nullable = false)
//    private User sender;
//
//    @ManyToOne
//    @JoinColumn(name = "receiver_id", nullable = false)
//    private User receiver;
//
//    @Enumerated(EnumType.STRING)
//    private InvitationStatus status;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public User getSender() {
//        return sender;
//    }
//
//    public void setSender(User sender) {
//        this.sender = sender;
//    }
//
//    public User getReceiver() {
//        return receiver;
//    }
//
//    public void setReceiver(User receiver) {
//        this.receiver = receiver;
//    }
//
//    public InvitationStatus getStatus() {
//        return status;
//    }
//
//    public void setStatus(InvitationStatus status) {
//        this.status = status;
//    }
//}
//
