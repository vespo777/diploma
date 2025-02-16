package kz.dreamteam.backend.model;

//import io.swagger.v3.oas.annotations.media.Schema;

public class RegisterBody {
    //    @Schema(description = "Email пользователя")
    private String email;

//    @Schema(description = "Имя")
    private String name;

//    @Schema(description = "Фамилия")
    private String surname;

//    @Schema(description = "raw Пароль")
    private String rawPassword;




    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public String getRawPassword() {
        return rawPassword;
    }

}
