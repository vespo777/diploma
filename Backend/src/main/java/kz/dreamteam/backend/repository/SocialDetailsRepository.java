package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.SocialDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialDetailsRepository extends JpaRepository<SocialDetails, Long> {
    Optional<SocialDetails> findByUserId(Long userId);
}
