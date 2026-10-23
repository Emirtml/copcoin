package com.i2i.cryptopal.service;

import com.i2i.cryptopal.model.User;
import com.i2i.cryptopal.model.UserWallet;
import com.i2i.cryptopal.repository.TransactionRepository;
import com.i2i.cryptopal.repository.UserRepository;
import com.i2i.cryptopal.repository.UserWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    
    // Emir'in veritabanina OneToOne iliskiyle usdt_balance, btc_balance, eth_balance 
    // kolunlarını eklemesi üzerine yeni kadolan kullnıcının cüzdanını otomatik oluşturmak için ekledim
    private final UserWalletRepository userWalletRepository; 

    private final TransactionRepository transactionRepository; // hesap silme sirasinda islem gecmisini de temizlemek icin (Ege)
    
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate; // Redis baglantisi icin ekledim
    
    private final Random random = new Random();

    @Transactional // ACID kurallari geregi: Kullanici kaydolurken cuzdan kaydi da basarili olmak zorundadir.
    public User registerUser(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Bu kullanıcı adı zaten alınmış!");
        }

        // 5000 ile 15000 arasinda rastgele baslangic bakiyesi uretimi
        double minBalance = 5000.0;
        double maxBalance = 15000.0;
        double randomBalanceValue = minBalance + (maxBalance - minBalance) * random.nextDouble();
        
        BigDecimal startingBalance = BigDecimal.valueOf(randomBalanceValue)
                .setScale(2, RoundingMode.HALF_UP);

        String hashedPassword = passwordEncoder.encode(password);

        // 1. Kullanici Tablosuna Kayit
        User newUser = User.builder()
                .username(username)
                .password(hashedPassword)
                .balance(startingBalance)
                .build();
        User savedUser = userRepository.save(newUser);

        // Yeni kayit olan kullanicinin cüzdaninda baslangic bakiyesini
        // senkronize etmek ve Cuzdan Bulunamadi hatasini onlemek icin ilk cuzdan satiri yaratiliyor
        UserWallet wallet = new UserWallet();
        wallet.setUser(savedUser);
        wallet.setUsdtBalance(startingBalance); // Baslangic nakitini cuzdanin usdt balance alanina da yaziyoruz.
        wallet.setBtcBalance(BigDecimal.ZERO);
        wallet.setEthBalance(BigDecimal.ZERO);
        
        // Null hatasını (not-null constraint) önlemek için yeni eklenen tüm coinlerin bakiyeleri 0 olarak başlatılıyor (Ege)
        wallet.setSolBalance(BigDecimal.ZERO);
        wallet.setAdaBalance(BigDecimal.ZERO);
        wallet.setAvaxBalance(BigDecimal.ZERO);
        wallet.setDogeBalance(BigDecimal.ZERO);
        wallet.setDotBalance(BigDecimal.ZERO);
        wallet.setLinkBalance(BigDecimal.ZERO);
        wallet.setShibBalance(BigDecimal.ZERO);
        wallet.setXrpBalance(BigDecimal.ZERO);
        
        userWalletRepository.save(wallet);

        return savedUser;
    }

    // KULLANICI GIRIS METODU (REDIS OTURUM ENTEGRASYONLU)
    public String loginUser(String username, String password) {
        //  Kullaniciyi veritabaninda ara
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı adı veya şifre hatalı!"));

        //  Sifre eslesmesini kontrol et (Bcrypt matches metodu)
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Kullanıcı adı veya şifre hatalı!");
        }

        //  Benzersiz oturum tokeni (UUID) üret
        String token = UUID.randomUUID().toString();

        //  Tokeni Redis'e 30 dakika süreli olarak kaydet
        //  ( araştırdım bu güüvenlik zafiyeti olmaması için idal sürenin 30 dk olduğuna kanaat getirdim
        //  bu hem bellek yönetimi hem de güvenlik için gerekli
        redisTemplate.opsForValue().set(
                "session:" + token,
                user.getId().toString(),
                Duration.ofSeconds(1800)
        );

        return token;
    }

    // Yardimci metot Kullanici bilgilerini getirmek icin
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı!"));
    }

    // KULLANICI CIKIS METODU (redis otorumunu siler )
    public void logoutUser(String token) {
        redisTemplate.delete("session:" + token);
    }

    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) { // sifre degistirme: eski sifreyi dogrulayip yenisini hashleyip kaydediyoruz (Ege)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı!"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Mevcut şifre yanlış!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(Long userId, String password) { // hesap silme: sifre onayindan sonra once islemler/cuzdan, sonra kullanici siliniyor (Ege)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı!"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Şifre yanlış! Hesap silinemedi.");
        }

        transactionRepository.deleteByUser_Id(userId);
        userWalletRepository.deleteByUserId(userId);
        userRepository.delete(user);
    }

}