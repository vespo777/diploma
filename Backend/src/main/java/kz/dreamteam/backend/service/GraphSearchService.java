package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.*;
import kz.dreamteam.backend.model.graph.Pair;
import kz.dreamteam.backend.model.graph.UserNode;
//import kz.dreamteam.backend.model.graph.Graph;
import kz.dreamteam.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class GraphSearchService {
    private Map<Integer, UserNode> users = new HashMap<>();
    private Map<String, Double> importanceCoef = new HashMap<>();
    private Map<Integer, List<Pair<Double, Integer>>> graph = new HashMap<>();

    private final UserRepository userRepository;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final RoommateSearchRepository roommateSearchRepository;
    private final ContactsRepository contactsRepository;

    private GraphSearchService(UserRepository userRepository,
                               SocialDetailsRepository socialDetailsRepository,
                               LocationDetailsRepository locationDetailsRepository,
                               RoommatePreferencesRepository roommatePreferencesRepository,
                               PersonalInfoRepository personalInfoRepository,
                               RoommateSearchRepository roommateSearchRepository,
                               ContactsRepository contactsRepository) {
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.roommateSearchRepository = roommateSearchRepository;
        this.contactsRepository = contactsRepository;
        initializeCoefficients();
    }


    private void initializeCoefficients() {
        importanceCoef.put("age", 10.0);
        importanceCoef.put("interests", 20.0);
        importanceCoef.put("region_from", 10.0);
        importanceCoef.put("languages", 10.0);
        importanceCoef.put("religion", 5.0);
        importanceCoef.put("pets_status", 10.0);
        importanceCoef.put("sleep_time", 20.0);
        importanceCoef.put("budget_max", 20.0);
        importanceCoef.put("personality_type", 50.0);
        importanceCoef.put("profession", 5.0);
        importanceCoef.put("drinking", 20.0);
        importanceCoef.put("smoking", 20.0);
        importanceCoef.put("university_name", 15.0);
    }



    private double calcAge(UserNode A, UserNode B) {
        double diff = Math.abs(A.age - B.age);
        return (1.0 - diff / 20.0) * importanceCoef.getOrDefault("age", 0.0);
    }

    private double calcInterests(UserNode A, UserNode B) {
        long count = A.interests.stream().filter(B.interests::contains).count();
        return (double) count / Math.min(5, Math.min(A.interests.size(), B.interests.size())) * importanceCoef.getOrDefault("interests", 0.0);
    }

    private double calcRegionFrom(UserNode A, UserNode B) {
        if (A.regionFrom.equals(B.regionFrom)) {
            return importanceCoef.getOrDefault("region_from", 0.0);
        } else if (A.regionFrom.charAt(0) == B.regionFrom.charAt(0)) {
            return 0.5 * importanceCoef.getOrDefault("region_from", 0.0);
        }
        return 0;
    }

    private double calcLanguage(UserNode A, UserNode B) {
        return A.languages.stream().anyMatch(B.languages::contains) ? importanceCoef.getOrDefault("languages", 0.0) : 0;
    }

    private double calcReligion(UserNode A, UserNode B) {
        return A.religion.equals(B.religion) ? importanceCoef.getOrDefault("religion", 0.0) : 0;
    }

    private double calcPetsStatus(UserNode A, UserNode B) {
        return (A.petsStatus.equals("dont_have_baribir") || B.petsStatus.equals("dont_have_baribir") || A.petsStatus.equals(B.petsStatus)) ? importanceCoef.getOrDefault("pets_status", 0.0) : 0;
    }

    private double calcSleepTime(UserNode A, UserNode B) {
        long diff = Math.abs(Duration.between(A.sleepTime, B.sleepTime).toHours()); // Разница в часах

        if (diff <= 1) return importanceCoef.getOrDefault("sleep_time", 0.0);
        if (diff == 2) return 0.5 * importanceCoef.getOrDefault("sleep_time", 0.0);
        return 0;
    }

    private double calcBudgetMax(UserNode A, UserNode B) {
        double diff = Math.abs(A.budgetMax - B.budgetMax);
        if (diff <= 10000) return importanceCoef.getOrDefault("budget_max", 0.0);
        if (diff <= 20000) return 0.75 * importanceCoef.getOrDefault("budget_max", 0.0);
        if (diff <= 30000) return 0.5 * importanceCoef.getOrDefault("budget_max", 0.0);
        return 0;
    }

    private double calcPersonalityType(UserNode A, UserNode B) {
        return A.personalityType == B.personalityType ? importanceCoef.getOrDefault("personality_type", 0.0) : 0;
    }

    private double calcProfession(UserNode A, UserNode B) {
        return A.profession.equals(B.profession) ? importanceCoef.getOrDefault("profession", 0.0) : 0;
    }

    private double calcDrinking(UserNode A, UserNode B) {
        return A.drinking == B.drinking ? importanceCoef.getOrDefault("drinking", 0.0) : 0;
    }

    private double calcSmoking(UserNode A, UserNode B) {
        return A.smoking == B.smoking ? importanceCoef.getOrDefault("smoking", 0.0) : 0;
    }

    private double calcUniversityName(UserNode A, UserNode B) {
        return A.universityName.equals(B.universityName) ? importanceCoef.getOrDefault("university_name", 0.0) : 0;
    }

    private double calcMatchingLevel(UserNode A, UserNode B) {
        return
                calcAge(A, B) +
                        calcInterests(A, B) +
                        calcRegionFrom(A, B) +
                        calcLanguage(A, B) +
                        calcReligion(A, B) +
                        calcPetsStatus(A, B) +
                        calcSleepTime(A, B) +
                        calcBudgetMax(A, B) +
                        calcPersonalityType(A, B) +
                        calcProfession(A, B) +
                        calcDrinking(A, B) +
                        calcSmoking(A, B) +
                        calcUniversityName(A, B);
    }


    public void addNewUser(UserNode newUserNode) {
        users.put(newUserNode.id, newUserNode);
        graph.put(newUserNode.id, new ArrayList<>());

        for (Map.Entry<Integer, List<Pair<Double, Integer>>> entry : graph.entrySet()) {
            if (entry.getKey().equals(newUserNode.id)) continue;
            double level = calcMatchingLevel(users.get(entry.getKey()), newUserNode);
            entry.getValue().add(new Pair<>(level, newUserNode.id));
            graph.get(newUserNode.id).add(new Pair<>(level, entry.getKey()));
        }
    }

    public List<Pair<Double, Integer>> getUserRecommendations(int userId) {
        List<Pair<Double, Integer>> res = graph.getOrDefault(userId, new ArrayList<>());
        res.sort((a, b) -> Double.compare(b.getKey(), a.getKey()));
        return res;
    }


    public void uploadToDB() {
    }

    public void downloadFromDB() {

        List<User> users = userRepository.findAllByOrderByUserIdAsc();


        for (User user : users) {
            int userId = user.getUserId().intValue();
            UserNode newUserNode = new UserNode();

            PersonalInfo personalInfo = personalInfoRepository.findById(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Personal info not found for userId: " + userId));

            RoommatePreferences roommatePreferences = roommatePreferencesRepository.findById(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Roommate preferences not found for userId: " + userId));

            RoommateSearch roommateSearch = roommateSearchRepository.findById(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Roommate search not found for userId: " + userId));

            SocialDetails socialDetails = socialDetailsRepository.findById(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Social details not found for userId: " + userId));

            LocationDetails locationDetails = locationDetailsRepository.findById(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Location details not found for userId: " + userId));


            newUserNode.setId(userId);
            newUserNode.setAge(convertToAge(personalInfo.getBirthDate()));
            newUserNode.setInterests(Collections.emptyList());
            newUserNode.setRegionFrom(locationDetails.getRegionFrom());
//            newUserNode.setLanguages();
            newUserNode.setReligion(personalInfo.getReligion());
            newUserNode.setPetsStatus(roommatePreferences.getPets());
            newUserNode.setSleepTime(roommatePreferences.getSleepTime());
            newUserNode.setBudgetMax(roommateSearch.getBudgetMax().intValue());
            newUserNode.setPersonalityType(roommateSearch.getScoreTest());
            newUserNode.setProfession(socialDetails.getUniversitySpecialty());
            newUserNode.setDrinking(socialDetails.getDrinking());
            newUserNode.setSmoking(socialDetails.getSmoking());
            newUserNode.setUniversityName(socialDetails.getUniversityName());

            addNewUser(newUserNode);
        }
    }

    public int convertToAge(LocalDate birthDate) {
        return  (int) ChronoUnit.YEARS.between(birthDate, LocalDate.now());
    }

}


