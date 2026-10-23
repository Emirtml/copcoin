package com.i2i.cryptopal.repository;

import com.i2i.cryptopal.model.PriceTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PriceTrendRepository extends JpaRepository<PriceTrend, Long> {
    
    // Belirli bir varlığın (örn: BTC) fiyat geçmişini en eskiden en yeniye doğru sıralı getirir (Grafik çizimi için)
    List<PriceTrend> findByAssetNameOrderByCreatedAtAsc(String assetName);
}
