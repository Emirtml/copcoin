package com.i2i.cryptopal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


// yapay zekaya  bir soru gönderildiğinde gelen json verisini
//spring boot un anlayacağğı bir java nesnesine dönderiyoruz 

@Data
public class AIQueryRequest {

    @NotBlank(message = "Soru boş bırakılamaz")
    private String question;
}
