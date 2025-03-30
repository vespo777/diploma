package kz.dreamteam.backend.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "apartments")
public class ApartmentDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Description is required")
    private String description;

    private String photoPath;

    private String location2Gis;

    private String linkToKrishaKz;

    @Min(value = 1, message = "Room quantity must be at least 1")
    private int roomQuantity;

    @Min(value = 1, message = "Size must be at least 1 square meter")
    private int sizeSquareMeter;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public int getRoomQuantity() {
        return roomQuantity;
    }

    public void setRoomQuantity(int roomQuantity) {
        this.roomQuantity = roomQuantity;
    }

    public int getSizeSquareMeter() {
        return sizeSquareMeter;
    }

    public void setSizeSquareMeter(int sizeSquareMeter) {
        this.sizeSquareMeter = sizeSquareMeter;
    }
}

