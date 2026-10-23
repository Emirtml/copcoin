package com.i2i.cryptopal.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions") // Veritabanındaki transactions tablosu ile eşleştiriyoruz
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Her işlem geçmişi kaydı bir kullanıcıya aittir
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "transaction_type", nullable = false, length = 10)
    private String transactionType; // "BUY" veya "SELL" değerlerini alacak

    @Column(name = "asset_name", nullable = false, length = 10)
    private String assetName; // Örn: BTC, ETH

    @Column(name = "amount", nullable = false)
    private BigDecimal amount; // Alınan/Satılan miktar

    @Column(name = "price", nullable = false)
    private BigDecimal price; // İşlem anındaki birim fiyat

    @Column(name = "total_cost", nullable = false)
    private BigDecimal totalCost; // Toplam tutar (Miktar * Birim Fiyat)

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Veritabanına yeni kayıt eklenirken zaman damgasını otomatik olarak o anki zaman yapar
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}