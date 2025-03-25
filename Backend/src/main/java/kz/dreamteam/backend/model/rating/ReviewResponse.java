package kz.dreamteam.backend.model.rating;

import java.time.LocalDateTime;

public class ReviewResponse {
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewResponse(Integer rating,
                          String comment,
                          LocalDateTime createdAt){
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

