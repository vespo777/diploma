package kz.dreamteam.backend.model;

import jakarta.persistence.*;

@Entity
public class TeammateRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teammate_request_id")
    private Long teammateRequestId;

    private Long userSenderId;
    private Long teamGetterId;
    private String status; // 4 statuses: [“Accepted, “Rejected”, “Pending”, “Deleted”] 

    private DataTime createdAt; // default: current Timestamp
    private DataTime startedAt; // nullable, when status==Accepted -> writes the start time
    private DataTime finishedAt; // nullable, when status=Deleted -> writes the closed time
    private Bool allowGiveRating: // default: false, when FinishedAt - StartedAt == 2 weeks -> allowGiveRating=true

    // Getters and setters -- TODO: Tileukhan, pls write getters and setters
}
