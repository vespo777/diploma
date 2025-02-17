package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(
            @RequestParam String to) {
        emailService.sendEmail(to);
        return ResponseEntity.ok("Email sent successfully!");
    }
}

