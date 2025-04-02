package kz.dreamteam.backend.model;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import org.springframework.data.elasticsearch.annotations.Document;

@Entity
@Table(name = "apartments")
@Document(indexName = "apartments")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "apartmentId")
public class Apartment {

    @Id
    @org.springframework.data.annotation.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apartment_id")
    private Long apartmentId;

    @JoinColumn(name = "user_id")
    private Long userId;  // Each apartment is associated with one user

    private String description;

    private String photoPath; // URL to the photo

    private String location2Gis;

    private String linkToKrishaKz; // URL to the listing on krisha.kz

    private Integer roomQuantity;
    private Integer sizeSquareMeter;

    public Long getUser() {
        return userId;
    }

    public void setUser(Long userId) {
        this.userId = userId;
    }

    public Long getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(Long apartmentId) {
        this.apartmentId = apartmentId;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public String getLocation2Gis() {
        return location2Gis;
    }

    public void setLocation2Gis(String location2Gis) {
        this.location2Gis = location2Gis;
    }

    public String getLinkToKrishaKz() {
        return linkToKrishaKz;
    }

    public void setLinkToKrishaKz(String linkToKrishaKz) {
        this.linkToKrishaKz = linkToKrishaKz;
    }

    public Integer getRoomQuantity() {
        return roomQuantity;
    }

    public void setRoomQuantity(Integer roomQuantity) {
        this.roomQuantity = roomQuantity;
    }

    public Integer getSizeSquareMeter() {
        return sizeSquareMeter;
    }

    public void setSizeSquareMeter(Integer sizeSquareMeter) {
        this.sizeSquareMeter = sizeSquareMeter;
    }
}
