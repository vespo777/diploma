package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.RegisterBody;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public PasswordService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public ResponseEntity<String> register(RegisterBody body) {
        try {
            var user = new User();
            user.setName(body.getName());
            user.setSurname(body.getSurname());
            user.setEmail(body.getEmail());
            user.setPasswordHash(encodePassword(body.getRawPassword()));
            user.setAge(body.getAge());
            user.setSex(body.getSex());
            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            // Handle exceptions and return error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }



}
