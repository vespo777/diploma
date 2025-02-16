package kz.dreamteam.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
@Table(name = "contacts")
public class Contacts {

    @Id
    @Column(name = "user_id") // Первичный ключ такой же, как в User
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(length = 20)
    private String callNumber;
    @Column(length = 70)
    private String telegramNickname;

    private Boolean isNumberVisible;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCallNumber() {
        return callNumber;
    }

    public void setCallNumber(String callNumber) {
        this.callNumber = callNumber;
    }

    public String getTelegramNickname() {
        return telegramNickname;
    }

    public void setTelegramNickname(String telegramNickname) {
        this.telegramNickname = telegramNickname;
    }

    public Boolean getNumberVisible() {
        return isNumberVisible;
    }

    public void setNumberVisible(Boolean numberVisible) {
        isNumberVisible = numberVisible;
    }
}
