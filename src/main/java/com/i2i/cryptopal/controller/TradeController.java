package com.i2i.cryptopal.controller;

import com.i2i.cryptopal.dto.TradeRequest;
import com.i2i.cryptopal.dto.TradeResponse;
import com.i2i.cryptopal.service.WalletService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
public class TradeController {

    private final WalletService walletService;

    @PostMapping("/order")
    public ResponseEntity<?> processOrder(@RequestBody TradeRequest tradeRequest, HttpServletRequest request) {
        
        // Interceptor'ın Redis'ten çözüp isteğe Long tipinde gömdüğü GERÇEK kullanıcı ID'sini alıyoruz.
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");

        //(IDOR Koruması): Token sahibi olan kişi ile işlem yapılmak istenen kullanıcı ID'si uyuşuyor mu?
        if (!authenticatedUserId.equals(tradeRequest.getUserId())) {
            return ResponseEntity.status(403).body(
                Map.of(
                    "status", 403,
                    "error", "Forbidden",
                    "message", "Güvenlik Engeli! Başka bir kullanıcının hesabı üzerinden al-sat emri veremezsiniz."
                )
            );
        }

        // Her şey senkron ve güvenliyse asıl iş mantığı tetiklenir.
        TradeResponse response = walletService.processTradeOrder(tradeRequest);
        return ResponseEntity.ok(response);
    }
}