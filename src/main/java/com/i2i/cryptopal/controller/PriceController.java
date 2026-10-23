package com.i2i.cryptopal.controller;

import com.i2i.cryptopal.model.PriceTrend;
import com.i2i.cryptopal.repository.PriceTrendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Fiyat işlemlerini dış dünyaya (Frontend) açan API Kapısı.
 * Tamamen Emirin yazdığı PriceTrendRepository altyapısını kullanır.
 *  API sozlesmesindeki /api/market/prices formatına
 *  uyum sağlamak amacıyla RequestMapping adresi /api/market olarak güncelledim (Ferhat)
 */
@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor  //lombok'un otomatik olarak constructor oluşturmasını sağlar, böylece final değişkenlerimizi Spring Boot otomatik olarak inject eder.
public class PriceController {

    private final StringRedisTemplate redisTemplate;
    private final PriceTrendRepository priceTrendRepository;

    /**
     * GET /api/prices/current ---> bu kısmı api sözleşmesine uyarak uyuşmazlığın oluşmaması için /current adresi / prices yapıldı ( Ferhat)
     * Redis'ten BTC ve ETH'nin anlık fiyatını hızlıca döner.

     */
    @GetMapping("/prices")
    public ResponseEntity<Map<String, String>> getCurrentPrices() {
        Map<String, String> prices = new HashMap<>();
        
        // Tüm kripto paraların anlık fiyatlarını Redis'ten çekiyoruz (Ferhat)
        String[] symbols = {"BTC", "ETH", "SOL", "DOGE", "ADA", "XRP", "DOT", "AVAX", "LINK", "SHIB"};
        for (String symbol : symbols) {
            String val = redisTemplate.opsForValue().get(symbol);
            prices.put(symbol, val != null ? val : "0.00");
        }

        return ResponseEntity.ok(prices);
    }

    /**
     * GET /api/prices/history?asset=BTC
     * PriceTrendRepository metodunu kullanarak, 
     * parametre olarak gelen varlığın (BTC veya ETH) geçmiş fiyatlarını kronolojik döner.
     * RequestMapping /api/market olduğu için bu ucun adresi /api/market/history haline geldi (Ferhat)
     */
    @GetMapping("/history")
    public ResponseEntity<List<PriceTrend>> getPriceHistory(@RequestParam(defaultValue = "BTC") String asset) {
        // Doğrudan bizim tasarladığımız veritabanı sorgusunu çağırıyoruz! Parametre olarak hiçbirşey girilmesse varsayılan olarak btc geçmişini getirir
        List<PriceTrend> history = priceTrendRepository.findByAssetNameOrderByCreatedAtAsc(asset);
        return ResponseEntity.ok(history);
    }
}