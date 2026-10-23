package com.i2i.cryptopal.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_trends") // Veritabanındaki tablo ile eşleştiriyoruz
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceTrend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_name", nullable = false, length = 10)
    private String assetName; // Örn: BTC, ETH

    @Column(name = "price", nullable = false)
    private BigDecimal price; // O anki birim fiyatı

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Veritabanına yeni fiyat kaydı atılırken zamanı otomatik olarak o anki zaman yapar
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
