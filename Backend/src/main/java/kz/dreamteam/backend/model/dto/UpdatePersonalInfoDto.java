package kz.dreamteam.backend.model.dto;

import java.time.LocalDate;

public class UpdatePersonalInfoDto {
    private Long userId;
    private String name;
    private String surname;
    private LocalDate birthDate;
    private Character gender;
    private String religion;
    private String nationality;

    // Constructors
    public UpdatePersonalInfoDto() {}

    public UpdatePersonalInfoDto(Long userId, String name, String surname, LocalDate birthDate,
                           Character gender, String religion, String nationality) {
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.birthDate = birthDate;
        this.gender = gender;
        this.religion = religion;
        this.nationality = nationality;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public Character getGender() { return gender; }
    public void setGender(Character gender) { this.gender = gender; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
}

