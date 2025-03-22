package kz.dreamteam.backend.model;

import jakarta.persistence.*;

@Entity
public class Teams {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    private Long leaderId;
    private Long maxTeamSize;


    // Getters and setters -- TODO: Tileukhan, pls write getters and setters
}
