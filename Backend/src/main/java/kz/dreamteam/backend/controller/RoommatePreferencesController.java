package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.dto.UpdateRoommatePreferencesDto;
import kz.dreamteam.backend.service.RoommatePreferencesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class RoommatePreferencesController {

    private final RoommatePreferencesService roommatePreferencesService;

    public RoommatePreferencesController(RoommatePreferencesService roommatePreferencesService) {
        this.roommatePreferencesService = roommatePreferencesService;
    }

    @PutMapping("/roommate-preferences/{userId}")
    public ResponseEntity<String> updatePreferences(
            @PathVariable Long userId,
            @RequestBody UpdateRoommatePreferencesDto dto) {
        return this.roommatePreferencesService.updateRoommatePreferences(userId, dto);
    }
}

