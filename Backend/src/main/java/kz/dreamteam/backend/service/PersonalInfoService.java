package kz.dreamteam.backend.service;


import jakarta.transaction.Transactional;
import kz.dreamteam.backend.model.PersonalInfo;
import kz.dreamteam.backend.model.dto.UpdatePersonalInfoDto;
import kz.dreamteam.backend.repository.PersonalInfoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class PersonalInfoService {

    private final PersonalInfoRepository personalInfoRepository;

    public PersonalInfoService(PersonalInfoRepository personalInfoRepository) {
        this.personalInfoRepository = personalInfoRepository;
    }


    public ResponseEntity<String> updatePersonalInfo(Long userId, UpdatePersonalInfoDto updateRequest) {

        PersonalInfo personalInfo = personalInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Personal info not found for userId: " + userId));

        if (updateRequest.getBirthDate() != null) personalInfo.setBirthDate(updateRequest.getBirthDate());
        if (updateRequest.getGender() != null) personalInfo.setGender(updateRequest.getGender());
        if (updateRequest.getReligion() != null) personalInfo.setReligion(updateRequest.getReligion());

        personalInfoRepository.save(personalInfo);

        return ResponseEntity.ok("Personal info updated successfully");
    }



}
