package com.i2i.cryptopal.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Islem gecmisi ucu icin guvenli veri kalibi - ham Transaction/User nesnesi yerine
// sadece bu alanlar disari gonderiliyor, sifre hash'i sizma riski olmasin diye eklendi (Ege)
public class TransactionResponse {
    private Long id;
    private String transactionType;
    private String assetName;
    private BigDecimal amount;
    private BigDecimal price;
    private BigDecimal totalCost;
    private LocalDateTime createdAt;

    public TransactionResponse() {}

    public TransactionResponse(Long id, String transactionType, String assetName, BigDecimal amount,
                                BigDecimal price, BigDecimal totalCost, LocalDateTime createdAt) {
        this.id = id;
        this.transactionType = transactionType;
        this.assetName = assetName;
        this.amount = amount;
        this.price = price;
        this.totalCost = totalCost;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTransactionType() { return transactionType; }
    public String getAssetName() { return assetName; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getTotalCost() { return totalCost; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}