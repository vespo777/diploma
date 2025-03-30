package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.*;
import kz.dreamteam.backend.model.dto.UserRecommendationDTO;
import kz.dreamteam.backend.model.graph.Pair;
import kz.dreamteam.backend.model.graph.UserNode;
import kz.dreamteam.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class GraphSearchService {
    private static final Logger log = LoggerFactory.getLogger(GraphSearchService.class);

    private final Map<Integer, UserNode> users = new HashMap<>();
    private final Map<String, Double> importanceCoef = new HashMap<>();
    private final Map<Integer, List<Pair<Double, Integer>>> graph = new HashMap<>();

    private final UserRepository userRepository;
    private final SocialDetailsRepository socialDetailsRepository;
    private final LocationDetailsRepository locationDetailsRepository;
    private final RoommatePreferencesRepository roommatePreferencesRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final RoommateSearchRepository roommateSearchRepository;
    private final TeamRepository teamRepository;

    private GraphSearchService(UserRepository userRepository,
                               SocialDetailsRepository socialDetailsRepository,
                               LocationDetailsRepository locationDetailsRepository,
                               RoommatePreferencesRepository roommatePreferencesRepository,
                               PersonalInfoRepository personalInfoRepository,
                               RoommateSearchRepository roommateSearchRepository,
                               TeamRepository teamRepository) {
        this.userRepository = userRepository;
        this.socialDetailsRepository = socialDetailsRepository;
        this.locationDetailsRepository = locationDetailsRepository;
        this.roommatePreferencesRepository = roommatePreferencesRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.roommateSearchRepository = roommateSearchRepository;
        this.teamRepository = teamRepository;
        initializeCoefficients();
        downloadFromDB();
    }


    private void initializeCoefficients() {
        importanceCoef.put("age", 10.0);
        importanceCoef.put("interests", 20.0);
        importanceCoef.put("region_from", 10.0);
//        importanceCoef.put("languages", 10.0);
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
        List<String> interestsA = Optional.ofNullable(A.interests).orElse(Collections.emptyList());
        List<String> interestsB = Optional.ofNullable(B.interests).orElse(Collections.emptyList());

        long count = interestsA.stream().filter(interestsB::contains).count();

        int minSize = Math.min(5, Math.min(interestsA.size(), interestsB.size()));
        if (minSize == 0) return 0.0; // Avoid division by zero

        return (double) count / minSize * importanceCoef.getOrDefault("interests", 0.0);
    }

    private double calcRegionFrom(UserNode A, UserNode B) {
        if (A.regionFrom == null || B.regionFrom == null) return 0.0;

        if (A.regionFrom.equals(B.regionFrom)) {
            return importanceCoef.getOrDefault("region_from", 0.0);
        } else if (A.regionFrom.charAt(0) == B.regionFrom.charAt(0)) {
            return 0.5 * importanceCoef.getOrDefault("region_from", 0.0);
        }

        return 0.0;
    }

//    private double calcLanguage(UserNode A, UserNode B) {
//        return A.languages.stream().anyMatch(B.languages::contains) ? importanceCoef.getOrDefault("languages", 0.0) : 0;
//    }

    private double calcReligion(UserNode A, UserNode B) {
        if (Objects.equals(A.religion, B.religion)) {
            return importanceCoef.getOrDefault("religion", 0.0);
        }
        return 0.0;
    }

    private double calcPetsStatus(UserNode A, UserNode B) {
        if (Objects.equals(A.petsStatus, "dont_have_baribir") ||
                Objects.equals(B.petsStatus, "dont_have_baribir") ||
                Objects.equals(A.petsStatus, B.petsStatus)) {
            return importanceCoef.getOrDefault("pets_status", 0.0);
        }
        return 0.0;
    }

    private double calcSleepTime(UserNode A, UserNode B) {
        if (A.sleepTime == null || B.sleepTime == null) {
            log.warn("calcSleepTime: Один из параметров sleepTime равен null (A={}, B={})", A.sleepTime, B.sleepTime);
            return 0; // Если время сна неизвестно, считаем, что несовместимость 100%
        }
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
        return Objects.equals(A.profession, B.profession)
                ? importanceCoef.getOrDefault("profession", 0.0)
                : 0.0;
    }

    private double calcDrinking(UserNode A, UserNode B) {
        return A.drinking == B.drinking ? importanceCoef.getOrDefault("drinking", 0.0) : 0;
    }

    private double calcSmoking(UserNode A, UserNode B) {
        return A.smoking == B.smoking ? importanceCoef.getOrDefault("smoking", 0.0) : 0;
    }

    private double calcUniversityName(UserNode A, UserNode B) {
        return Objects.equals(A.universityName, B.universityName)
                ? importanceCoef.getOrDefault("university_name", 0.0)
                : 0.0;
    }

    private double calcMatchingScore(UserNode A, UserNode B) {
        return
                calcAge(A, B) +
                        calcInterests(A, B) +
                        calcRegionFrom(A, B) +
//                        calcLanguage(A, B) +
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
            double level = calcMatchingScore(users.get(entry.getKey()), newUserNode);
            entry.getValue().add(new Pair<>(level, newUserNode.id));
            graph.get(newUserNode.id).add(new Pair<>(level, entry.getKey()));
        }
    }

    public ResponseEntity<List<User>> getUserRecommendations(int userIdP) {
        List<Pair<Double, Integer>> res = graph.getOrDefault(userIdP, new ArrayList<>());

        res.sort((a, b) -> Double.compare(b.getKey(), a.getKey()));

        List<User> recommendedUsers = res.stream()
                .peek(it -> log.info("Searching for user with ID: {}", it.getValue()))
                .map(it -> {
                    Long userId = Long.valueOf(it.getValue());
                    Optional<User> userOpt = userRepository.findById(userId);
                    if (userOpt.isEmpty()) {
                        log.warn("User with ID {} not found!", userId);
                    }
                    return userOpt;
                })
                .flatMap(Optional::stream)
                .toList();

        if (recommendedUsers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        return ResponseEntity.ok(recommendedUsers);
    }
    public ResponseEntity<List<UserRecommendationDTO>> getUserRecommendationsDTO(int userIdP) {
        List<Pair<Double, Integer>> res = graph.getOrDefault(userIdP, new ArrayList<>());

        res.sort((a, b) -> Double.compare(b.getKey(), a.getKey()));

        List<UserRecommendationDTO> recommendations = res.stream()
                .peek(it -> log.info("Searching for user with ID: {}", it.getValue()))
                .map(it -> {
                    Long userId = Long.valueOf(it.getValue());
                    Optional<User> userOpt = userRepository.findById(userId);
                    if (userOpt.isEmpty()) {
                        log.warn("User with ID {} not found!", userId);
                    }
                    return userOpt.map(user -> new UserRecommendationDTO(user, it.getKey()));
                })
                .flatMap(Optional::stream)
                .toList();

        if (recommendations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        return ResponseEntity.ok(recommendations);
    }

    public ResponseEntity<List<Team>> getTeamRecommendations(int userId) {
        List<Team> allTeams = teamRepository.findAll(); // Загружаем все команды

        // Фильтруем и сортируем команды по среднему matchingScore
        List<Team> sortedTeams = allTeams.stream()
                .map(team -> {
                    List<User> members = new ArrayList<>(team.getMembers());// Получаем участников команды

                    // Вычисляем matchingScore каждого члена с userId
                    List<Double> scores = members.stream()
                            .map(member -> getMatchingScoreFromGraph(userId, Math.toIntExact(member.getUserId())))
                            .toList();

                    // Вычисляем средний matchingScore команды
                    double avgScore = scores.stream()
                            .mapToDouble(Double::doubleValue)
                            .average()
                            .orElse(0.0);

                    return new AbstractMap.SimpleEntry<>(team, avgScore);
                })
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue())) // Сортируем по убыванию
                .map(AbstractMap.SimpleEntry::getKey)
                .toList();

        if (sortedTeams.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        return ResponseEntity.ok(sortedTeams);
    }

    private double getMatchingScoreFromGraph(int userId, int memberId) {
        return graph.getOrDefault(userId, Collections.emptyList()).stream()
                .filter(pair -> pair.getValue().equals(memberId)) // Ищем пару с нужным memberId
                .map(Pair::getKey) // Берем matchingScore
                .findFirst()
                .orElse(0.0); // Если нет значения, возвращаем 0.0
    }


    public void uploadToDB() {
    }

    public void downloadFromDB() {

        List<User> users = userRepository.findAll();
        log.info("Found {} users in database", users.size());

        for (User user : users) {
            // Проверяем, если user уже есть в graph, то пропускаем его
            if (graph.containsKey(Math.toIntExact(user.getUserId()))) {
                continue; // Пропускаем текущего пользователя, если его ID уже есть в graph
            }

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

            //setAge
            LocalDate birthDate = (personalInfo.getBirthDate() != null) ? personalInfo.getBirthDate() : null;
            if (birthDate == null) {
                log.warn("Skipping user node creation because birthDate is null");
                newUserNode.setAge(0); // Или другое значение по умолчанию
            } else {
                newUserNode.setAge(convertToAge(birthDate));
            }

            newUserNode.setInterests(Collections.emptyList());
            newUserNode.setRegionFrom(locationDetails.getRegionFrom());
//            newUserNode.setLanguages();
            newUserNode.setReligion(personalInfo.getReligion());
            newUserNode.setPetsStatus(roommatePreferences.getPets());
            newUserNode.setSleepTime(roommatePreferences.getSleepTime());
            if (roommateSearch.getBudgetMax() == null) {
                log.warn("BudgetMax is null for user: {}", roommateSearch.getUserId());
                newUserNode.setBudgetMax(0); // Устанавливаем значение по умолчанию (например, 0)
            } else {
                newUserNode.setBudgetMax(roommateSearch.getBudgetMax().intValue());
            }
            if (roommateSearch.getScoreTest() == null) {
                log.warn("ScoreTest is null for user: {}", roommateSearch.getUserId());
                newUserNode.setPersonalityType(0); // Устанавливаем значение по умолчанию (например, 0)
            } else {
                newUserNode.setPersonalityType(roommateSearch.getScoreTest());
            }
            newUserNode.setProfession(socialDetails.getUniversitySpecialty());
            newUserNode.setDrinking(socialDetails.getDrinking() != null ? socialDetails.getDrinking() : false);
            newUserNode.setSmoking(socialDetails.getSmoking() != null ? socialDetails.getSmoking() : false);
            newUserNode.setUniversityName(socialDetails.getUniversityName() != null ? socialDetails.getUniversityName() : "Not specified");


            addNewUser(newUserNode);
        }
    }

    public int convertToAge(LocalDate birthDate) {
        if (birthDate == null) {
            return 0; // Если дата рождения неизвестна, возвращаем 0
        }
        return (int) ChronoUnit.YEARS.between(birthDate, LocalDate.now());
    }


}


