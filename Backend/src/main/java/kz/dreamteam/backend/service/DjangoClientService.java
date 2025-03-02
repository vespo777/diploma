package kz.dreamteam.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.dreamteam.backend.model.RoommateSearch;
import kz.dreamteam.backend.repository.RoommateSearchRepository;
import org.apache.coyote.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class DjangoClientService {

    private static final Logger log = LoggerFactory.getLogger(DjangoClientService.class);
    private final RoommateSearchRepository roommateSearchRepository;
    private final JwtService jwtService;


    private final WebClient webClient;

    public DjangoClientService(RoommateSearchRepository roommateSearchRepository, JwtService jwtService) {
        this.webClient = WebClient.builder()
                .baseUrl("http://127.0.0.1:8000") // Замените на ваш URL Django API
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.roommateSearchRepository = roommateSearchRepository;
        this.jwtService = jwtService;
    }

    public ResponseEntity<Integer> saveUserClassteredGroup(List<Integer> answers, String token) throws JsonProcessingException {
        var response = sendPostRequest(answers);
        if(response == null) return null;
        String clusterGroupValue = extractClusterGroupValue(response);

        log.info(response);
        Long userId = jwtService.getUserIdFromToken(token);

        RoommateSearch roommateSearch = roommateSearchRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Roommate search not found for userId: " + userId));

        roommateSearch.setScoreTest(Integer.valueOf(clusterGroupValue));
        roommateSearchRepository.save(roommateSearch);

        // Now process the response synchronously
        return ResponseEntity.ok(Integer.valueOf(clusterGroupValue));
    }


    public String sendPostRequest(List<Integer> answers) throws JsonProcessingException {
//        Map<String, List<Integer>> requestBody = Map.of("answers", answers);

        // Convert List<Integer> to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(answers);

        log.info("Answers: {}", json);

        Map<String, Object> requestBody = Map.of("answers", answers);


        return webClient.post()
                .uri("/predict") // Укажите реальный путь Django API
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block(); // Синхронный вызов (можно заменить на асинхронный)

    }


    public static String extractClusterGroupValue(String jsonResponse) {
        // You can use a library like Jackson or Gson to parse the JSON response
        try {
            // Using Jackson to parse the JSON and extract the value
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.Map<String, Object> responseMap = objectMapper.readValue(jsonResponse, java.util.Map.class);
            return responseMap.get("cluster_group").toString();  // Return the cluster_group value as a String
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

