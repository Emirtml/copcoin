package com.i2i.cryptopal.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Projedeki tüm runtime hataları merkezi olarak yakkalamak için
public class GlobalExceptionHandler {

    // Kullanıcı adı çakışması gibi mantıksal hataları yakalar (IllegalArgumentException)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    // @Valid kontrolünden geçemeyen boş kullanıcı adı, kısa şifre vb. istek hatalarını yakalaası için
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put("error", error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }
}
