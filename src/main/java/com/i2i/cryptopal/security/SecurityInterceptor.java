package com.i2i.cryptopal.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
public class SecurityInterceptor implements HandlerInterceptor {

    private final StringRedisTemplate redisTemplate;

    // Bağımlılık Enjeksiyonu: Redis şablonunu constructor üzerinden içeri alıyoruz.
    public SecurityInterceptor(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        //GELECEKTEKİ CORS HATALARI İÇİN ÖNLEM Tarasyıcının attığı OPTIONS isteklerini turnikeden direkt geçiriyoruz.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true; 
        }

        String token = null;

// 1. Önce HttpOnly Çerezinden (Cookie) token'ı aramayı dene
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // 2. Eğer çerezde bulunamazsa (Swagger vb. için) Authorization başlığına (Header) bak
        if (token == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.toLowerCase().startsWith("bearer ")) {
                token = authHeader.substring(7).trim();
            }
        }

        // 3. Güvenlik Kontrolü: Token bulunamadıysa yetkisiz erişim dönüyoruz.
        if (token == null) {
            return sendUnAuthorizedResponse(response, "Yetkisiz erişim! Oturum token'ı bulunamadı, lütfen giriş yapın.");
        }

        // 4. Redis Kontrolü: Bu token'a karşılık gelen aktif bir kullanıcı ID'si var mı?
        String userIdStr = redisTemplate.opsForValue().get("session:" + token);

        if (userIdStr == null) {
            return sendUnAuthorizedResponse(response, "Oturum süreniz dolmuş veya geçersiz token! Lütfen tekrar giriş yapın.");
        }

        // 5. SENKRONİZASYON HAMLESİ: Controller katmanında rahatça kıyaslama yapabilmek için,
        // Redis'ten gelen String ID'yi Long tipine güvenle çevirip isteğin içine (attribute) gömüyoruz.
        request.setAttribute("authenticatedUserId", Long.valueOf(userIdStr));

        return true; // Turnike açıldı, istek güvenle geçebilir.
    }

    /**
     * Frontend tarafında Ege'nin doğrudan yakalayıp ekrana basabileceği Türkçe ve kurumsal hata yapısı.
     */
    private boolean sendUnAuthorizedResponse(HttpServletResponse response, String turkceMesaj) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // HTTP 401 Durum Kodu
        
        String jsonResponseBody = String.format(
                "{\"status\": 401, \"error\": \"Unauthorized\", \"message\": \"%s\"}", 
                turkceMesaj
        );
        
        response.getWriter().write(jsonResponseBody);
        return false; // İstek burada bıçak  gibi kesilir :), Controller'a gidemez.
    }
}