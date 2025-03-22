package kz.dreamteam.backend.model;

import jakarta.persistence.*;

@Entity
public class Ratings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    private Long userRatingSenderId;
    private Long userRatingAccepterId;
    private Long score; // range: 1-10
    private String comment;
    private DataTime createdAt; // default: current Timestamp

    
    // Getters and setters -- TODO: Tileukhan, pls write getters and setters
}
