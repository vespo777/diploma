package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.RoommateRating;
import kz.dreamteam.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface RoommateRatingRepository extends JpaRepository<RoommateRating, Long> {
    Optional<RoommateRating> findByRoommate(User roommate);
    Optional<RoommateRating> findByRoommate_UserId(Long userId);

}
