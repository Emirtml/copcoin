# CryptoPal (CopCoin) - API Sözleşmesi

*  CryptoPal 
*  Ferhat Sevdalı 
*  Ilk Taslak
*  15.07.2026

bu dosya ortak veri iletim standartlarını (API Sözleşmesi) içerir. Ekip olarak geliştirmeyi bu kurallara göre yürüteceğiz.

---

## 1. KULLANICI VE YETKİLENDİRME (AUTH) MODÜLÜ

### 1.1. Kullanıcı Kaydı (Register)
Kullanıcının sisteme ilk kaydını yapar. Başarılı kayıtta veritabanında kullanıcı oluşturulur ve rastgele bir bakiye tanımlanır.

*   **Endpoint:** `POST /api/auth/register`
*   **Request Headers:** `Content-Type: application/json`
*   **Request Body (İstek):**
    ```json
    {
      "username": "ibo",
      "password": "mySecurePassword123"
    }
    ```
*   **Response Body (Başarılı - 201 Created):**
    ```json
    {
      "id": 1,
      "username": "ibo",
      "balance": 15420.50,
      "message": "Kullanıcı başarıyla kaydedildi. Başlangıç bakiyesi tanımlandı."
    }
    ```
*   **Response Body (Hata - 400 Bad Request veya 499 Conflict):**
    ```json
    {
      "error": "Bu kullanıcı adı zaten alınmış!"
    }
    ```

---

### 1.2. Kullanıcı Girişi (Login)
user kimliğini doğrular Başarılı girişte bir oturum tokenı üretilir ve Redise kaydedilir

*   **Endpoint:** `POST /api/auth/login`
*   **Request Headers:** `Content-Type: application/json`
*   **Request Body (İstek):**
    ```json
    {
      "username": "ibo",
      "password": "mySecurePassword123"
    }
    ```
*   **Response Body (Başarılı - 200 OK):**
    ```json
    {
      "token": "session-uuid-token-string",
      "username": "ibo",
      "balance": 15420.50,
      "message": "Giriş başarılı. Oturum Redis üzerinde başlatıldı."
    }
    ```
*   **Response Body (Hata - 401 Unauthorized):**
    ```json
    {
      "error": "Kullanıcı adı veya şifre hatalı!"
    }
    ```

---

## 2. PİYASA VERİLERİ  MODÜLÜ

### 2.1. Anlık Fiyatları Listeleme
Piyasadaki desteklenen tüm kripto paraların mesela  BTC, ETH gibi  en güncel fiyatlarını çeker Bu veriler doğrudan Redisten okunur

*   **Endpoint:** `GET /api/market/prices`
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Response Body (Başarılı - 200 OK):**
    ```json
    [
      {
        "assetName": "BTC",
        "price": 62500.00,
        "updatedAt": "2026-07-15T00:32:00Z"
      },
      {
        "assetName": "ETH",
        "price": 3450.00,
        "updatedAt": "2026-07-15T00:32:00Z"
      }
    ]
    ```

---

## 3. ALIM / SATIM VE PORTFÖY (TRADE & PORTFOLIO) MODÜLÜ

### 3.1. Alış veya Satış Emri Gönderme
Kullanıcının al/sat isteklerini gerçekleştirir ACID kurallarına göre çalışır, mesela bakiye yetersizse işlem iptal edilir

*   **Endpoint:** `POST /api/trade/order`
*   **Request Headers:** 
    *   `Authorization: Bearer <token>`
    *   `Content-Type: application/json`
*   **Request Body (İstek):**
    ```json
    {
      "orderType": "BUY", 
      "assetName": "BTC",
      "amount": 0.05
    }
    ```
*   **Response Body (Başarılı - 200 OK):**
    ```json
    {
      "transactionId": 120,
      "orderType": "BUY",
      "assetName": "BTC",
      "amount": 0.05,
      "price": 62500.00,
      "totalCost": 3125.00,
      "newCashBalance": 12295.50,
      "newAssetAmount": 0.05,
      "message": "İşlem başarıyla gerçekleştirildi."
    }
    ```
*   **Response Body (Hata - 400 Bad Request):**
    ```json
    {
      "error": "Yetersiz nakit bakiye!" 
    }
    ```

---

### 3.2. Kullanıcı Portföyünü Getirme
Kullanıcının nakit bakiyesini ve sahip olduğu tüm kripto varlıkları listeler

*   **Endpoint:** `GET /api/portfolio`
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Response Body (Başarılı - 200 OK):**
    ```json
    {
      "username": "ibo",
      "cashBalance": 12295.50,
      "assets": [
        {
          "assetName": "BTC",
          "amount": 0.05,
          "currentValue": 3125.00
        },
        {
          "assetName": "ETH",
          "amount": 0.00,
          "currentValue": 0.00
        }
      ]
    }
    ```

---

## 4. YAPAY ZEKA (LLM) MODÜLÜ ( daha bu kısma girişmedik ama bu kısımda burada dursun bakalım )

### 4.1. Yapay Zekaya Soru Sorma (Gemini)
Userın portföyü, işlem geçmişi ve fiyat trendleriyle zenginleştirilmiş bağlamı Google Geminiye gönderir ve cevabı döner

*   **Endpoint:** `POST /api/ai/query`
*   **Request Headers:** 
    *   `Authorization: Bearer <token>`
    *   `Content-Type: application/json`
*   **Request Body (İstek):**
    ```json
    {
      "query": "Portföyümün gidişatı nedir, BTC trendine göre alım yapmalı mıyım?"
    }
    ```
*   **Response Body (Başarılı - 200 OK):**
    ```json
    {
      "response": "Merhaba ibo, portföyünde 0.05 BTC  ve 12,295.50 USD nakit bulunuyor. Son 1 saatte BTC fiyat trendi yukarı yönlü hareket ediyor. Nakit rezervini koruyarak küçük alımlarla portföyünü çeşitlendirebilirsin.",
      "queryTimestamp": "2026-07-15T00:33:00Z"
    }
    ```
*   **Response Body (Hata - 503 Service Unavailable):**
    ```json
    {
      "error": "Yapay zeka servisi şu anda yanıt vermiyor. Lütfen daha sonra tekrar deneyiniz."
    }
    ```
