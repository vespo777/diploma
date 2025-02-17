package kz.dreamteam.backend.model.dto;

public class UpdateContactsDto {
    private String callNumber;
    private String telegramNickname;

    public String getCallNumber() {
        return callNumber;
    }

    public String getTelegramNickname() {
        return telegramNickname;
    }

    public void setTelegramNickname(String telegramNickname) {
        this.telegramNickname = telegramNickname;
    }

    public void setCallNumber(String callNumber) {
        this.callNumber = callNumber;
    }
}

