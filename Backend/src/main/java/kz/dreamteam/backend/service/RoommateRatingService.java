package kz.dreamteam.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.*;
import kz.dreamteam.backend.model.Review;
import kz.dreamteam.backend.model.RoommateRating;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.rating.ReviewResponse;
import kz.dreamteam.backend.repository.ReviewRepository;
import kz.dreamteam.backend.repository.RoommateRatingRepository;
import kz.dreamteam.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Service
public class RoommateRatingService {

    private final UserRepository userRepository;
    private final RoommateRatingRepository roommateRatingRepository;
    private final ReviewRepository reviewRepository;

    public RoommateRatingService(UserRepository userRepository,
                         RoommateRatingRepository roommateRatingRepository,
                         ReviewRepository reviewRepository){
        this.userRepository = userRepository;
        this.roommateRatingRepository = roommateRatingRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ReviewResponse> getSentReviews(Long userId) {
        List<Review> reviews = reviewRepository.findByReviewer_UserId(userId);
        return reviews.stream()
                .map(review -> new ReviewResponse(review.getRating(), review.getComment(), review.getCreatedAt()))
                .toList();
    }

    public List<ReviewResponse> getReceivedReviews(Long userId) {
        return roommateRatingRepository.findByRoommateUserId(userId)
                .map(roommateRating -> roommateRating.getReviews().stream()
                        .map(review -> new ReviewResponse(
                                review.getRating(),
                                review.getComment(),
                                review.getCreatedAt()))
                        .toList())
                .orElse(Collections.emptyList());
    }

    public BigDecimal getOverallRating(Long userId) {
        return roommateRatingRepository.findByRoommateUserId(userId)
                .map(RoommateRating::getAverageRating)
                .orElse(BigDecimal.valueOf(5.00)); // Если нет рейтинга, вернуть 0
    }

    @Transactional
    public String leaveReview(Long reviewerId, Long roommateId, Integer rating, String comment) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new EntityNotFoundException("Reviewer not found"));

        User roommate = userRepository.findById(roommateId)
                .orElseThrow(() -> new EntityNotFoundException("Roommate not found"));

        RoommateRating roommateRating = roommateRatingRepository.findByRoommate(roommate)
                .orElseGet(() -> {
                    RoommateRating newRating = new RoommateRating();
                    newRating.setRoommate(roommate);
                    newRating.setAverageRating(BigDecimal.ZERO);
                    return roommateRatingRepository.save(newRating);
                });

        Review review = new Review();
        review.setRoommateRating(roommateRating);
        review.setReviewer(reviewer);
        review.setRating(rating);
        review.setComment(comment);

        roommateRating.addReview(review);

        reviewRepository.save(review);
        roommateRatingRepository.save(roommateRating);
        return "Review succesfully leaved!";
    }

}
