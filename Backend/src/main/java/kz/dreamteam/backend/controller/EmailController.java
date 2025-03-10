package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendEmailGoogle(
            @RequestParam String to) {
        emailService.sendEmailGoogle(to);
        return ResponseEntity.ok("Email sent successfully!");
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestParam String to) {
        try {
            emailService.sendEmail(to);
            return ResponseEntity.ok("Email sent successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
        }
    }
}

