package kz.dreamteam.backend.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.*;
import kz.dreamteam.backend.model.dto.UpdateUserProfileRequest;
import kz.dreamteam.backend.model.dto.UserDto;
import kz.dreamteam.backend.repository.*;
import kz.dreamteam.backend.util.UserMapper;
import org.hibernate.Hibernate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final ContactsRepository contactsRepository;
    private final RoommateSearchRepository roommateSearchRepository;
    private final MlQuestionsAnswersRepository mlQuestionsAnswersRepository;
    private final JwtService jwtService;
    private final ElasticsearchClient elasticsearchClient;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       SocialDetailsRepository socialDetailsRepository,
                       LocationDetailsRepository locationDetailsRepository,
                       RoommatePreferencesRepository roommatePreferencesRepository,
                       PersonalInfoRepository personalInfoRepository, ContactsRepository contactsRepository, RoommateSearchRepository roommateSearchRepository,
                       MlQuestionsAnswersRepository mlQuestionsAnswersRepository,
                       JwtService jwtService, ElasticsearchClient elasticsearchClient,
                       UserMapper userMapper){
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.contactsRepository = contactsRepository;
        this.roommateSearchRepository = roommateSearchRepository;
        this.mlQuestionsAnswersRepository = mlQuestionsAnswersRepository;
        this.jwtService = jwtService;
        this.elasticsearchClient = elasticsearchClient;
        this.userMapper = userMapper;
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

//    @CacheEvict(value = "users", key = "#userId")
    public void updateProfilePhoto(Long userId, String profilePhotoPath) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setProfilePhotoPath(profilePhotoPath);
        userRepository.save(user);
    }
//    @CacheEvict(value = "users", key = "#userId")
    public void deleteProfilePhoto(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setProfilePhotoPath("default");
        userRepository.save(user);
    }

//    @Cacheable(value = "users", key = "#userId")
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDto(user);
    }


    @Transactional
//    @CacheEvict(value = "users", key = "#userId")
    public String updateUser(Long userId, User updatedUser) {
        User currentUser  = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser == null) {
            throw new IllegalArgumentException("Updated user cannot be null");
        }

        // Обновляем поля, если новые данные предоставлены
        if (updatedUser.getEmail() != null) {
            currentUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPasswordHash() != null) {
            currentUser.setPasswordHash(updatedUser.getPasswordHash());
        }
        if (updatedUser.getProfilePhotoPath() != null) {
            currentUser.setProfilePhotoPath(updatedUser.getProfilePhotoPath());
        }

        // Обновляем связанные сущности, если они предоставлены
        if (updatedUser.getPersonalInfo() != null) {
//            if (currentUser.getPersonalInfo() != null) {
//                personalInfoRepository.delete(currentUser.getPersonalInfo());
//            }
//            currentUser.setPersonalInfo(updatedUser.getPersonalInfo());
//            personalInfoRepository.save(currentUser.getPersonalInfo());

            PersonalInfo currentPersonalInfo = currentUser.getPersonalInfo();
            PersonalInfo updatedPersonalInfo = updatedUser.getPersonalInfo();

            // Обновляем каждое поле, если оно не равно null
            if (updatedPersonalInfo.getName() != null) {
                currentPersonalInfo.setName(updatedPersonalInfo.getName());
            }
            if (updatedPersonalInfo.getSurname() != null) {
                currentPersonalInfo.setSurname(updatedPersonalInfo.getSurname());
            }
            if (updatedPersonalInfo.getBirthDate() != null) {
                currentPersonalInfo.setBirthDate(updatedPersonalInfo.getBirthDate());
            }
            if (updatedPersonalInfo.getGender() != null) {
                currentPersonalInfo.setGender(updatedPersonalInfo.getGender());
            }
            if (updatedPersonalInfo.getReligion() != null) {
                currentPersonalInfo.setReligion(updatedPersonalInfo.getReligion());
            }

            // Сохраняем обновленный объект
            personalInfoRepository.save(currentPersonalInfo);
        }

        if (updatedUser.getRoommateSearch() != null) {
            RoommateSearch currentRoommateSearch = currentUser.getRoommateSearch();
            RoommateSearch updatedRoommateSearch = updatedUser.getRoommateSearch();

            // Обновляем каждое поле, если оно не равно null
            if (updatedRoommateSearch.getSearchStatus() != null) {
                currentRoommateSearch.setSearchStatus(updatedRoommateSearch.getSearchStatus());
            }
            if (updatedRoommateSearch.getBudgetMin() != null) {
                currentRoommateSearch.setBudgetMin(updatedRoommateSearch.getBudgetMin());
            }
            if (updatedRoommateSearch.getBudgetMax() != null) {
                currentRoommateSearch.setBudgetMax(updatedRoommateSearch.getBudgetMax());
            }
            if (updatedRoommateSearch.getStartDate() != null) {
                currentRoommateSearch.setStartDate(updatedRoommateSearch.getStartDate());
            }
            if (updatedRoommateSearch.getScoreTest() != null) {
                currentRoommateSearch.setScoreTest(updatedRoommateSearch.getScoreTest());
            }

            // Сохраняем обновленный объект
            roommateSearchRepository.save(currentRoommateSearch);
        }

        if (updatedUser.getSocialDetails() != null) {
            SocialDetails currentSocialDetails = currentUser.getSocialDetails();
            SocialDetails updatedSocialDetails = updatedUser.getSocialDetails();

            // Обновляем каждое поле, если оно не равно null
            if (updatedSocialDetails.getSchoolName() != null) {
                currentSocialDetails.setSchoolName(updatedSocialDetails.getSchoolName());
            }
            if (updatedSocialDetails.getUniversityName() != null) {
                currentSocialDetails.setUniversityName(updatedSocialDetails.getUniversityName());
            }
            if (updatedSocialDetails.getUniversitySpecialty() != null) {
                currentSocialDetails.setUniversitySpecialty(updatedSocialDetails.getUniversitySpecialty());
            }
            if (updatedSocialDetails.getDrinking() != null) {
                currentSocialDetails.setDrinking(updatedSocialDetails.getDrinking());
            }
            if (updatedSocialDetails.getSmoking() != null) {
                currentSocialDetails.setSmoking(updatedSocialDetails.getSmoking());
            }
            if (updatedSocialDetails.getCompany() != null) {
                currentSocialDetails.setCompany(updatedSocialDetails.getCompany());
            }
            if (updatedSocialDetails.getProfession() != null) {
                currentSocialDetails.setProfession(updatedSocialDetails.getProfession());
            }
            if (updatedSocialDetails.getInterests() != null) {
                currentSocialDetails.setInterests(updatedSocialDetails.getInterests());
            }

            // Сохраняем обновленный объект
            socialDetailsRepository.save(currentSocialDetails);
        }

        if (updatedUser.getLocationDetails() != null) {
            LocationDetails currentLocationDetails = currentUser.getLocationDetails();
            LocationDetails updatedLocationDetails = updatedUser.getLocationDetails();

            // Обновляем каждое поле, если оно не равно null
            if (updatedLocationDetails.getRegionFrom() != null) {
                currentLocationDetails.setRegionFrom(updatedLocationDetails.getRegionFrom());
            }
            if (updatedLocationDetails.getCurrentCity() != null) {
                currentLocationDetails.setCurrentCity(updatedLocationDetails.getCurrentCity());
            }

            // Сохраняем обновленный объект
            locationDetailsRepository.save(currentLocationDetails);
        }

        if (updatedUser.getRoommatePreferences() != null) {
            RoommatePreferences currentRoommatePreferences = currentUser.getRoommatePreferences();
            RoommatePreferences updatedRoommatePreferences = updatedUser.getRoommatePreferences();

            // Обновляем каждое поле, если оно не равно null
            if (updatedRoommatePreferences.getWakeTime() != null) {
                currentRoommatePreferences.setWakeTime(updatedRoommatePreferences.getWakeTime());
            }
            if (updatedRoommatePreferences.getSleepTime() != null) {
                currentRoommatePreferences.setSleepTime(updatedRoommatePreferences.getSleepTime());
            }
            if (updatedRoommatePreferences.getPets() != null) {
                currentRoommatePreferences.setPets(updatedRoommatePreferences.getPets());
            }

            // Сохраняем обновленный объект
            roommatePreferencesRepository.save(currentRoommatePreferences);
        }

        if (updatedUser.getContacts() != null) {
            Contacts currentContacts = currentUser.getContacts();
            Contacts updatedContacts = updatedUser.getContacts();

            // Обновляем каждое поле, если оно не равно null
            if (updatedContacts.getCallNumber() != null) {
                currentContacts.setCallNumber(updatedContacts.getCallNumber());
            }
            if (updatedContacts.getTelegramNickname() != null) {
                currentContacts.setTelegramNickname(updatedContacts.getTelegramNickname());
            }
            if (updatedContacts.getNumberVisible() != null) {
                currentContacts.setNumberVisible(updatedContacts.getNumberVisible());
            }

            // Сохраняем обновленный объект
            contactsRepository.save(currentContacts);
        }


        // Сохраняем обновлённого пользователя
        userRepository.save(currentUser);
        return "Success";
    }

