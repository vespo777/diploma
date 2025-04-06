package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.RoommateSearch;
import kz.dreamteam.backend.model.dto.UpdateRoommateSearchDto;
import kz.dreamteam.backend.repository.RoommateSearchRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class RoommateSearchService {
    private final RoommateSearchRepository roommateSearchRepository;

    public RoommateSearchService(RoommateSearchRepository roommateSearchRepository) {
        this.roommateSearchRepository = roommateSearchRepository;
    }

    public ResponseEntity<String> updateRoommateSearch(Long userId, UpdateRoommateSearchDto updateRequest) {
        RoommateSearch roommateSearch = roommateSearchRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Roommate search not found for userId: " + userId));


        if (updateRequest.getSearchStatus() != null) roommateSearch.setSearchStatus(updateRequest.getSearchStatus());
        if (updateRequest.getBudgetMin() != null) roommateSearch.setBudgetMin(updateRequest.getBudgetMin());
        if (updateRequest.getBudgetMax() != null) roommateSearch.setBudgetMax(updateRequest.getBudgetMax());
        if (updateRequest.getScoreTest() != null) roommateSearch.setScoreTest(updateRequest.getScoreTest());
        if (updateRequest.getStartDate() != null) roommateSearch.setStartDate(updateRequest.getStartDate());

        roommateSearchRepository.save(roommateSearch);

        return ResponseEntity.ok("Roommate search updated successfully");
    }

    public ResponseEntity<Integer> getPersonalityScore(Long userId) {
        RoommateSearch roommateSearch = roommateSearchRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Roommate search not found for userId: " + userId));
        return ResponseEntity.ok(roommateSearch.getScoreTest());
    }

    public ResponseEntity<Boolean> checkScoreTestExists(Long userId) {
            RoommateSearch roommateSearch = roommateSearchRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Roommate search not found for userId: " + userId));

            System.out.println("\n\nDEBUG -- roommateSearch.getScoreTest(): " + roommateSearch.getScoreTest() + "\n\n");

            boolean flag = roommateSearch.getScoreTest() != null && roommateSearch.getScoreTest() >= 1 && roommateSearch.getScoreTest() <= 8; 
            return ResponseEntity.ok(flag);
        }
}
