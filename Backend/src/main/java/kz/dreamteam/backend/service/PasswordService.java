package kz.dreamteam.backend.service;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.*;
import kz.dreamteam.backend.repository.LocationDetailsRepository;
import kz.dreamteam.backend.repository.RoommatePreferencesRepository;
import kz.dreamteam.backend.repository.SocialDetailsRepository;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;


    public PasswordService(UserRepository userRepository,
                           SocialDetailsRepository socialDetailsRepository,
                           LocationDetailsRepository locationDetailsRepository,
                           RoommatePreferencesRepository roommatePreferencesRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private void createEmptyLocationDetails(User user) {
        LocationDetails locationDetails = new LocationDetails();
        locationDetails.setUser(user); // Link to the user
        locationDetailsRepository.save(locationDetails); // Save empty entry
    }

    private void createEmptySocialDetails(User user) {
        SocialDetails socialDetails = new SocialDetails();
        socialDetails.setUser(user); // Link to the user
        socialDetailsRepository.save(socialDetails); // Save empty entry
    }

    private void createEmptyRoommatePreferences(User user) {
        RoommatePreferences roommatePreferences = new RoommatePreferences();
        roommatePreferences.setUser(user); // Link to the user
        roommatePreferencesRepository.save(roommatePreferences); // Save empty entry
    }

    @Transactional
    public ResponseEntity<String> register(RegisterBody request) {
        try {
            var user = new User();
            user.setName(request.getName());
            user.setSurname(request.getSurname());
            user.setEmail(request.getEmail());
            user.setPasswordHash(encodePassword(request.getRawPassword()));
            user.setAge(request.getAge());
            user.setSex(request.getSex());

            userRepository.save(user);

            createEmptyLocationDetails(user);
            createEmptySocialDetails(user);
            createEmptyRoommatePreferences(user);

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            // Handle exceptions and return error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }



}
