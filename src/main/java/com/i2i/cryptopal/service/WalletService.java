package com.i2i.cryptopal.service;

import com.i2i.cryptopal.dto.TradeRequest;
import com.i2i.cryptopal.dto.TradeResponse;
import com.i2i.cryptopal.dto.TransactionResponse; // guvenli DTO icin eklendi (Ege)
import com.i2i.cryptopal.model.Transaction;
import com.i2i.cryptopal.model.UserWallet;
import com.i2i.cryptopal.repository.TransactionRepository;
import com.i2i.cryptopal.repository.UserWalletRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List; // eklendi (Ege)
import java.util.stream.Collectors; // eklendi (Ege)

@Service
public class WalletService {

    private final UserWalletRepository userWalletRepository;
    private final TransactionRepository transactionRepository;
    private final StringRedisTemplate redisTemplate;

    // Temiz Constructor Entegrasyonu
    public WalletService(UserWalletRepository userWalletRepository, 
                         TransactionRepository transactionRepository,
                         StringRedisTemplate redisTemplate) {
        this.userWalletRepository = userWalletRepository;
        this.transactionRepository = transactionRepository;
        this.redisTemplate = redisTemplate;
    }

    /**
     * Kullanıcı ID'sine göre cüzdan bilgilerini veritabanından getirir.
     */
    @Transactional(readOnly = true)
    public UserWallet getWalletByUserId(Long userId) {
        return userWalletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cüzdan bulunamadı! Kullanıcı ID: " + userId));
    }

    /**
     * Kullanıcının cüzdanına sanal USDT (Dolar) yatırır.
     */
    @Transactional
    public UserWallet depositUsdt(Long userId, BigDecimal amount) {
        // 1. Güvenlik Kontrolü
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Yatırılacak miktar 0'dan büyük olmalıdır!");
        }

        // 2. Cüzdanı Bulma
        UserWallet wallet = getWalletByUserId(userId);
        
        // 3. Null Kontrolü ve Hesaplama
        BigDecimal currentBalance = wallet.getUsdtBalance();
        if (currentBalance == null) {
            currentBalance = BigDecimal.ZERO;
        }
        
        // 4. Yeni Bakiyeyi Ekleme
        wallet.setUsdtBalance(currentBalance.add(amount));
        
        // 5. Profil Bakiyesi ile Senkronizasyon
        if (wallet.getUser() != null) {
            wallet.getUser().setBalance(wallet.getUsdtBalance());
        }
        
