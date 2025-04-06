package kz.dreamteam.backend.model.dto;


public class ContactsDto {

    private Long userId;
    private String callNumber;
    private String telegramNickname;
    private Boolean isNumberVisible;

    // Геттеры и сеттеры

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCallNumber() {
        return callNumber;
    }

    public void setCallNumber(String callNumber) {
        this.callNumber = callNumber;
    }

    public String getTelegramNickname() {
        return telegramNickname;
    }

    public void setTelegramNickname(String telegramNickname) {
        this.telegramNickname = telegramNickname;
    }

    public Boolean getIsNumberVisible() {
        return isNumberVisible;
    }

    public void setIsNumberVisible(Boolean isNumberVisible) {
        this.isNumberVisible = isNumberVisible;
    }
}

