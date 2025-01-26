package kz.dreamteam.backend.model;

import jakarta.persistence.*;

@Entity
public class SocialDetails {

    @Id
    private Long userId;

    private Boolean smoking;
    private Boolean drinking;
    private String religion;
    private String lifePlans;

    private String sports; // Или используйте @ElementCollection если sports это список

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getSmoking() {
        return smoking;
    }

    public void setSmoking(Boolean smoking) {
        this.smoking = smoking;
    }

    public Boolean getDrinking() {
        return drinking;
    }

    public void setDrinking(Boolean drinking) {
        this.drinking = drinking;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getLifePlans() {
        return lifePlans;
    }

    public void setLifePlans(String lifePlans) {
        this.lifePlans = lifePlans;
    }

    public String getSports() {
        return sports;
    }

    public void setSports(String sports) {
        this.sports = sports;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

