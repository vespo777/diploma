package kz.dreamteam.backend.service;

import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.LocationDetails;
import kz.dreamteam.backend.model.RoommatePreferences;
import kz.dreamteam.backend.model.SocialDetails;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.UpdateUserProfileRequest;
import kz.dreamteam.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;
    private final MlQuestionsAnswersRepository mlQuestionsAnswersRepository;
    private final JwtService jwtService;


    public UserService(UserRepository userRepository,
                       SocialDetailsRepository socialDetailsRepository,
                       LocationDetailsRepository locationDetailsRepository,
                       RoommatePreferencesRepository roommatePreferencesRepository,
                       MlQuestionsAnswersRepository mlQuestionsAnswersRepository,
                       JwtService jwtService){
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
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

    public ResponseEntity<?> getUserById(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with ID " + userId + " not found");
        }
    }


    @Transactional
    public ResponseEntity<String> updateUserProfile(Long userId, UpdateUserProfileRequest updateRequest) {
        try {
            // Обновление данных пользователя
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

//            user.setName(updateRequest.getName());
//            user.setSurname(updateRequest.getSurname());
//            user.setEmail(updateRequest.getEmail());
////            user.setDateOfBirth(updateRequest);
//            user.setSex(updateRequest.getSex());
            userRepository.save(user);

            // Обновление социального профиля
            SocialDetails socialDetails = socialDetailsRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("Social details not found"));

//            socialDetails.setSmoking(updateRequest.getSmoking());
//            socialDetails.setDrinking(updateRequest.getDrinking());
//            socialDetails.setReligion(updateRequest.getReligion());
//            socialDetails.setSports(updateRequest.getSports());
//            socialDetails.setLifePlans(updateRequest.getLifePlans());
            socialDetailsRepository.save(socialDetails);

            // Обновление информации о местоположении
            LocationDetails locationDetails = locationDetailsRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("Location details not found"));

//            locationDetails.setCityFrom(updateRequest.getCityFrom());
//            locationDetails.setCurrentCity(updateRequest.getCurrentCity());
//            locationDetails.setSchool(updateRequest.getSchool());
//            locationDetails.setUniversity(updateRequest.getUniversity());
//            locationDetails.setWorkplace(updateRequest.getWorkplace());
            locationDetailsRepository.save(locationDetails);

            // Обновление предпочтений по сожителям
            RoommatePreferences roommatePreferences = roommatePreferencesRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("Roommate preferences not found"));

//            roommatePreferences.setPrefersDorm(updateRequest.getPrefersDorm());
//            roommatePreferences.setPrefersApartment(updateRequest.getPrefersApartment());
//            roommatePreferences.setWakeTime(updateRequest.getWakeTime());
//            roommatePreferences.setSleepTime(updateRequest.getSleepTime());
            roommatePreferencesRepository.save(roommatePreferences);

            return ResponseEntity.ok("User profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed: " + e.getMessage());
        }
    }


    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }










}
