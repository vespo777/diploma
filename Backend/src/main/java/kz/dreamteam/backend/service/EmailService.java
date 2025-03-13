package kz.dreamteam.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;


import java.util.Random;


@Service
public class EmailService {

    @Value("${mailgun.api-key}")
    private String apiKey;

    @Value("${mailgun.domain}")
    private String domain;

    @Value("${mailgun.sender-email}")
    private String senderEmail;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public EmailService(){
    }

    public void sendEmail(String to) {
        String url = "https://api.mailgun.net/v3/" + domain + "/messages";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("api", apiKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Random random = new Random();
        String resetCode = "Your verification code for password reset: " + (100000 + random.nextInt(900000));

        String requestBody = "from=" + senderEmail +
                "&to=" + to +
                "&subject=" + "Reset Code Service" +
                "&text=" + resetCode;

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

        logger.info("Mailgun response: {}", response.getBody());
    }

}

