package com.i2i.cryptopal.scheduler;

import com.i2i.cryptopal.model.PriceTrend;
import com.i2i.cryptopal.repository.PriceTrendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

@Component // 1. Spring'e bu sınıfın arka planda yaşayan bir parça olduğunu söyler
@RequiredArgsConstructor // 2. Sınıftaki 'final' değişkenleri otomatik olarak bağlar (Dependency Injection)
@Slf4j // 3. Konsola renkli loglar (bilgilendirme yazıları) yazabilmemizi sağlar
public class TickerEngine {

    // Bizim dış bağlantı kapılarımız (Dependency)
    private final StringRedisTemplate redisTemplate; // Redis'e veri yazmak için kullandığımız araç
    private final PriceTrendRepository priceTrendRepository; // PostgreSQL trend yazıcısı

    private final Random random = new Random(); // Rastgele sayı üretici

    // Sanal piyasamızın başlangıç fiyatları (Açılış değerleri) (Ferhat)
    private BigDecimal btcPrice = new BigDecimal("60000.00");
    private BigDecimal ethPrice = new BigDecimal("3000.00");
    private BigDecimal solPrice = new BigDecimal("150.00");
    private BigDecimal dogePrice = new BigDecimal("0.1500");
    private BigDecimal adaPrice = new BigDecimal("0.5000");
    private BigDecimal xrpPrice = new BigDecimal("0.6000");
    private BigDecimal dotPrice = new BigDecimal("6.00");
    private BigDecimal avaxPrice = new BigDecimal("30.00");
    private BigDecimal linkPrice = new BigDecimal("15.00");
    private BigDecimal shibPrice = new BigDecimal("0.000025");

    // Spring Bootun zaman ayarı: fixedRate = 15000 (15 saniyede bir bu metot otomatik olarak tetiklenir)
    @Scheduled(fixedRate = 15000)
    public void generateNewPrices() {
        
        // 1.ADIM: Tüm kripto paralar için yeni dalgalı fiyatlar hesapla (Ferhat)
        btcPrice = calculateNewPrice(btcPrice, 2);
        ethPrice = calculateNewPrice(ethPrice, 2);
        solPrice = calculateNewPrice(solPrice, 2);
        dogePrice = calculateNewPrice(dogePrice, 4);
        adaPrice = calculateNewPrice(adaPrice, 4);
        xrpPrice = calculateNewPrice(xrpPrice, 4);
        dotPrice = calculateNewPrice(dotPrice, 2);
        avaxPrice = calculateNewPrice(avaxPrice, 2);
        linkPrice = calculateNewPrice(linkPrice, 2);
        shibPrice = calculateNewPrice(shibPrice, 6);

        log.info("Yeni Fiyatlar Üretildi -> BTC: ${}, ETH: ${}, SOL: ${}, DOGE: ${}", btcPrice, ethPrice, solPrice, dogePrice);

        // 2.ADIM: Anlık fiyatları REDIS'e yaz (Eski fiyatı siler, yenisini yazar) (Ferhat)
        redisTemplate.opsForValue().set("BTC", btcPrice.toString());
        redisTemplate.opsForValue().set("ETH", ethPrice.toString());
        redisTemplate.opsForValue().set("SOL", solPrice.toString());
        redisTemplate.opsForValue().set("DOGE", dogePrice.toString());
        redisTemplate.opsForValue().set("ADA", adaPrice.toString());
        redisTemplate.opsForValue().set("XRP", xrpPrice.toString());
        redisTemplate.opsForValue().set("DOT", dotPrice.toString());
        redisTemplate.opsForValue().set("AVAX", avaxPrice.toString());
        redisTemplate.opsForValue().set("LINK", linkPrice.toString());
        redisTemplate.opsForValue().set("SHIB", shibPrice.toString());

        // 3. ADIM: Grafik çizimi geçmişi için fiyatı POSTGRESQL'e kaydet (Trend analizi) (Ferhat)
        saveTrend("BTC", btcPrice);
        saveTrend("ETH", ethPrice);
        saveTrend("SOL", solPrice);
        saveTrend("DOGE", dogePrice);
        saveTrend("ADA", adaPrice);
        saveTrend("XRP", xrpPrice);
        saveTrend("DOT", dotPrice);
        saveTrend("AVAX", avaxPrice);
        saveTrend("LINK", linkPrice);
        saveTrend("SHIB", shibPrice);
        
        log.info("Yeni fiyat trendleri basariyla kaydedildi.");
    }

    private void saveTrend(String symbol, BigDecimal price) {
        PriceTrend trend = PriceTrend.builder()
                .assetName(symbol)
                .price(price)
                .build();
        priceTrendRepository.save(trend);
    }

    // Fiyatı her 15 saniyede bir % -1.5 ile % +1.5 arasında rastgele dalgalandıran matematiksel fonksiyon (Ferhat)
    private BigDecimal calculateNewPrice(BigDecimal currentPrice, int scale) {
        // -1.5 ile +1.5 arasında rastgele bir yüzde oranı üretir
        double percentChange = -1.5 + (3.0 * random.nextDouble());
        
        // Değişim miktarını hesapla: mevcutFiyat * değişimOranı / 100
        BigDecimal change = currentPrice.multiply(BigDecimal.valueOf(percentChange))
                .divide(BigDecimal.valueOf(100), scale, RoundingMode.HALF_UP);
        
        // Yeni fiyatı hesapla (mevcut fiyata değişim miktarını ekle) ve virgülden sonra ilgili haneye yuvarla
        BigDecimal newPrice = currentPrice.add(change);
        return newPrice.setScale(scale, RoundingMode.HALF_UP);
    }
}
