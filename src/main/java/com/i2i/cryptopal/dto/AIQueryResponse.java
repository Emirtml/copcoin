package com.i2i.cryptopal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


// geminiden aldığımız yanıtı arayüze düzgün bir json pakaeti olarak veriyoruz
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIQueryResponse {

    private String answer;
}
