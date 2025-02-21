package kz.dreamteam.backend.controller;

import io.jsonwebtoken.Claims;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.UpdateUserProfileRequest;
import kz.dreamteam.backend.service.JwtService;
import kz.dreamteam.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final JwtService jwtService;
    private final UserService userService;

    public UserController(JwtService jwtService, UserService userService){
        this.jwtService = jwtService;
        this.userService = userService;
    }


    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        // Извлекаем токен из заголовка
        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;

        return this.userService.getCurrentUser(token);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return this.userService.getUserById(userId);
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable Long userId,
            @RequestBody UpdateUserProfileRequest updateRequest) {
        return userService.updateUserProfile(userId, updateRequest);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getAllUsers();
    }


    @GetMapping("/checkBirthDate")
    public ResponseEntity<Boolean> getAllUsers(@RequestParam Long userId) {
        return userService.checkMlQuestionsAnswers(userId);
    }


}
