package com.i2i.cryptopal.dto;

import java.math.BigDecimal;

public class TradeRequest {
    // 1. Değişkenler: Frontend'den bize gelecek ham bilgileri tutar.
    private Long userId;        // İşlemi yapan kullanıcının ID'si (Örn: 1, 45)
    private String coinSymbol;  // İşlem görecek kripto para (Örn: "BTC" veya "ETH")
    private String action;      // Yapılacak işlem türü (Örn: "BUY" veya "SELL")
    private BigDecimal amount;  // Alınmak/satılmak istenen miktar (Örn: 0.005 veya 1.2)

    // 2. Getter ve Setter Metotları: 
    // Spring Boot'un bu değişkenlerin içine veri yazabilmesi ve okuyabilmesi için gereklidir.

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCoinSymbol() { return coinSymbol; }
    public void setCoinSymbol(String coinSymbol) { this.coinSymbol = coinSymbol; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
