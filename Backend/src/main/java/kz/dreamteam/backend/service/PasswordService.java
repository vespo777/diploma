package kz.dreamteam.backend.service;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.*;
import kz.dreamteam.backend.repository.*;
import kz.dreamteam.backend.util.DateUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PasswordService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final RoommateSearchRepository roommateSearchRepository;


    public PasswordService(UserRepository userRepository,
                           SocialDetailsRepository socialDetailsRepository,
                           LocationDetailsRepository locationDetailsRepository,
                           RoommatePreferencesRepository roommatePreferencesRepository,
                           PersonalInfoRepository personalInfoRepository,
                           RoommateSearchRepository roommateSearchRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.roommateSearchRepository = roommateSearchRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }


    private void createEmptyPersonalInfo(User user) {
        PersonalInfo personalInfo = new PersonalInfo();
        personalInfo.setUser(user); // Link to the user
        personalInfoRepository.save(personalInfo); // Save empty entry
    }

    private void createRoomateSearch(User user) {
        RoommateSearch roommateSearch = new RoommateSearch();
        roommateSearch.setUser(user); // Link to the user
        roommateSearchRepository.save(roommateSearch); // Save empty entry
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
            user.setEmail(request.getEmail());
            user.setPasswordHash(encodePassword(request.getRawPassword()));

            userRepository.save(user);

            createEmptyPersonalInfo(user);
            createRoomateSearch(user);
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
