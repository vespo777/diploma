package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.LocationDetails;
import kz.dreamteam.backend.model.dto.UpdateLocationDetailsDto;
import kz.dreamteam.backend.repository.LocationDetailsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class LocationDetailsService {

    private final LocationDetailsRepository repository;

    public LocationDetailsService(LocationDetailsRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ResponseEntity<String> updateLocationDetails(Long userId, UpdateLocationDetailsDto dto) {
        Optional<LocationDetails> optionalDetails = repository.findById(userId);

        if (optionalDetails.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Location details not found for user ID: " + userId);
        }

        LocationDetails details = optionalDetails.get();
        boolean updated = false;

        if (dto.getRegionFrom() != null) {
            details.setRegionFrom(dto.getRegionFrom());
            updated = true;
        }
        if (dto.getCurrentCity() != null) {
            details.setCurrentCity(dto.getCurrentCity());
            updated = true;
        }

        if (!updated) {
            return ResponseEntity.ok("No changes were made, as no new values were provided.");
        }

        repository.save(details);
        return ResponseEntity.ok("Location details updated successfully!");
    }
}

