package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.RoommatePreferences;
import kz.dreamteam.backend.model.dto.UpdateRoommatePreferencesDto;
import kz.dreamteam.backend.repository.RoommatePreferencesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class RoommatePreferencesService {

    private final RoommatePreferencesRepository repository;

    public RoommatePreferencesService(RoommatePreferencesRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public RoommatePreferences updatePreferences(Long userId, UpdateRoommatePreferencesDto dto) {
        Optional<RoommatePreferences> optionalPreferences = repository.findById(userId);

        if (optionalPreferences.isEmpty()) {
            throw new RuntimeException("Roommate preferences not found for user ID: " + userId);
        }

        RoommatePreferences preferences = optionalPreferences.get();

        // Update fields if they are provided
        if (dto.getWakeTime() != null) preferences.setWakeTime(dto.getWakeTime());
        if (dto.getSleepTime() != null) preferences.setSleepTime(dto.getSleepTime());
        if (dto.getPets() != null) preferences.setPets(dto.getPets());

        return repository.save(preferences);
    }
}

