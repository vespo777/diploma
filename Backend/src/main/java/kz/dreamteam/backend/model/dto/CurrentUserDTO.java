package kz.dreamteam.backend.model.dto;

import kz.dreamteam.backend.model.LocationDetails;
import kz.dreamteam.backend.model.RoommatePreferences;
import kz.dreamteam.backend.model.SocialDetails;
import kz.dreamteam.backend.model.User;

public class CurrentUserDTO {
    private User user;
    private SocialDetails socialDetails;
    private LocationDetails locationDetails;
    private RoommatePreferences roommatePreferences;

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SocialDetails getSocialDetails() {
        return socialDetails;
    }

    public void setSocialDetails(SocialDetails socialDetails) {
        this.socialDetails = socialDetails;
    }

    public LocationDetails getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(LocationDetails locationDetails) {
        this.locationDetails = locationDetails;
    }

    public RoommatePreferences getRoommatePreferences() {
        return roommatePreferences;
    }

    public void setRoommatePreferences(RoommatePreferences roommatePreferences) {
        this.roommatePreferences = roommatePreferences;
    }
}
