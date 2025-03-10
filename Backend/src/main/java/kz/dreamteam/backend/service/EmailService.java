package kz.dreamteam.backend.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.IOException;
import java.util.Random;


@Service
public class EmailService {

    @Value("${spring.sendgrid.api-key}")
    private String sendGridApiKey;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmailGoogle(String to) {

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

    public void sendEmail(String to) throws IOException {
        Email from = new Email("roommatefinder47@gmail.com"); // Укажите email, зарегистрированный в SendGrid
        Email toEmail = new Email(to);

        Random random = new Random();
        Content emailContent = new Content("text/plain", String.valueOf(100000 + random.nextInt(900000)));


        Mail mail = new Mail(from, "Reset Code", toEmail, emailContent);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            logger.info("Status Code: {}", response.getStatusCode());
            logger.info("Body: {}", response.getBody());
        } catch (IOException ex) {
            throw ex;
        }
    }
}

