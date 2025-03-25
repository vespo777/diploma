package kz.dreamteam.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Entity
public class RoommateRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "roommate_id", nullable = false)
    private User roommate;

    private BigDecimal averageRating; // 0.00 - 5.00

    @OneToMany(mappedBy = "roommateRating", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public void addReview(Review review) {
        this.reviews.add(review);
        updateAverageRating();
    }

    private void updateAverageRating() {
        this.averageRating = reviews.stream()
                .map(review -> BigDecimal.valueOf(review.getRating())) // Приводим к BigDecimal
                .reduce(BigDecimal.ZERO, BigDecimal::add) // Складываем
                .divide(BigDecimal.valueOf(reviews.size()), RoundingMode.HALF_UP); // Вычисляем среднее
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRoommate() {
        return roommate;
    }

    public void setRoommate(User roommate) {
        this.roommate = roommate;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}

