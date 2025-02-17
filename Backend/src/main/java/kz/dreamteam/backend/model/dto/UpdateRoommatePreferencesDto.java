package kz.dreamteam.backend.model.dto;

import java.time.LocalTime;

public class UpdateRoommatePreferencesDto {
    private LocalTime wakeTime;
    private LocalTime sleepTime;
    private String pets;

    // Constructors
    public UpdateRoommatePreferencesDto() {}

    public UpdateRoommatePreferencesDto(LocalTime wakeTime, LocalTime sleepTime, String pets) {
        this.wakeTime = wakeTime;
        this.sleepTime = sleepTime;
        this.pets = pets;
    }

    // Getters and Setters
    public LocalTime getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(LocalTime wakeTime) {
        this.wakeTime = wakeTime;
    }

    public LocalTime getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(LocalTime sleepTime) {
        this.sleepTime = sleepTime;
    }

    public String getPets() {
        return pets;
    }

    public void setPets(String pets) {
        this.pets = pets;
    }
}

