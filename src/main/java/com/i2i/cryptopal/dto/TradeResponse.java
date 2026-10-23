package com.i2i.cryptopal.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TradeResponse {
    private String status;          
    private String message;         
    private String transactionType; 
    private String coinSymbol;      
    private BigDecimal amount;      
    private BigDecimal executionPrice; 
    private BigDecimal totalCost;   
    private String timestamp; // Tarihi String yaparak Swagger'ın donmasını engelliyoruz

    // Swagger için zorunlu olan boş parametresiz constructor
    public TradeResponse() {
        this.timestamp = LocalDateTime.now().toString();
    }

    // WalletService'in çağıracağı argümanlı constructor
    public TradeResponse(String status, String message, String transactionType, String coinSymbol, 
                         BigDecimal amount, BigDecimal executionPrice, BigDecimal totalCost) {
        this.status = status;
        this.message = message;
        this.transactionType = transactionType;
        this.coinSymbol = coinSymbol;
        this.amount = amount;
        this.executionPrice = executionPrice;
        this.totalCost = totalCost;
        this.timestamp = LocalDateTime.now().toString(); 
    }

    // Getter Metotları
    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public String getTransactionType() { return transactionType; }
    public String getCoinSymbol() { return coinSymbol; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getExecutionPrice() { return executionPrice; }
    public BigDecimal getTotalCost() { return totalCost; }
    public String getTimestamp() { return timestamp; }

    // Setter Metotları
    public void setStatus(String status) { this.status = status; }
    public void setMessage(String message) { this.message = message; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public void setCoinSymbol(String coinSymbol) { this.coinSymbol = coinSymbol; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setExecutionPrice(BigDecimal executionPrice) { this.executionPrice = executionPrice; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}