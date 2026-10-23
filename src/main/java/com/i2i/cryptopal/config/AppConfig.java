package com.i2i.cryptopal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration   //yapılandırma olan bu sınıfın sipringe tanımllanacak yeni nesneler yani beanlar var diyoruz
public class AppConfig {

    @Bean  // metottan dönen nesneyi hafızada saklamayı ve itiyaç olunnduğunda bize vermeyi sağlar (otomatik)
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();   // şifreyi hashlemek için BCrypt ı kullanan sınıfı oluşturma
    }
}
