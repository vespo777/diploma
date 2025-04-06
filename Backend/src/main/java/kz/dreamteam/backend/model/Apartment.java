package kz.dreamteam.backend.model;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import kz.dreamteam.backend.model.enums.PropertyType;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.InnerField;

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

    private String photoPath; // URL to the photo

    private String title;
    private String description;
    private Integer price;
    private String location;
    private String address;
    private String location2Gis;
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType; // room, house, hostel
    private Boolean furnished;
    private Boolean internetIncluded;
    private Boolean utilitiesIncluded;
    private String phoneNumber;
    private Boolean petsAllowed;
    private Boolean parkingAvailable;

    private String linkToKrishaKz; // URL to the listing on krisha.kz
    private Integer roomQuantity;
    private Integer sizeSquareMeter;
    @Field(type = FieldType.Text)
    private String descriptionJunk;

    @Field(type = FieldType.Keyword)
    private String descriptionJunkKeyword;


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
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

    public String getDescriptionJunk() {
        return descriptionJunk;
    }

    public void setDescriptionJunk(String descriptionJunk) {
        this.descriptionJunk = descriptionJunk;
    }

    public String getDescriptionJunkKeyword() {
        return descriptionJunkKeyword;
    }

    public void setDescriptionJunkKeyword(String descriptionJunkKeyword) {
        this.descriptionJunkKeyword = descriptionJunkKeyword;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public Boolean getFurnished() {
        return furnished;
    }

    public void setFurnished(Boolean furnished) {
        this.furnished = furnished;
    }

    public Boolean getInternetIncluded() {
        return internetIncluded;
    }

    public void setInternetIncluded(Boolean internetIncluded) {
        this.internetIncluded = internetIncluded;
    }

    public Boolean getUtilitiesIncluded() {
        return utilitiesIncluded;
    }

    public void setUtilitiesIncluded(Boolean utilitiesIncluded) {
        this.utilitiesIncluded = utilitiesIncluded;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Boolean getPetsAllowed() {
        return petsAllowed;
    }

    public void setPetsAllowed(Boolean petsAllowed) {
        this.petsAllowed = petsAllowed;
    }

    public Boolean getParkingAvailable() {
        return parkingAvailable;
    }

    public void setParkingAvailable(Boolean parkingAvailable) {
        this.parkingAvailable = parkingAvailable;
    }

    @PostLoad
    @PostPersist
    @PostUpdate
    public void generateDescriptionJunk() {
        String combined = (
                safeStr(apartmentId) + " " +
                        safeStr(userId) + " " +
                        safeStr(description) + " " +
                        safeStr(photoPath) + " " +
                        safeStr(location2Gis) + " " +
                        safeStr(linkToKrishaKz) + " " +
                        safeStr(roomQuantity) + " " +
                        safeStr(sizeSquareMeter)
        ).toLowerCase();

        this.descriptionJunk = combined;
        this.descriptionJunkKeyword = combined;
    }

    private String safeStr(Object obj) {
        return obj != null ? obj.toString() : "";
    }
}
