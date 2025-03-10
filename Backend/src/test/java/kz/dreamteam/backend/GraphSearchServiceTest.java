package kz.dreamteam.backend;

import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.graph.Pair;
import kz.dreamteam.backend.model.graph.UserNode;
import kz.dreamteam.backend.repository.*;
import kz.dreamteam.backend.service.GraphSearchService;
import kz.dreamteam.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
class GraphSearchServiceTest {

    private static final Logger log = LoggerFactory.getLogger(GraphSearchServiceTest.class);
    @Mock
    private UserRepository userRepository;
    @Mock
    private SocialDetailsRepository socialDetailsRepository;
    @Mock
    private LocationDetailsRepository locationDetailsRepository;
    @Mock
    private RoommatePreferencesRepository roommatePreferencesRepository;
    @Mock
    private PersonalInfoRepository personalInfoRepository;
    @Mock
    private RoommateSearchRepository roommateSearchRepository;
    @Mock
    private ContactsRepository contactsRepository;

    @InjectMocks
    private GraphSearchService graphSearchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserRecommendations() {


        // Create test users
        UserNode user1 = new UserNode();
        user1.setId(1);
        user1.setAge(25);
        user1.setSleepTime(LocalTime.of(23, 0));

        UserNode user2 = new UserNode();
        user2.setId(3);
        user2.setAge(26);
        user2.setSleepTime(LocalTime.of(22, 30));

        UserNode user3 = new UserNode();
        user3.setId(4);
        user3.setAge(24);
        user3.setSleepTime(LocalTime.of(0, 0));

        // Add users to the graph
        graphSearchService.addNewUser(user1);
        graphSearchService.addNewUser(user2);
        graphSearchService.addNewUser(user3);

        // Get recommendations for user1
        ResponseEntity<List<User>> rec = graphSearchService.getUserRecommendations(1);
        List<User> recommendations = rec.getBody();
        // Print to log
        log.info("Recommendations for user 1: {}", recommendations);

        // Ensure recommendations are sorted in descending order
        assertEquals(2, recommendations.size());
        assertEquals(2, recommendations.get(0).getUserId()); // Предполагается, что у User есть метод getId()
        assertEquals(3, recommendations.get(1).getUserId());
    }
}

