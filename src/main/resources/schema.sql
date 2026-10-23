-- schema.sql

-- 1. Kullanıcılar Tablosu (Giriş bilgileri ve Nakit Bakiye)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    balance NUMERIC(18, 2) NOT NULL DEFAULT 0.00
);

-- 2. Kullanıcı Cüzdanları (Model yapısıyla uyumlu hale getirildi)
CREATE TABLE IF NOT EXISTS user_wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    usdt_balance NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    btc_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000,
    eth_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000,
    sol_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000,  -- Yeni eklenen Solana bakiyesi (Ferhat)
    doge_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000, -- Yeni eklenen Dogecoin bakiyesi (Ferhat)
    ada_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000,  -- Yeni eklenen Cardano bakiyesi (Ferhat)
    xrp_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000,  -- Yeni eklenen Ripple bakiyesi (Ferhat)
    dot_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000,  -- Yeni eklenen Polkadot bakiyesi (Ferhat)
    avax_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000, -- Yeni eklenen Avalanche bakiyesi (Ferhat)
    link_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000, -- Yeni eklenen Chainlink bakiyesi (Ferhat)
    shib_balance NUMERIC(18, 8) NOT NULL DEFAULT 0.00000000, -- Yeni eklenen Shiba Inu bakiyesi (Ferhat)
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. İşlem Geçmişi (Alım/Satım Logları)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    transaction_type VARCHAR(10) NOT NULL,
    asset_name VARCHAR(10) NOT NULL,
    amount NUMERIC(18, 8) NOT NULL,
    price NUMERIC(18, 2) NOT NULL,
    total_cost NUMERIC(18, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Piyasa Fiyat Geçmişi (Trend Analizi İçin)
CREATE TABLE IF NOT EXISTS price_trends (
    id BIGSERIAL PRIMARY KEY,
    asset_name VARCHAR(10) NOT NULL,
    price NUMERIC(18, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
