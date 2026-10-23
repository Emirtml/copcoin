-- ====================================================================
-- SENARYO 1, 4 & 5 İÇİN: Alım Yapabilen Zengin Kullanıcı (Kripto Bakiyesi 0)
-- ====================================================================
INSERT INTO users (id, username, password, balance) 
VALUES (1, 'emir_alici', 'pass123', 10000.00) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_wallets (id, user_id, usdt_balance, btc_balance, eth_balance, sol_balance, doge_balance, ada_balance, xrp_balance, dot_balance, avax_balance, link_balance, shib_balance) 
VALUES (1, 1, 10000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00) 
ON CONFLICT (id) DO NOTHING;


-- ====================================================================
-- SENARYO 2 İÇİN: Hazırda Kriptosu Olan Satıcı Kullanıcı
-- ====================================================================
INSERT INTO users (id, username, password, balance) 
VALUES (2, 'ferhat_satici', 'pass123', 0.00) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_wallets (id, user_id, usdt_balance, btc_balance, eth_balance, sol_balance, doge_balance, ada_balance, xrp_balance, dot_balance, avax_balance, link_balance, shib_balance) 
VALUES (2, 2, 0.00, 2.50, 10.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00) 
ON CONFLICT (id) DO NOTHING;


-- ====================================================================
-- SENARYO 3 İÇİN: Bakiyesi Tamamen Sıfır Olan Kullanıcı
-- ====================================================================
INSERT INTO users (id, username, password, balance) 
VALUES (3, 'bakiye_yok', 'pass123', 0.00) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_wallets (id, user_id, usdt_balance, btc_balance, eth_balance, sol_balance, doge_balance, ada_balance, xrp_balance, dot_balance, avax_balance, link_balance, shib_balance) 
VALUES (3, 3, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00) 
ON CONFLICT (id) DO NOTHING;


-- ====================================================================
-- 🚀 SWAGGER TEST İSTEKLERİ (Kopyala-Yapıştır Test Etmek İçin Örnek JSON'lar)
-- ====================================================================
--
-- 🔹 SENARYO 1: Başarılı Alım (BUY) Testi (Beklenen: 200 OK)
-- {
--   "userId": 1,
--   "action": "BUY",
--   "coinSymbol": "BTC",
--   "amount": 0.05
-- }
--
-- 🔹 SENARYO 2: Başarılı Satım (SELL) Testi (Beklenen: 200 OK)
-- {
--   "userId": 2,
--   "action": "SELL",
--   "coinSymbol": "BTC",
--   "amount": 0.5
-- }
--
-- 🔹 SENARYO 3: Yetersiz Nakit (USDT) İle Alım Engeli Testi (Beklenen: 500 - Yetersiz Bakiye)
-- {
--   "userId": 3,
--   "action": "BUY",
--   "coinSymbol": "BTC",
--   "amount": 0.01
-- }
--
-- 🔹 SENARYO 4: Yetersiz Kripto İle Satım Engeli Testi (Beklenen: 500 - Yetersiz Coin Bakiyesi)
-- {
--   "userId": 1,
--   "action": "SELL",
--   "coinSymbol": "BTC",
--   "amount": 0.1
-- }
--
-- 🔹 SENARYO 5: Sistemde Olmayan Geçersiz Kripto Testi (Beklenen: 500 - Redis/Fiyat Bulunamadı)
-- {
--   "userId": 1,
--   "action": "BUY",
--   "coinSymbol": "XRP",
--   "amount": 10
-- }

-- ====================================================================
-- Otomatik Artan ID (Sequence) Senkronizasyonu (Ferhat)
-- Manuel eklenen verilerin (1, 2, 3) yeni kayıtlarla çakışmasını önlemek için 
-- tablo sıra sayaçlarını en yüksek değere güncelliyoruz.
-- ====================================================================
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('user_wallets_id_seq', (SELECT MAX(id) FROM user_wallets));