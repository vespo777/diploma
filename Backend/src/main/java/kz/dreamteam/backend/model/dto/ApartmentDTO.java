package kz.dreamteam.backend.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.elasticsearch.annotations.Document;

import kz.dreamteam.backend.model.enums.PropertyType;

@Document(indexName = "apartments")
public class ApartmentDTO {

//    private Long userId;
    private String title;
    private String description;
    private Integer price;
    private String location;
    private String photoPath;
    private String address;
    private String location2Gis;
    private PropertyType propertyType;
    private Boolean furnished;
    private Boolean internetIncluded;
    private Boolean utilitiesIncluded;
    private String phoneNumber;
    private Boolean petsAllowed;
    private Boolean parkingAvailable;
    private String linkToKrishaKz;
    private Integer roomQuantity;
    private Integer sizeSquareMeter;

    // Геттеры и сеттеры

//    public Long getUserId() {
//        return userId;
//    }
//
//    public void setUserId(Long userId) {
//        this.userId = userId;
//    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getLocation2Gis() {
        return location2Gis;
    }

    public void setLocation2Gis(String location2Gis) {
        this.location2Gis = location2Gis;
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

    public Boolean getParkingAvailable() {
        return parkingAvailable;
    }

    public void setParkingAvailable(Boolean parkingAvailable) {
        this.parkingAvailable = parkingAvailable;
    }

    public Boolean getPetsAllowed() {
        return petsAllowed;
    }

    public void setPetsAllowed(Boolean petsAllowed) {
        this.petsAllowed = petsAllowed;
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

