package kz.dreamteam.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import kz.dreamteam.backend.model.Team;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.UpdateUserProfileRequest;
import kz.dreamteam.backend.model.dto.UserRecommendationDTO;
import kz.dreamteam.backend.service.DjangoClientService;
import kz.dreamteam.backend.service.GraphSearchService;
import kz.dreamteam.backend.service.RoommateSearchService;
import kz.dreamteam.backend.service.JwtService;
import kz.dreamteam.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final JwtService jwtService;
    private final UserService userService;
    private final DjangoClientService djangoClientService;
    private final GraphSearchService graphSearchService;
    private final RoommateSearchService roommateSearchService;

    public UserController(JwtService jwtService,
                          UserService userService,
                          DjangoClientService djangoClientService,
                          GraphSearchService graphSearchService,
                          RoommateSearchService roommateSearchService){
        this.jwtService = jwtService;
        this.userService = userService;
        this.djangoClientService = djangoClientService;
        this.graphSearchService = graphSearchService;
        this.roommateSearchService = roommateSearchService;
    }


    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        // Извлекаем токен из заголовка
        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;

        return this.userService.getCurrentUser(token);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(this.userService.getUserById(userId));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable Long userId,
            @RequestBody User updatedUser) {

        String response = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/recommended-users")
    public ResponseEntity<List<User>> getRecommendedUsers(@RequestParam int userId) {
        return graphSearchService.getUserRecommendations(userId);
    }

    @GetMapping("/recommended-users-dto") // necessary to get matching score
    public ResponseEntity<List<UserRecommendationDTO>> getRecommendedUsersDTO(@RequestParam int userId) {
        System.out.println("\n\nDEBUG backend graphSearchService.getUserRecommendationsDTO(userId): " + graphSearchService.getUserRecommendationsDTO(userId) + "\n\n");
        return graphSearchService.getUserRecommendationsDTO(userId);
    }

    @GetMapping("/recommended-teams")
    public ResponseEntity<List<Team>> getRecommendedTeams(@RequestParam int userId) {
        return graphSearchService.getTeamRecommendations(userId);
    }

    @GetMapping("/check-ml-questions")
    public ResponseEntity<Boolean> checkMlQuestions(@RequestParam Long userId) {
        // return userService.checkMlQuestionsAnswers(userId);
        return roommateSearchService.checkScoreTestExists(userId);
    }


    @PostMapping("/give-classtered-group")
    public ResponseEntity<Integer> giveClassteredGroup(@RequestHeader("Authorization") String authorizationHeader, @RequestBody MyRequest req) throws JsonProcessingException {
        if (req.getAnswers() == null) {
            log.error("Numbers are null");
        } else {
            log.info("Numbers: {}", req.getAnswers());
        }

        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;

        System.out.println("\n\n DEBUG: --- " + req.getAnswers() + "\n\n\n");
        
        return djangoClientService.saveUserClassteredGroup(req.getAnswers(), token);
    }

    public static class MyRequest {
        private List<Integer> answers;

        // Getter and Setter
        public List<Integer> getAnswers() {
            return answers;
        }

        public void setAnswers(List<Integer> answers) {
            this.answers = answers;
        }
    }


}
