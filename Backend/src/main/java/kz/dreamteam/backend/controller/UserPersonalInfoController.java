package kz.dreamteam.backend.controller;


import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.UpdatePersonalInfoDto;
import kz.dreamteam.backend.service.UserPersonalInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserPersonalInfoController {
    private final UserPersonalInfoService userPersonalInfoService;

    public UserPersonalInfoController( UserPersonalInfoService userPersonalInfoService) {
        this.userPersonalInfoService = userPersonalInfoService;
    }


    @PutMapping("/personal-info/{userId}")
    public ResponseEntity<?> updatePersonalInfo(@PathVariable Long userId, @RequestBody UpdatePersonalInfoDto updateRequest) {
        return this.userPersonalInfoService.updateUserPersonalInfo(userId, updateRequest);
    }
}
