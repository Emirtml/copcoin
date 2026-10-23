package com.i2i.cryptopal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // 1. BU IMPORT'U EKLEDİK

@SpringBootApplication
@EnableScheduling // 2. BU ETİKETİ EKLEDİK: Arka plandaki zamanlanmış görevleri tetikler -- simüle fiyat trendlerini oluşturmak için kullanacağız
public class CryptopalApplication {
    public static void main(String[] args) {
        SpringApplication.run(CryptopalApplication.class, args);
    }
}
