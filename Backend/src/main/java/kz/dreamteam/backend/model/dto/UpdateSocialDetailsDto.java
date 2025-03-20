package kz.dreamteam.backend.model.dto;


import java.util.List;

public class UpdateSocialDetailsDto {
    private String schoolName;
    private String universityName;
    private String universitySpecialty;
    private Boolean drinking;
    private Boolean smoking;
    private String company;
    private String profession;
    private List<String> interests;

    // Default constructor
    public UpdateSocialDetailsDto() {}

    // Getters and Setters
    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public String getUniversitySpecialty() {
        return universitySpecialty;
    }

    public void setUniversitySpecialty(String universitySpecialty) {
        this.universitySpecialty = universitySpecialty;
    }

    public Boolean getDrinking() {
        return drinking;
    }

    public void setDrinking(Boolean drinking) {
        this.drinking = drinking;
    }

    public Boolean getSmoking() {
        return smoking;
    }

    public void setSmoking(Boolean smoking) {
        this.smoking = smoking;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }
}

