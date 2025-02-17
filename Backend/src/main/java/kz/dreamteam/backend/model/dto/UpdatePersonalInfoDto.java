package kz.dreamteam.backend.model.dto;

import java.time.LocalDate;

public class UpdatePersonalInfoDto {
    private LocalDate birthDate;
    private Character gender;
    private String religion;
    private String nationality;

    // Constructors
    public UpdatePersonalInfoDto() {}

    public UpdatePersonalInfoDto(LocalDate birthDate,
                           Character gender, String religion, String nationality) {
        this.birthDate = birthDate;
        this.gender = gender;
        this.religion = religion;
        this.nationality = nationality;
    }

    // Getters and Setters
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public Character getGender() { return gender; }
    public void setGender(Character gender) { this.gender = gender; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
}

