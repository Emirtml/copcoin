package com.i2i.cryptopal.controller;

import com.i2i.cryptopal.dto.AIQueryRequest;
import com.i2i.cryptopal.dto.AIQueryResponse;
import com.i2i.cryptopal.service.AIService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")  // yapay zeka ile ilgili tüm istekler bu ön eke sahip olmalı
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/query")
    public ResponseEntity<AIQueryResponse> queryAI(@Valid @RequestBody AIQueryRequest requestBody, HttpServletRequest request) {
        
        // interceptordan gelen doğrulanmış kullanıcı ıdsini alıyoruz
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");

        // canlı verileri birleştirip gemini apisine soruyoruz
        String aiResponse = aiService.generateAIResponse(authenticatedUserId, requestBody.getQuestion());

        return ResponseEntity.ok(new AIQueryResponse(aiResponse));
    }
}