//    @Transactional
//    @CacheEvict(value = "users", key = "#userId")
//    public String updateUserProfile(Long userId, UpdateUserProfileRequest updateRequest) {
//        try {
//            // Обновление данных пользователя
//            User user = userRepository.findById(userId)
//                    .orElseThrow(() -> new NoSuchElementException("User not found"));
//            user.setProfilePhotoPath("newnewnew");
//            userRepository.save(user);
//
//            saveToElasticsearch(user);
//
//            // Обновление личные данные профиля
//            PersonalInfo personalInfo = personalInfoRepository.findById(userId)
//                    .orElseThrow(() -> new NoSuchElementException("Personal info not found"));
//            personalInfo.setName("Updated");
//
//            personalInfoRepository.save(personalInfo);
//
//            // Обновление социального профиля
//            SocialDetails socialDetails = socialDetailsRepository.findById(userId)
//                    .orElseThrow(() -> new NoSuchElementException("Social details not found"));
//
//            socialDetailsRepository.save(socialDetails);
//
//            // Обновление информации о местоположении
//            LocationDetails locationDetails = locationDetailsRepository.findById(userId)
//                    .orElseThrow(() -> new NoSuchElementException("Location details not found"));
//
//            locationDetailsRepository.save(locationDetails);
//
//            // Обновление предпочтений по сожителям
//            RoommatePreferences roommatePreferences = roommatePreferencesRepository.findById(userId)
//                    .orElseThrow(() -> new NoSuchElementException("Roommate preferences not found"));
//
//
//            roommatePreferencesRepository.save(roommatePreferences);
//
//            return "User profile updated successfully";
//        } catch (Exception e) {
//            return "Update failed: " + e.getMessage();
//        }
//    }

    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    public void saveToElasticsearch(User user) {
        try {
            elasticsearchClient.index(i -> i
                    .index("users")
                    .id(user.getUserId().toString())
                    .document(user)
            );
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при сохранении в Elasticsearch", e);
        }
    }

}
