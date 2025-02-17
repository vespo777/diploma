package kz.dreamteam.backend.model.dto;

public class UpdateLocationDetailsDto {
    private String regionFrom;
    private String currentCity;

    public String getRegionFrom() {
        return regionFrom;
    }

    public String getCurrentCity() {
        return currentCity;
    }

    public void setCurrentCity(String currentCity) {
        this.currentCity = currentCity;
    }

    public void setRegionFrom(String regionFrom) {
        this.regionFrom = regionFrom;
    }
}

