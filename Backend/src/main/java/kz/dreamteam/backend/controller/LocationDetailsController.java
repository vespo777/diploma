package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.dto.UpdateLocationDetailsDto;
import kz.dreamteam.backend.service.LocationDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class LocationDetailsController {

    private final LocationDetailsService service;

    public LocationDetailsController(LocationDetailsService service) {
        this.service = service;
    }

    @PutMapping("/location-details/{userId}")
    public ResponseEntity<String> updateLocationDetails(
            @PathVariable Long userId,
            @RequestBody UpdateLocationDetailsDto dto) {
        return service.updateLocationDetails(userId, dto);
    }
}

