package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.SocialDetails;
import kz.dreamteam.backend.model.dto.UpdateSocialDetailsDto;
import kz.dreamteam.backend.repository.SocialDetailsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class SocialDetailsService {

    private final SocialDetailsRepository socialDetailsRepository;

    public SocialDetailsService(SocialDetailsRepository socialDetailsRepository) {
        this.socialDetailsRepository = socialDetailsRepository;
    }

    public ResponseEntity<String> updateSocialDetails(Long userId, UpdateSocialDetailsDto updateRequest) {
        SocialDetails socialDetails = socialDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Social details not found for userId: " + userId));


        if (updateRequest.getSchoolName() != null) socialDetails.setSchoolName(updateRequest.getSchoolName());
        if (updateRequest.getUniversityName() != null) socialDetails.setUniversityName(updateRequest.getUniversityName());
        if (updateRequest.getUniversitySpecialty() != null) socialDetails.setUniversitySpecialty(updateRequest.getUniversitySpecialty());
        if (updateRequest.getDrinking() != null) socialDetails.setDrinking(updateRequest.getDrinking());
        if (updateRequest.getSmoking() != null) socialDetails.setSmoking(updateRequest.getSmoking());
        if (updateRequest.getCompany() != null) socialDetails.setCompany(updateRequest.getCompany());
        if (updateRequest.getProfession() != null) socialDetails.setProfession(updateRequest.getProfession());
        if (updateRequest.getInterests() != null) socialDetails.setInterests(updateRequest.getInterests());

        socialDetailsRepository.save(socialDetails);

        return ResponseEntity.ok("Social details updated successfully");
    }


}
