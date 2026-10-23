package com.i2i.cryptopal.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity   // JPA kütüphanesine bu sınıfın veritabanında bir tabloya denk geldiğini ve eşleştirmesi gerektiğini sözyler
@Table(name = "users")  // spring boot un tablonun adını varsayın olarak usser yapmaması için
@Getter   // Lombok kütüphanesinin otomatik olarak bizim yerimize getter ve settter ı oluşturmasını sağlıyor
@Setter
@NoArgsConstructor // bu ve @AllArgsConstructor bizim için construtorları otomatik üretmemize sağlar spring booot veri tabanından veri çekerken boş constrctr a ihtyacımız olacak
@AllArgsConstructor
@Builder
public class User {

    @Id   // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ıd nin BIGSERIAl tarafından veri tabanı düzeyind eoluşturalucağını söyler
    private Long id;


    //veri tabanı sütün özellikleri bağlama
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance;   // para kaybını engellemek için BigDeciimal kullandım
}
