package kz.dreamteam.backend.service;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.*;
import kz.dreamteam.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class PasswordService {
    private static final Logger log = LoggerFactory.getLogger(PasswordService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final RoommateSearchRepository roommateSearchRepository;
    private final ContactsRepository contactsRepository;


    public PasswordService(UserRepository userRepository,
                           SocialDetailsRepository socialDetailsRepository,
                           LocationDetailsRepository locationDetailsRepository,
                           RoommatePreferencesRepository roommatePreferencesRepository,
                           PersonalInfoRepository personalInfoRepository,
                           RoommateSearchRepository roommateSearchRepository,
                           ContactsRepository contactsRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.roommateSearchRepository = roommateSearchRepository;
        this.contactsRepository = contactsRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }


    private void createEmptyPersonalInfo(User user, String name, String surname) {
        try {
            PersonalInfo personalInfo = new PersonalInfo();

            personalInfo.setName(name);
            personalInfo.setSurname(surname);
            personalInfo.setUser(user); // Link to the user
            personalInfoRepository.save(personalInfo); // Save empty entry
        } catch (Exception e) { log.error("Error in createEmptyPersonalInfo", e); }
    }

    private void createEmptyRoommateSearch(User user) {
        try {
            RoommateSearch roommateSearch = new RoommateSearch();
            roommateSearch.setUser(user); // Link to the user
            roommateSearchRepository.save(roommateSearch); // Save empty entry
        } catch (Exception e) { log.error("Error in createEmptyRoommateSearch", e); }

    }

    private void createEmptyContacts(User user) {
        try {
            Contacts contacts = new Contacts();
            contacts.setUser(user); // Link to the user
            contactsRepository.save(contacts); // Save empty entry
        } catch (Exception e) { log.error("Error in createEmptyContacts", e); }
    }

    private void createEmptyLocationDetails(User user) {
        try {
            LocationDetails locationDetails = new LocationDetails();
            locationDetails.setUser(user); // Link to the user
            locationDetailsRepository.save(locationDetails); // Save empty entry
        } catch (Exception e) { log.error("Error in createEmptyLocationDetails", e); }

    }

    private void createEmptySocialDetails(User user) {
        try {
            SocialDetails socialDetails = new SocialDetails();
            socialDetails.setUser(user); // Link to the user
            socialDetailsRepository.save(socialDetails); // Save empty entry
        } catch (Exception e) { log.error("Error in createEmptySocialDetails", e); }
    }

    private void createEmptyRoommatePreferences(User user) {
        try {
            RoommatePreferences roommatePreferences = new RoommatePreferences();
            roommatePreferences.setUser(user); // Link to the user
            roommatePreferencesRepository.save(roommatePreferences); // Save empty entry
        } catch (Exception e) { log.error("Error in createEmptyRoommatePreferences", e); }

    }

    @Transactional
    public ResponseEntity<String> register(RegisterBody request) {
        try {
            var user = new User();
            user.setEmail(request.getEmail());
            user.setPasswordHash(encodePassword(request.getRawPassword()));
            user.setProfilePhotoPath("default");

            userRepository.save(user);

            createEmptyPersonalInfo(user, request.getName(), request.getSurname());
            createEmptySocialDetails(user);
            createEmptyRoommateSearch(user);
            createEmptyRoommatePreferences(user);
            createEmptyLocationDetails(user);
            createEmptyContacts(user);


            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            // Handle exceptions and return error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }



}
