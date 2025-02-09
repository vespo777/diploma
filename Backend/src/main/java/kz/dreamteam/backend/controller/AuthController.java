package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.LoginBody;
import kz.dreamteam.backend.model.RegisterBody;
import kz.dreamteam.backend.service.AuthService;
import kz.dreamteam.backend.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthController {


    private final PasswordService passwordService;
    private final AuthService authService;

    @Autowired
    public AuthController(PasswordService passwordService, AuthService authService) {
        this.passwordService = passwordService;
        this.authService = authService;
    }


    @PostMapping("/register")
//    @Operation(description = "Аутентификация системного пользователя",
//            responses = {@ApiResponse(content = @Content(schema = @Schema(implementation = SessionResponse.class)))})
//    @ApiResponseCodes({ExtendedResultCode.USER_NOT_FOUND})
    public ResponseEntity<String> register(@RequestBody RegisterBody body) {
        return this.passwordService.register(body);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginBody body) {
        return this.authService.login(body);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(String email, String newPassword) {
        return this.authService.resetPassword(email, newPassword);
    }

//    @PostMapping("/send-code-to-email")
//    public ResponseEntity<?> sendCodeToEmail(String email) {
//        return this.authService.sendCodeToEmail(email);
//    }





//    @PreAuthorize("hasRole('USER')")
//    @GetMapping("/profile")
//    public ResponseEntity<User> getProfile(Authentication authentication) {
//        String username = authentication.getName();
//        User user = userRepository.findByEmail(username)
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//
//        return ResponseEntity.ok(user);
//    }


}
