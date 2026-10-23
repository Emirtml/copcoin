package com.i2i.cryptopal.service;

import com.i2i.cryptopal.model.Transaction;
import com.i2i.cryptopal.model.User;
import com.i2i.cryptopal.model.UserWallet;
import com.i2i.cryptopal.repository.UserRepository;
import com.i2i.cryptopal.repository.UserWalletRepository;
import com.i2i.cryptopal.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final UserRepository userRepository;
    private final UserWalletRepository userWalletRepository;
    private final TransactionRepository transactionRepository;
    private final StringRedisTemplate redisTemplate;

    // application.properties dosyasından gemini api bilgilerini okuyoruz
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String generateAIResponse(Long userId, String userQuestion) {
        
        // veritabanından ve Önbellekten Canlı Verileri Çekiyoruz, hasap bilgileri ve cüzdan bakiyelerini
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı!"));

        UserWallet wallet = userWalletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı cüzdanı bulunamadı!"));

        // rediis ten anlık piyasa fiyatlarını çekiyoruz
        String btcPriceStr = redisTemplate.opsForValue().get("BTC");
        String ethPriceStr = redisTemplate.opsForValue().get("ETH");

        BigDecimal btcPrice = btcPriceStr != null ? new BigDecimal(btcPriceStr) : BigDecimal.ZERO;
        BigDecimal ethPrice = ethPriceStr != null ? new BigDecimal(ethPriceStr) : BigDecimal.ZERO;

        // Kullanıcının toplam portföy değerini hesaplıyoruz (Nakit USDT + BTC Değeri + ETH Değeri) (coin miktarı çarpı canlı fiyatlar )
        BigDecimal btcValue = wallet.getBtcBalance().multiply(btcPrice);
        BigDecimal ethValue = wallet.getEthBalance().multiply(ethPrice);
        BigDecimal totalPortfolioValue = wallet.getUsdtBalance().add(btcValue).add(ethValue);

        // Kullanıcının son 5 işlemini çekiyoruz, tarihleriyle beraber
        List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(user);
        StringBuilder txHistoryBuilder = new StringBuilder();
        int limit = Math.min(transactions.size(), 5);
        for (int i = 0; i < limit; i++) {
            Transaction tx = transactions.get(i);
            txHistoryBuilder.append(String.format("- %s tipiyle %s miktarında %s varlığı %s birim fiyattan gerçekleştirildi (Tarih: %s)\n",
                    tx.getTransactionType(),
                    tx.getAmount().toString(),
                    tx.getAssetName(),
                    tx.getPrice().toString(),
                    tx.getCreatedAt().toString()
            ));
        }

        String systemInstruction = "Sen CopCoin platformunda kullanıcılara rehberlik eden profesyonel bir yapay zeka finansal danışmanısın. "
                + "Kullanıcıya güncel portföy durumuna göre özel analizler sunacaksın. "
                + "Yalnızca kripto para, borsa, yatırım ve finansal durumları hakkında konuşacaksın. "
                + "Eğer kullanıcı bu konular dışındaki (örneğin hava durumu, yemek tarifi, genel kültür) sorular sorarsa, nazikçe sadece finans konularında yardımcı olabileceğini söyleyeceksin. "
                + "Cevaplarını Türkçe ve düz metin (Plain Text) formatında, kısa ve öz olarak ver. Yıldız (**) veya kare (###) gibi hiçbir markdown biçimlendirme işareti KULLANMA. Başlıkları düz satır başı olarak yaz ve satır aralarına boşluklar (yeni satır) bırakarak temiz paragraflar oluştur.\n\n";

        String context = String.format("### Kullanıcı Portföy Durumu:\n"
                + "- Kullanıcı Adı: %s\n"
                + "- Nakit Bakiyesi: %s USDT\n"
                + "- Bitcoin (BTC) Varlığı: %s BTC (Canlı Değeri: %s USDT)\n"
                + "- Ethereum (ETH) Varlığı: %s ETH (Canlı Değeri: %s USDT)\n"
                + "- TOPLAM PORTFÖY DEĞERİ: %s USDT\n\n"
                + "### Canlı Piyasa Fiyatları (Redis):\n"
                + "- Canlı BTC Fiyatı: %s USDT\n"
                + "- Canlı ETH Fiyatı: %s USDT\n\n"
                + "### Son Yapılan İşlemler:\n%s\n"
                + "### Kullanıcının Sorusu:\n%s\n",
                user.getUsername(),
                wallet.getUsdtBalance().setScale(2, RoundingMode.HALF_UP).toString(),
                wallet.getBtcBalance().setScale(8, RoundingMode.HALF_UP).toString(),
                btcValue.setScale(2, RoundingMode.HALF_UP).toString(),
                wallet.getEthBalance().setScale(8, RoundingMode.HALF_UP).toString(),
                ethValue.setScale(2, RoundingMode.HALF_UP).toString(),
                totalPortfolioValue.setScale(2, RoundingMode.HALF_UP).toString(),
                btcPrice.setScale(2, RoundingMode.HALF_UP).toString(),
                ethPrice.setScale(2, RoundingMode.HALF_UP).toString(),
                txHistoryBuilder.isEmpty() ? "Henüz işlem kaydı bulunmuyor." : txHistoryBuilder.toString(),
                userQuestion
        );

        String fullPrompt = systemInstruction + context;

        // HTTP istek gövdesini gemini formatına uygun  hazırlıyoruz
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", fullPrompt);

        Map<String, Object> partsContent = new HashMap<>();
        partsContent.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(partsContent));

        // 4. Google Gemini API'sine HTTP POST İsteği At
        String url = geminiApiUrl + "?key=" + geminiApiKey;
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, requestBody, Map.class);
            Map<String, Object> responseBody = responseEntity.getBody();

            // gemini apiden dönen JSON cevabını güvenli bir şekilde ayrıştır ve hata olursa hata mesajı döner
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");
                    if (contentMap != null && contentMap.containsKey("parts")) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Gemini API baglantisinda hata olustu: ", e);
        }

        return "Yapay zeka sistemi şu anda yanıt veremiyor. Lütfen API anahtarınızı kontrol edin veya birkaç saniye sonra tekrar deneyin.";
    }
}
