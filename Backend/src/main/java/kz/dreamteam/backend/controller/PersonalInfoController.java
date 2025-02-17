package kz.dreamteam.backend.controller;


import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.UpdatePersonalInfoDto;
import kz.dreamteam.backend.service.PersonalInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class PersonalInfoController {
    private final PersonalInfoService userPersonalInfoService;

    public PersonalInfoController( PersonalInfoService userPersonalInfoService) {
        this.userPersonalInfoService = userPersonalInfoService;
    }


    @PutMapping("/personal-info/{userId}")
    public ResponseEntity<?> updatePersonalInfo(@PathVariable Long userId, @RequestBody UpdatePersonalInfoDto updateRequest) {
        return this.userPersonalInfoService.updatePersonalInfo(userId, updateRequest);
    }
}
