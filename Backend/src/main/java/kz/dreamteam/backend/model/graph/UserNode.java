package kz.dreamteam.backend.model.graph;

import java.time.LocalTime;
import java.util.List;

public class UserNode {
    public int id;
    public int age;
    public List<String> interests;
    public String regionFrom;
    public List<String> languages;
    public String religion;
    public String petsStatus;
    public LocalTime sleepTime;
    public int budgetMax;
    public int personalityType;
    public String profession;
    public boolean drinking;
    public boolean smoking;
    public String universityName;

    // Конструкторы, геттеры и сеттеры

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public String getRegionFrom() {
        return regionFrom;
    }

    public void setRegionFrom(String regionFrom) {
        this.regionFrom = regionFrom;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getPetsStatus() {
        return petsStatus;
    }

    public void setPetsStatus(String petsStatus) {
        this.petsStatus = petsStatus;
    }

    public LocalTime getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(LocalTime sleepTime) {
        this.sleepTime = sleepTime;
    }

    public int getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(int budgetMax) {
        this.budgetMax = budgetMax;
    }

    public int getPersonalityType() {
        return personalityType;
    }

    public void setPersonalityType(int personalityType) {
        this.personalityType = personalityType;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public boolean isDrinking() {
        return drinking;
    }

    public void setDrinking(boolean drinking) {
        this.drinking = drinking;
    }

    public boolean isSmoking() {
        return smoking;
    }

    public void setSmoking(boolean smoking) {
        this.smoking = smoking;
    }

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }
}

