package com.i2i.cryptopal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RegisterResponse {

    // Frontend'e veritabanı ID'sini, kullanıcı adını, atanan bakiyeyi ve başarı mesajını dönüyoruz
    private Long id;
    private String username;
    private BigDecimal balance;
    private String message;
}
