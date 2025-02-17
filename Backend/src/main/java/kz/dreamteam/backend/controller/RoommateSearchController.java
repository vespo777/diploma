package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.dto.UpdateRoommateSearchDto;
import kz.dreamteam.backend.service.RoommateSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class RoommateSearchController {
    private final RoommateSearchService roommateSearchService;

    public RoommateSearchController(RoommateSearchService roommateSearchService) {
        this.roommateSearchService = roommateSearchService;
    }

    @PutMapping("/roommate-search/{userId}")
    public ResponseEntity<String> updateRoommateSearch(@PathVariable Long userId,
                                                       @RequestBody UpdateRoommateSearchDto dto) {
        return roommateSearchService.updateRoommateSearch(userId, dto);
    }
}

