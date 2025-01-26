package kz.dreamteam.backend.repository;


import kz.dreamteam.backend.model.RoommatePreferences;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoommatePreferencesRepository extends JpaRepository<RoommatePreferences, Long> {
    Optional<RoommatePreferences> findByUserId(Long userId);
}
