package kz.dreamteam.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Random;


@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Random random = new Random();

            helper.setFrom("roommatefinder47@gmail.com");
            helper.setTo(to);
            helper.setSubject("Password reset code");
            helper.setText(String.valueOf(random.nextInt(900000)), true); // true = поддержка HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send email:", e);
        }
    }
}

