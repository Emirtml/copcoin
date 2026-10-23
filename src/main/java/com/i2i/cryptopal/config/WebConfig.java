package com.i2i.cryptopal.config;

import com.i2i.cryptopal.security.SecurityInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Ferhat"GELECEĞE YATIRIM
// Global CORS Yapılandırması"). CorsConfig.java'daki merkezi CorsFilter bean'i ile
// cakisip tarayicida CORS hatasi verdigi icin bu metot kaldirildi (Ege)
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final SecurityInterceptor securityInterceptor;

    public WebConfig(SecurityInterceptor securityInterceptor) {
        this.securityInterceptor = securityInterceptor;
    }

    // Interceptor Kayıt Alanı: Turnikeyi kapılara bağlıyoruz.
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(securityInterceptor)
                // Al-sat, cüzdan ve yapay zeka işlemlerinin geçtiği tüm yolları zırhladık
                // bu kısma sonradan yapay zeka api ucunu da ekledim ( Ferhat)
                .addPathPatterns(
                        "/api/trade/**",
                        "/api/wallet/**",
                        "/api/ai/**",
                        "/api/auth/change-password", // sifre degistirme ucu da token istiyor (Ege)
                        "/api/auth/delete-account" // hesap silme ucu da token istiyor (Ege)
                )
                // Giriş, kayıt ve Swagger sayfalarını bu kontrolden muaf tutuyoruz
                .excludePathPatterns(
                        "/api/auth/login",
                        "/api/auth/register",
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-resources/**",
                        "/webjars/**"
                );
    }
}