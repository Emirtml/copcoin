package com.i2i.cryptopal.controller;

import com.i2i.cryptopal.dto.TransactionResponse; // guvenli DTO icin eklendi (Ege)
import com.i2i.cryptopal.model.UserWallet;
import com.i2i.cryptopal.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;  // bu sınıfı ekledim  (F)
import java.util.List; // eklendi (Ege)
import java.util.Map;      // bu sınıfı ekledim (F)
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    /**
     * Kullanıcının cüzdan bilgilerini ve bakiyelerini getirir.
     * GET http://localhost:8080/api/wallet/{userId}
     */
    // burayı güncelledim (Ferhat)
    @GetMapping("/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable Long userId, HttpServletRequest request) {
        // Interceptordan gelen doğrulanmış kullanıcı ıdsini alıyoruz burda
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");

        // token sahibi ile sorgulanan cüzdan sahibi uyuşuyor mu diye kontrol ediyoruz burda (IDOR kontrolü)
        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Bu cüzdan bilgilerine erişim yetkiniz yok!"));
        }

        UserWallet wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }
    /**
     * Kullanıcının cüzdanına sanal USDT (Dolar) yatırır.
     * POST http://localhost:8080/api/wallet/{userId}/deposit?amount=1000
     */

    //  burayı güncellledim (Ferhat)
    @PostMapping("/{userId}/deposit")
    public ResponseEntity<?> depositUsdt(
            @PathVariable Long userId,
            @RequestParam BigDecimal amount,
            HttpServletRequest request) {
        // Interceptordan gelen doğrulanmış kullanıcı ıd sini alıyoruz
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");

        // başkasının hesabına para yatırılmasını engelliyoruz ( IDOR kontrolü)
        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Başka bir kullanıcının cüzdanına para yatıramazsınız!"));
        }

        UserWallet updatedWallet = walletService.depositUsdt(userId, amount);
        return ResponseEntity.ok(updatedWallet);
    }

    /**
     * Kullanıcının geçmiş işlemlerini çeken API ucu.
     * GET http://localhost:8080/api/wallet/{userId}/transactions
     */
    @GetMapping("/{userId}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable Long userId, HttpServletRequest request) {
        // Güvenlik: İstekteki token ile sorgulanan ID uyuşuyor mu? (IDOR Kontrolü)
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");
        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Bu işlem geçmişine erişim yetkiniz yok!"));
        }

        List<TransactionResponse> transactions = walletService.getTransactionHistory(userId); //sifre sizmasin diye TransactionResponse DTO donduruyoruz (Ege)
        return ResponseEntity.ok(transactions);
    }

}