package com.i2i.cryptopal.dto;

// validation ın kullanıcı adı veya sifre girdilerii yanlış girildiğinde otomatih hata üreten @notblank ve @size
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    // Kullanıcı adının boş bırakılmamasını ve sınırlarını kontrol ettırıyoruz
    @NotBlank(message = "Kullanıcı adı boş olamaz")
    @Size(min = 3, max = 50, message = "Kullanıcı adı 3 ila 50 karakter arasında olmalıdır")
    private String username;

    // Şifrenin boş olmamasını ve güvenli bir uzunlukta olmasını zorunlu kılıyoruz
    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 6, max = 100, message = "Şifre en az 6 karakter olmalıdır")
    private String password;
}