        return userWalletRepository.save(wallet);
    }

    /**
     * i2i Dökümanı Modül 5.2.1 ve 5.4: Canlı Redis Destekli Alım-Satım Emir Yönetimi
     */
    @Transactional
    public TradeResponse processTradeOrder(TradeRequest request) {
        // 1. Kullanıcı cüzdanını doğrula
        UserWallet wallet = userWalletRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Cüzdan bulunamadı!"));  //güncellendi (Ferhat)
        // 2. Redis üzerinden anlık fiyatı çek
        String coinKey = request.getCoinSymbol().toUpperCase(); 
        String cachedPrice = redisTemplate.opsForValue().get(coinKey);

        if (cachedPrice == null) {
            throw new RuntimeException("Anlık piyasa fiyatı şu anda alınamıyor! Lütfen birkaç saniye sonra tekrar deneyin.");
        }

        BigDecimal coinPrice = new BigDecimal(cachedPrice);
        BigDecimal totalCost = request.getAmount().multiply(coinPrice);

        // 3. BUY (Alım) İşlemi İş Mantığı
        if ("BUY".equalsIgnoreCase(request.getAction())) {
            if (wallet.getUsdtBalance().compareTo(totalCost) < 0) {
                throw new IllegalArgumentException("Yetersiz bakiye! İşlem için yeterli USDT bulunmuyor.");   // güncellendi( Ferjat)
            }

            wallet.setUsdtBalance(wallet.getUsdtBalance().subtract(totalCost));
            
            if ("BTC".equalsIgnoreCase(coinKey)) {
                wallet.setBtcBalance(wallet.getBtcBalance().add(request.getAmount()));
            } else if ("ETH".equalsIgnoreCase(coinKey)) {
                wallet.setEthBalance(wallet.getEthBalance().add(request.getAmount()));
            } else if ("SOL".equalsIgnoreCase(coinKey)) {
                wallet.setSolBalance(wallet.getSolBalance().add(request.getAmount())); // Yeni eklenen Solana alım mantığı (Ferhat)
            } else if ("DOGE".equalsIgnoreCase(coinKey)) {
                wallet.setDogeBalance(wallet.getDogeBalance().add(request.getAmount())); // Yeni eklenen Dogecoin alım mantığı (Ferhat)
            } else if ("ADA".equalsIgnoreCase(coinKey)) {
                wallet.setAdaBalance(wallet.getAdaBalance().add(request.getAmount())); // Yeni eklenen Cardano alım mantığı (Ferhat)
            } else if ("XRP".equalsIgnoreCase(coinKey)) {
                wallet.setXrpBalance(wallet.getXrpBalance().add(request.getAmount())); // Yeni eklenen Ripple alım mantığı (Ferhat)
            } else if ("DOT".equalsIgnoreCase(coinKey)) {
                wallet.setDotBalance(wallet.getDotBalance().add(request.getAmount())); // Yeni eklenen Polkadot alım mantığı (Ferhat)
            } else if ("AVAX".equalsIgnoreCase(coinKey)) {
                wallet.setAvaxBalance(wallet.getAvaxBalance().add(request.getAmount())); // Yeni eklenen Avalanche alım mantığı (Ferhat)
            } else if ("LINK".equalsIgnoreCase(coinKey)) {
                wallet.setLinkBalance(wallet.getLinkBalance().add(request.getAmount())); // Yeni eklenen Chainlink alım mantığı (Ferhat)
            } else if ("SHIB".equalsIgnoreCase(coinKey)) {
                wallet.setShibBalance(wallet.getShibBalance().add(request.getAmount())); // Yeni eklenen Shiba Inu alım mantığı (Ferhat)
            } else {
                throw new IllegalArgumentException("Geçersiz coin sembolü! Bu kripto para işlem göremez.");  // güncellendi (Ferhat)
            }
        } 
        // 4. SELL (Satım) İşlemi İş Mantığı
        else if ("SELL".equalsIgnoreCase(request.getAction())) {
            BigDecimal userBalance = BigDecimal.ZERO;
            if ("BTC".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getBtcBalance();
            } else if ("ETH".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getEthBalance();
            } else if ("SOL".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getSolBalance(); // Yeni eklenen Solana satım kontrolü (Ferhat)
            } else if ("DOGE".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getDogeBalance(); // Yeni eklenen Dogecoin satım kontrolü (Ferhat)
            } else if ("ADA".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getAdaBalance(); // Yeni eklenen Cardano satım kontrolü (Ferhat)
            } else if ("XRP".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getXrpBalance(); // Yeni eklenen Ripple satım kontrolü (Ferhat)
            } else if ("DOT".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getDotBalance(); // Yeni eklenen Polkadot satım kontrolü (Ferhat)
            } else if ("AVAX".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getAvaxBalance(); // Yeni eklenen Avalanche satım kontrolü (Ferhat)
            } else if ("LINK".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getLinkBalance(); // Yeni eklenen Chainlink satım kontrolü (Ferhat)
            } else if ("SHIB".equalsIgnoreCase(coinKey)) {
                userBalance = wallet.getShibBalance(); // Yeni eklenen Shiba Inu satım kontrolü (Ferhat)
            } else {
                throw new IllegalArgumentException("Geçersiz coin sembolü!");
            }

            if (userBalance == null || userBalance.compareTo(request.getAmount()) < 0) {
                throw new IllegalArgumentException("Yetersiz " + coinKey + " varlığı!"); // güncellendi (Ferhat)
            }

            if ("BTC".equalsIgnoreCase(coinKey)) {
                wallet.setBtcBalance(wallet.getBtcBalance().subtract(request.getAmount()));
            } else if ("ETH".equalsIgnoreCase(coinKey)) {
                wallet.setEthBalance(wallet.getEthBalance().subtract(request.getAmount()));
            } else if ("SOL".equalsIgnoreCase(coinKey)) {
                wallet.setSolBalance(wallet.getSolBalance().subtract(request.getAmount())); // Yeni eklenen Solana bakiye düşümü (Ferhat)
            } else if ("DOGE".equalsIgnoreCase(coinKey)) {
                wallet.setDogeBalance(wallet.getDogeBalance().subtract(request.getAmount())); // Yeni eklenen Dogecoin bakiye düşümü (Ferhat)
            } else if ("ADA".equalsIgnoreCase(coinKey)) {
                wallet.setAdaBalance(wallet.getAdaBalance().subtract(request.getAmount())); // Yeni eklenen Cardano bakiye düşümü (Ferhat)
            } else if ("XRP".equalsIgnoreCase(coinKey)) {
                wallet.setXrpBalance(wallet.getXrpBalance().subtract(request.getAmount())); // Yeni eklenen Ripple bakiye düşümü (Ferhat)
            } else if ("DOT".equalsIgnoreCase(coinKey)) {
                wallet.setDotBalance(wallet.getDotBalance().subtract(request.getAmount())); // Yeni eklenen Polkadot bakiye düşümü (Ferhat)
            } else if ("AVAX".equalsIgnoreCase(coinKey)) {
                wallet.setAvaxBalance(wallet.getAvaxBalance().subtract(request.getAmount())); // Yeni eklenen Avalanche bakiye düşümü (Ferhat)
            } else if ("LINK".equalsIgnoreCase(coinKey)) {
                wallet.setLinkBalance(wallet.getLinkBalance().subtract(request.getAmount())); // Yeni eklenen Chainlink bakiye düşümü (Ferhat)
            } else if ("SHIB".equalsIgnoreCase(coinKey)) {
                wallet.setShibBalance(wallet.getShibBalance().subtract(request.getAmount())); // Yeni eklenen Shiba Inu bakiye düşümü (Ferhat)
            }

            wallet.setUsdtBalance(wallet.getUsdtBalance().add(totalCost));
        } else {
            throw new IllegalArgumentException("Geçersiz işlem tipi! Sadece BUY veya SELL yapılabilir.");  // güncelledim(Ferhat)
        }

        // Ana kullanıcı profilindeki bakiye alanını senkronize et
        if (wallet.getUser() != null) {
            wallet.getUser().setBalance(wallet.getUsdtBalance());
        }

        // 5. Güncellenen cüzdan verilerini kaydet
        userWalletRepository.save(wallet);

        // 6. Değiştirilemez İşlem Dekontunu (Transaction Log) Kaydet
        Transaction txLog = new Transaction();
        txLog.setUser(wallet.getUser());
        txLog.setTransactionType(request.getAction().toUpperCase());
        txLog.setAssetName(coinKey); 
        txLog.setAmount(request.getAmount());
        txLog.setPrice(coinPrice); 
        txLog.setTotalCost(totalCost); 
        
        transactionRepository.save(txLog);

        // 7. API kılavuzuna uygun saf işlem dekontu nesnesini dön (Ege)
        return new TradeResponse(
                "SUCCESS",
                "İşlem anlık fiyat üzerinden başarıyla gerçekleşti.",
                request.getAction().toUpperCase(),
                coinKey,
                request.getAmount(),
                coinPrice, 
                totalCost
        );
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionHistory(Long userId) { //ham Transaction donduruyordu, sifre hash'i sizabiliyordu (Ege)
        return transactionRepository.findByUser_IdOrderByCreatedAtDesc(userId) // userId ile direkt sorgu (Ege)
                .stream()
                .map(tx -> new TransactionResponse( // guvenlik icin ham Transaction yerine DTO'ya donusturuyoruz (Ege)
                        tx.getId(),
                        tx.getTransactionType(),
                        tx.getAssetName(),
                        tx.getAmount(),
                        tx.getPrice(),
                        tx.getTotalCost(),
                        tx.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}