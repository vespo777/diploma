package kz.dreamteam.backend.model.dto;

import kz.dreamteam.backend.model.Team;
import kz.dreamteam.backend.model.User;

public class NotificationDTO {

    private String type;
    private User user;
    private Team team;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}
