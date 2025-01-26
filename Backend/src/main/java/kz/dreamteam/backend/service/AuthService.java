package kz.dreamteam.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import kz.dreamteam.backend.model.LoginBody;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AuthService(JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<String> login(LoginBody body) {
        try {
            // Найти пользователя по email
            User user = userRepository.findByEmail(body.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Проверить, соответствует ли пароль
            if (passwordEncoder.matches(body.getPassword(), user.getPasswordHash())) {
                // Если пароль верный, создаем токен (можно использовать JWT)
                String token = jwtService.generateJwtToken(user); // Метод для создания токена

                return ResponseEntity.ok("Bearer " + token); // Возвращаем токен
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Login failed: " + e.getMessage());
        }
    }


    public ResponseEntity<String> resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }






}
