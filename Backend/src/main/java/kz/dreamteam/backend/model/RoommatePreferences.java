package kz.dreamteam.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class RoommatePreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Ensure the ID is auto-generated
    private Long id;

    private Boolean prefersDorm;
    private Boolean prefersApartment;
    private String wakeTime;
    private String sleepTime;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public RoommatePreferences() {
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getPrefersDorm() {
        return prefersDorm;
    }

    public void setPrefersDorm(Boolean prefersDorm) {
        this.prefersDorm = prefersDorm;
    }

    public Boolean getPrefersApartment() {
        return prefersApartment;
    }

    public void setPrefersApartment(Boolean prefersApartment) {
        this.prefersApartment = prefersApartment;
    }

    public String getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(String wakeTime) {
        this.wakeTime = wakeTime;
    }

    public String getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(String sleepTime) {
        this.sleepTime = sleepTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

