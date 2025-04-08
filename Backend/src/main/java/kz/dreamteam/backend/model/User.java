package kz.dreamteam.backend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import org.springframework.data.elasticsearch.annotations.Document;


@Entity
@Table(name = "users") // Matches the table name
@Document(indexName = "users")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(columnDefinition = "TEXT")
    private String profilePhotoPath;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.springframework.data.annotation.Transient
//    @JsonManagedReference
//    @JsonIgnore
    private PersonalInfo personalInfo;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.springframework.data.annotation.Transient
//    @JsonManagedReference
    private RoommateSearch roommateSearch;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.springframework.data.annotation.Transient
//    @JsonManagedReference
    private SocialDetails socialDetails;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.springframework.data.annotation.Transient
//    @JsonManagedReference
    private LocationDetails locationDetails;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.springframework.data.annotation.Transient
//    @JsonManagedReference
    private RoommatePreferences roommatePreferences;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.springframework.data.annotation.Transient
//    @JsonManagedReference
    private Contacts contacts;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @org.springframework.data.annotation.Transient
//    @JsonIgnore
    private Team team;

//    @OneToOne(mappedBy = "roommate", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
//    @org.springframework.data.annotation.Transient
////    @JsonManagedReference
//    private RoommateRating roommateRating;
//
//    public RoommateRating getRoommateRating() {
//        return roommateRating;
//    }
//
//    public void setRoommateRating(RoommateRating roommateRating) {
//        this.roommateRating = roommateRating;
//    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
    }

    public RoommateSearch getRoommateSearch() {
        return roommateSearch;
    }

    public void setRoommateSearch(RoommateSearch roommateSearch) {
        this.roommateSearch = roommateSearch;
    }

    public RoommatePreferences getRoommatePreferences() {
        return roommatePreferences;
    }

    public void setRoommatePreferences(RoommatePreferences roommatePreferences) {
        this.roommatePreferences = roommatePreferences;
    }

    public LocationDetails getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(LocationDetails locationDetails) {
        this.locationDetails = locationDetails;
    }

    public SocialDetails getSocialDetails() {
        return socialDetails;
    }

    public void setSocialDetails(SocialDetails socialDetails) {
        this.socialDetails = socialDetails;
    }

    public Contacts getContacts() {
        return contacts;
    }

    public void setContacts(Contacts contacts) {
        this.contacts = contacts;
    }

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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getProfilePhotoPath() {
        return profilePhotoPath;
    }

    public void setProfilePhotoPath(String profilePhotoPath) {
        this.profilePhotoPath = profilePhotoPath;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", email='" + email + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                ", profilePhotoPath='" + profilePhotoPath + '\'' +
                ", personalInfo=" + personalInfo +
                ", roommateSearch=" + roommateSearch +
                ", socialDetails=" + socialDetails +
                ", locationDetails=" + locationDetails +
                ", roommatePreferences=" + roommatePreferences +
                ", contacts=" + contacts +
                '}';
    }
}

