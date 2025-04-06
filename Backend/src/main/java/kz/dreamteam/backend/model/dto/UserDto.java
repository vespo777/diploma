package kz.dreamteam.backend.model.dto;


import java.io.Serializable;

public class UserDto implements Serializable {
    private Long userId;
    private String email;
    private String profilePhotoPath;

    private PersonalInfoDto personalInfo;
    private RoommateSearchDto roommateSearch;
    private SocialDetailsDto socialDetails;
    private LocationDetailsDto locationDetails;
    private RoommatePreferencesDto roommatePreferences;
    private ContactsDto contacts;
    private TeamDto team;

    // Геттеры и сеттеры

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePhotoPath() {
        return profilePhotoPath;
    }

    public void setProfilePhotoPath(String profilePhotoPath) {
        this.profilePhotoPath = profilePhotoPath;
    }

    public PersonalInfoDto getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfoDto personalInfo) {
        this.personalInfo = personalInfo;
    }

    public RoommateSearchDto getRoommateSearch() {
        return roommateSearch;
    }

    public void setRoommateSearch(RoommateSearchDto roommateSearch) {
        this.roommateSearch = roommateSearch;
    }

    public SocialDetailsDto getSocialDetails() {
        return socialDetails;
    }

    public void setSocialDetails(SocialDetailsDto socialDetails) {
        this.socialDetails = socialDetails;
    }

    public LocationDetailsDto getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(LocationDetailsDto locationDetails) {
        this.locationDetails = locationDetails;
    }

    public RoommatePreferencesDto getRoommatePreferences() {
        return roommatePreferences;
    }

    public void setRoommatePreferences(RoommatePreferencesDto roommatePreferences) {
        this.roommatePreferences = roommatePreferences;
    }

    public ContactsDto getContacts() {
        return contacts;
    }

    public void setContacts(ContactsDto contacts) {
        this.contacts = contacts;
    }

    public TeamDto getTeam() {
        return team;
    }

    public void setTeam(TeamDto team) {
        this.team = team;
    }
}

