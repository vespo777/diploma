package kz.dreamteam.backend.model.rating;

public class RoommateRatingRequest {
    private Long reviewerId;  // Кто оставил рейтинг
    private Long roommateId;  // Кому оставляют рейтинг
    private int rating;    // Оценка (0.00 - 5.00)
    private String comment;   // Комментарий

    public Long getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }

    public Long getRoommateId() {
        return roommateId;
    }

    public void setRoommateId(Long roommateId) {
        this.roommateId = roommateId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}

