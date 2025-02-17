package kz.dreamteam.backend.controller;


import kz.dreamteam.backend.model.dto.UpdatePersonalInfoDto;
import kz.dreamteam.backend.model.dto.UpdateSocialDetailsDto;
import kz.dreamteam.backend.service.SocialDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class SocialDetailsController {

    private final SocialDetailsService socialDetailsService;

    public SocialDetailsController(SocialDetailsService socialDetailsService) {
        this.socialDetailsService = socialDetailsService;
    }


    @PutMapping("/social-details/{userId}")
    public ResponseEntity<String> updateSocialsDetails(@PathVariable Long userId, @RequestBody UpdateSocialDetailsDto updateRequest) {
        return this.socialDetailsService.updateSocialDetails(userId, updateRequest);
    }
}
