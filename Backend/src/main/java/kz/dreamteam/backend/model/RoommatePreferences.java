package kz.dreamteam.backend.model;

import jakarta.persistence.*;

@Entity
public class RoommatePreferences {

    @Id
    private Long userId;

    private Boolean prefersDorm;
    private Boolean prefersApartment;
    private String wakeTime;
    private String sleepTime;

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

