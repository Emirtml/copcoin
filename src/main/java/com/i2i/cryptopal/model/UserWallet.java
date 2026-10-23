package com.i2i.cryptopal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore; // YENİ EKLEME: Döngüyü kıran kütüphane

@Entity
@Table(name = "user_wallets")
@Getter
@Setter
public class UserWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore // SİHİRLİ DOKUNUŞ: Swagger ve Jackson'ın sonsuz döngüye girmesini %100 engeller!
    private User user;

    @Column(name = "usdt_balance")
    private BigDecimal usdtBalance;

    @Column(name = "btc_balance")
    private BigDecimal btcBalance;

    @Column(name = "eth_balance")
    private BigDecimal ethBalance;

    @Column(name = "sol_balance")
    private BigDecimal solBalance; // Yeni eklenen Solana bakiyesi (Ferhat)

    @Column(name = "doge_balance")
    private BigDecimal dogeBalance; // Yeni eklenen Dogecoin bakiyesi (Ferhat)

    @Column(name = "ada_balance")
    private BigDecimal adaBalance; // Yeni eklenen Cardano bakiyesi (Ferhat)

    @Column(name = "xrp_balance")
    private BigDecimal xrpBalance; // Yeni eklenen Ripple bakiyesi (Ferhat)

    @Column(name = "dot_balance")
    private BigDecimal dotBalance; // Yeni eklenen Polkadot bakiyesi (Ferhat)

    @Column(name = "avax_balance")
    private BigDecimal avaxBalance; // Yeni eklenen Avalanche bakiyesi (Ferhat)

    @Column(name = "link_balance")
    private BigDecimal linkBalance; // Yeni eklenen Chainlink bakiyesi (Ferhat)

    @Column(name = "shib_balance")
    private BigDecimal shibBalance; // Yeni eklenen Shiba Inu bakiyesi (Ferhat)

    // --- LOMBOK BLOKAJINI AŞMAK İÇİN ELLE EKLENEN GARANTİ METOTLAR --- -emir 

    public BigDecimal getUsdtBalance() {
        return usdtBalance;
    }

    public void setUsdtBalance(BigDecimal usdtBalance) {
        this.usdtBalance = usdtBalance;
    }

    public BigDecimal getBtcBalance() {
        return btcBalance;
    }

    public void setBtcBalance(BigDecimal btcBalance) {
        this.btcBalance = btcBalance;
    }

    public BigDecimal getEthBalance() {
        return ethBalance;
    }

    public void setEthBalance(BigDecimal ethBalance) {
        this.ethBalance = ethBalance; // kanka yukardaki yorumu sen mi yazdın bilmiyorum ama doğrusu bu olmalı düzenlersin burayı (Ferhat)
    }

    public BigDecimal getSolBalance() {
        return solBalance;
    }

    public void setSolBalance(BigDecimal solBalance) {
        this.solBalance = solBalance; // Yeni eklenen Solana setter metodu (Ferhat)
    }

    public BigDecimal getDogeBalance() {
        return dogeBalance;
    }

    public void setDogeBalance(BigDecimal dogeBalance) {
        this.dogeBalance = dogeBalance; // Yeni eklenen Dogecoin setter metodu (Ferhat)
    }

    public BigDecimal getAdaBalance() {
        return adaBalance;
    }

    public void setAdaBalance(BigDecimal adaBalance) {
        this.adaBalance = adaBalance; // Yeni eklenen Cardano setter metodu (Ferhat)
    }

    public BigDecimal getXrpBalance() {
        return xrpBalance;
    }

    public void setXrpBalance(BigDecimal xrpBalance) {
        this.xrpBalance = xrpBalance; // Yeni eklenen Ripple setter metodu (Ferhat)
    }

    public BigDecimal getDotBalance() {
        return dotBalance;
    }

    public void setDotBalance(BigDecimal dotBalance) {
        this.dotBalance = dotBalance; // Yeni eklenen Polkadot setter metodu (Ferhat)
    }

    public BigDecimal getAvaxBalance() {
        return avaxBalance;
    }

    public void setAvaxBalance(BigDecimal avaxBalance) {
        this.avaxBalance = avaxBalance; // Yeni eklenen Avalanche setter metodu (Ferhat)
    }

    public BigDecimal getLinkBalance() {
        return linkBalance;
    }

    public void setLinkBalance(BigDecimal linkBalance) {
        this.linkBalance = linkBalance; // Yeni eklenen Chainlink setter metodu (Ferhat)
    }

    public BigDecimal getShibBalance() {
        return shibBalance;
    }

    public void setShibBalance(BigDecimal shibBalance) {
        this.shibBalance = shibBalance; // Yeni eklenen Shiba Inu setter metodu (Ferhat)
    }
}