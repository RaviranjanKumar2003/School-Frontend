package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.service.SmsService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsServiceImpl implements SmsService {

    @Override
    public void sendSMS(String number, String message) {

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://www.fast2sms.com/dev/bulkV2";

        HttpHeaders headers = new HttpHeaders();
        headers.set("authorization", "YOUR_API_KEY"); // 🔥 Fast2SMS API key
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("route", "q");
        body.put("message", message);
        body.put("language", "english");
        body.put("numbers", number);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForObject(url, request, String.class);
    }
}