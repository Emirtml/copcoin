package com.i2i.cryptopal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// giriş verilerini karşılayan sınıfımız (Ferhat)

@Data  // getter setter metotları iiçin lombok
public class LoginRequest {

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    private String username;

    @NotBlank(message = "Şifre boş olamaz")
    private String password;
}
