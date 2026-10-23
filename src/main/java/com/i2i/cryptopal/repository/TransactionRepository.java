package com.i2i.cryptopal.repository;

import com.i2i.cryptopal.model.Transaction;
import com.i2i.cryptopal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Belirli bir kullanıcının tüm geçmiş işlemlerini yeniden eskiye doğru (kronolojik) listeler
    List<Transaction> findByUserOrderByCreatedAtDesc(User user);

    List<Transaction> findByUser_IdOrderByCreatedAtDesc(Long userId); // Controller'da sadece userId var, User nesnesi yok - dogrudan ID ile sorgu (Ege)

    void deleteByUser_Id(Long userId); // Hesap silinirken kullanicinin tum islem kayitlarini temizlemek icin (Ege)
}