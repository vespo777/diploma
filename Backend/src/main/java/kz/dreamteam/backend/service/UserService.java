package kz.dreamteam.backend.service;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.*;
import kz.dreamteam.backend.model.dto.UpdateUserProfileRequest;
import kz.dreamteam.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final MlQuestionsAnswersRepository mlQuestionsAnswersRepository;
    private final JwtService jwtService;


    public UserService(UserRepository userRepository,
                       SocialDetailsRepository socialDetailsRepository,
                       LocationDetailsRepository locationDetailsRepository,
                       RoommatePreferencesRepository roommatePreferencesRepository,
                       PersonalInfoRepository personalInfoRepository,
                       MlQuestionsAnswersRepository mlQuestionsAnswersRepository,
                       JwtService jwtService){
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.mlQuestionsAnswersRepository = mlQuestionsAnswersRepository;
        this.jwtService = jwtService;
    }


    public ResponseEntity<Boolean> checkMlQuestionsAnswers(Long userId) {
        boolean result = mlQuestionsAnswersRepository.findByUserId(userId).isPresent();

        return ResponseEntity.ok(result);
    }

    public ResponseEntity<?> getCurrentUser(String token) {
        Long userId = jwtService.getUserIdFromToken(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return ResponseEntity.ok(user);
    }

//    @Cacheable(value = "users", key = "#userId")
    public User getUserById(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
//    @CacheEvict(value = "users", key = "#userId")
    public String updateUserProfile(Long userId, UpdateUserProfileRequest updateRequest) {
        try {
            // Обновление данных пользователя
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));
            user.setProfilePhotoPath("newnewnew");
            userRepository.save(user);

            // Обновление личные данные профиля
            PersonalInfo personalInfo = personalInfoRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("Personal info not found"));
            personalInfo.setName("Updated");

            personalInfoRepository.save(personalInfo);

            // Обновление социального профиля
            SocialDetails socialDetails = socialDetailsRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("Social details not found"));

            socialDetailsRepository.save(socialDetails);

            // Обновление информации о местоположении
            LocationDetails locationDetails = locationDetailsRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("Location details not found"));

            locationDetailsRepository.save(locationDetails);

            // Обновление предпочтений по сожителям
            RoommatePreferences roommatePreferences = roommatePreferencesRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("Roommate preferences not found"));


            roommatePreferencesRepository.save(roommatePreferences);

            return "User profile updated successfully";
        } catch (Exception e) {
            return "Update failed: " + e.getMessage();
        }
    }


    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }










}
