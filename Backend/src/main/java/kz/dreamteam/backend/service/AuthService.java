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
    private static final String SECRET_KEY = "secretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkey";
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String generateJwtToken(User user) {
        // Это простая генерация токена, в реальном проекте вам нужно будет использовать библиотеку для JWT
        return Jwts.builder()
                .setSubject(user.getEmail()) // Используйте email или user_id как уникальный идентификатор
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 часа
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY) // Используйте секретный ключ
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey("secretkey")
                .parseClaimsJws(token)
                .getBody();
    }

//    public boolean validateToken(String token, UserDetails userDetails) {
//        String username = getClaimsFromToken(token).getSubject();
//        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//    }

    private boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new Date());
    }



    public ResponseEntity<String> login(LoginBody body) {
        try {
            // Найти пользователя по email
            User user = userRepository.findByEmail(body.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Проверить, соответствует ли пароль
            if (passwordEncoder.matches(body.getPassword(), user.getPasswordHash())) {
                // Если пароль верный, создаем токен (можно использовать JWT)
                String token = generateJwtToken(user); // Метод для создания токена

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
