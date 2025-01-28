package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.LocationDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationDetailsRepository extends JpaRepository<LocationDetails, Long> {
    Optional<LocationDetails> findById(Long Id);
}
