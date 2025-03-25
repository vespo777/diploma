package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.RoommateRating;
import kz.dreamteam.backend.model.rating.ReviewResponse;
import kz.dreamteam.backend.model.rating.RoommateRatingRequest;
import kz.dreamteam.backend.service.RoommateRatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/ratings")
public class RatingController {
    private final RoommateRatingService roommateRatingService;

    public RatingController(RoommateRatingService roommateRatingService) {
        this.roommateRatingService = roommateRatingService;
    }

    @GetMapping("/received")
    public ResponseEntity<List<ReviewResponse>> getReceivedRatings(@RequestParam Long userId) {
        List<ReviewResponse> response = roommateRatingService.getReceivedReviews(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ReviewResponse>> getSentRatings(@RequestParam Long userId) {
        List<ReviewResponse> response = roommateRatingService.getSentReviews(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/overall")
    public ResponseEntity<BigDecimal> getOverallRating(@RequestParam Long userId) {
        BigDecimal overallRating = roommateRatingService.getOverallRating(userId);
        return ResponseEntity.ok(overallRating);
    }

    @PostMapping("/leave-review")
    public ResponseEntity<String> leaveReview(@RequestBody RoommateRatingRequest request) {
        String response = roommateRatingService.leaveReview(
                request.getReviewerId(),
                request.getRoommateId(),
                request.getRating(),
                request.getComment()
        );
        return ResponseEntity.ok(response);
    }
}
