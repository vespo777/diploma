package kz.dreamteam.backend.model.dto;

public class UpdateUserProfileRequest {
    private String name;
    private String surname;
    private String email;
    private Integer age;
    private Character sex;
    private Boolean smoking;
    private Boolean drinking;
    private String religion;
    private String sports;
    private String lifePlans;
    private String cityFrom;
    private String currentCity;
    private String school;
    private String university;
    private String workplace;
    private Boolean prefersDorm;
    private Boolean prefersApartment;
    private String wakeTime;
    private String sleepTime;

    // Геттеры и сеттеры

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Character getSex() {
        return sex;
    }

    public void setSex(Character sex) {
        this.sex = sex;
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

    public String getSports() {
        return sports;
    }

    public void setSports(String sports) {
        this.sports = sports;
    }

    public String getLifePlans() {
        return lifePlans;
    }

    public void setLifePlans(String lifePlans) {
        this.lifePlans = lifePlans;
    }

    public String getCityFrom() {
        return cityFrom;
    }

    public void setCityFrom(String cityFrom) {
        this.cityFrom = cityFrom;
    }

    public String getCurrentCity() {
        return currentCity;
    }

    public void setCurrentCity(String currentCity) {
        this.currentCity = currentCity;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getWorkplace() {
        return workplace;
    }

    public void setWorkplace(String workplace) {
        this.workplace = workplace;
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
}