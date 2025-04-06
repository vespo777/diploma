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
    @JoinColumn(name = "user_id")
    private User roommate;

    private BigDecimal averageRating; // 0.00 - 5.00

    @OneToMany(mappedBy = "roommateRating", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public RoommateRating() {
        this.averageRating = BigDecimal.valueOf(5.00); // Устанавливаем по умолчанию
    }

    public void addReview(Review review) {
        this.reviews.add(review);
        updateAverageRating();
    }

//    private void updateAverageRating() {
//        this.averageRating = reviews.stream()
//                .map(review -> BigDecimal.valueOf(review.getRating())) // Приводим к BigDecimal
//                .reduce(BigDecimal.ZERO, BigDecimal::add) // Складываем
//                .divide(BigDecimal.valueOf(reviews.size()), RoundingMode.HALF_UP); // Вычисляем среднее
//    }
    private void updateAverageRating() {
        if (reviews.isEmpty()) {
            this.averageRating = BigDecimal.valueOf(5.00);
        } else {
            // Если это первый отзыв, учитываем 5.0 и новый рейтинг
            BigDecimal totalRating = BigDecimal.valueOf(5.00).add(BigDecimal.valueOf(reviews.get(0).getRating()));
            this.averageRating = reviews.stream()
                    .skip(1) // Пропускаем первый отзыв, потому что его уже учли
                    .map(review -> BigDecimal.valueOf(review.getRating()))
                    .reduce(totalRating, BigDecimal::add) // Складываем с уже включенным первым отзывом
                    .divide(BigDecimal.valueOf(reviews.size() + 1), RoundingMode.HALF_UP); // Делим на количество отзывов + 1 (первый отзыв с дефолтным значением)
        }
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

