package kz.dreamteam.backend.model.dto;

import kz.dreamteam.backend.model.User;

public record UserRecommendationDTO(User user, double matchingScore) {
}

