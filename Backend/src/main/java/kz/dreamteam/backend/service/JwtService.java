package kz.dreamteam.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import kz.dreamteam.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    private static final String SECRET_KEY = "secretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkeysecretkey"; // Замените на свой ключ


    public String generateJwtToken(User user) {
        // Это простая генерация токена, в реальном проекте вам нужно будет использовать библиотеку для JWT
        return Jwts.builder()
                .setSubject(String.valueOf(user.getUserId())) // Используйте email или user_id как уникальный идентификатор
                .claim("user_id", user.getUserId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 часа 86400000
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY) // Используйте секретный ключ
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }


    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("user_id", Long.class); // "user_id" - ключ, хранящий user_id в payload
    }

    private boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new Date());
    }


    //    public boolean validateToken(String token, UserDetails userDetails) {
//        String username = getClaimsFromToken(token).getSubject();
//        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//    }


}

