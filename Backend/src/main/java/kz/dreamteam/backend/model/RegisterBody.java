package kz.dreamteam.backend.model;

//import io.swagger.v3.oas.annotations.media.Schema;

public class RegisterBody {

//    @Schema(description = "Имя")
    private String firstName;

//    @Schema(description = "Фамилия")
    private String lastName;

//    @Schema(description = "Email пользователя")
    private String email;

//    @Schema(description = "raw Пароль")
    private String rawPassword;

    //    @Schema(description = "Возрост")
    private String birthDate;

//    @Schema(description = "Пол")
    private Character sex;




    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRawPassword() {
        return rawPassword;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public Character getSex() {
        return sex;
    }


}
