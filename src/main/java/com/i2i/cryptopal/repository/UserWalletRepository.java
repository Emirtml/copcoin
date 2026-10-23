package com.i2i.cryptopal.repository;

import com.i2i.cryptopal.model.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserWalletRepository extends JpaRepository<UserWallet, Long> {
    
    /**
     * Kullanıcı ID'sine göre veritabanından cüzdanı getirir.
     */
    Optional<UserWallet> findByUserId(Long userId);

    void deleteByUserId(Long userId); // Hesap silinirken cuzdan kaydini da temizlemek icin (Ege)
}