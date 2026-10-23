package com.i2i.cryptopal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Hesap panelindeki "Sifre Degistir" formundan gelen istegi tasir - eski sifre + yeni sifre (Ege)
@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Mevcut şifre boş olamaz")
    private String currentPassword;

    @NotBlank(message = "Yeni şifre boş olamaz")
    @Size(min = 6, max = 100, message = "Yeni şifre en az 6 karakter olmalıdır")
    private String newPassword;
}