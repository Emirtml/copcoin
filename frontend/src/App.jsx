import React, { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "https://cryptopal-backend.onrender.com";

// oturum suresi dolunca (401) tum uygulamayi tek noktadan cikis ekranina atmak icin
let sessionExpiredHandler = null;

async function apiFetch(url, options = {}) {
  options.credentials = "include"; // cookie'leri otomatik gönder
  const res = await fetch(url, options);
  if (res.status === 401 && sessionExpiredHandler) {
    sessionExpiredHandler();
  }
  return res;
}

const COLORS = {
  bg: "var(--color-bg)",
  sidebar: "var(--color-sidebar)",
  card: "var(--color-card)",
  cardBorder: "var(--color-card-border)",
  cardBorderHover: "var(--color-card-border-hover)",
  inputBg: "var(--color-input-bg)",
  inputBorder: "var(--color-input-border)",
  textMain: "var(--color-text-main)",
  textMuted: "var(--color-text-muted)",
  yellow: "#fdc700",
  yellowHover: "#e8b700",
  errorBg: "var(--color-error-bg)",
  errorBorder: "var(--color-error-border)",
  errorText: "var(--color-error-text)",
  successBg: "var(--color-success-bg)",
  successBorder: "var(--color-success-border)",
  successText: "var(--color-success-text)",
};

const pageBg = {
  background: "var(--color-page-bg)",
};

const TRANSLATIONS = {
  TR: {
    home: "Ana Sayfa",
    portfolio: "Portföyüm",
    history: "İşlem Geçmişi",
    logout: "Çıkış Yap",
    marketTitle: "Piyasa",
    marketDesc: "Kriptoların canlı fiyatlarını takip et, incele ve işlem yap.",
    portfolioTitle: "Portföyüm",
    portfolioDesc: "Nakit bakiyen ve sahip olduğun varlıklar.",
    historyTitle: "İşlem Geçmişi",
    historyDesc: "Bugüne kadar gerçekleştirdiğin tüm al/sat işlemleri.",
    searchPlaceholder: "Kripto veya işlem ara...",
    inspect: "İncele",
    back: "Piyasaya dön",
    buy: "Satın Al",
    sell: "Sat",
    dollar: "Dolar (USD)",
    amount: "Miktar",
    totalValue: "Toplam Portföy Değeri (USDT + Kriptolar)",
    cash: "USDT (Nakit)",
    changePass: "Şifre Değiştir",
    deleteAcc: "Hesap Sil",
    aiWidgetTitle: "CopCoin Yapay Zeka Danışmanı",
    aiPlaceholder: "Piyasa hakkında bir soru sor...",
    aiSend: "Gönder",
    loading: "Yükleniyor...",
    noTransactions: "Henüz bir işlem yapmadın. Piyasa sayfasından bir coin seçip al/sat yapabilirsin.",
    price: "Fiyat",
    priceChart: "Fiyat Grafiği",
    action: "İşlem",
    asset: "Varlık",
    total: "Toplam",
    date: "Tarih",
    welcome: "Hoş Geldiniz",
    welcomeDesc: "İşlemlerinize devam etmek için lütfen giriş yapınız",
    joinUs: "Aramıza Katıl",
    joinUsDesc: "Hesabını oluştur, sana özel başlangıç bakiyesiyle işlem yapmaya başla",
    usernameLabel: "Kullanıcı Adı",
    usernamePlaceholder: "Kullanıcı adınız",
    passwordLabel: "Şifre",
    passwordPlaceholder: "••••••••••••••••",
    logIn: "Giriş Yap",
    register: "Kayıt Ol",
    loggingIn: "Giriş yapılıyor...",
    registering: "Kayıt oluşturuluyor...",
    noAccount: "Hesabın yok mu?",
    haveAccount: "Zaten hesabın var mı?",
    authExpiredNotice: "Oturumun süresi doldu, güvenlik için tekrar giriş yapman gerekiyor.",
    serverError: "Sunucuya ulaşılamadı. Lütfen backend servisinin çalıştığından emin olun.",
    accountSettings: "Hesap Ayarları",
    accountInfoTab: "Hesap Bilgileri",
    changePasswordTab: "Şifre Değiştir",
    deleteAccountTab: "Hesap Silme",
    currentPasswordLabel: "Mevcut Şifre",
    newPasswordLabel: "Yeni Şifre",
    confirmPasswordLabel: "Yeni Şifre (Tekrar)",
    minCharPlaceholder: "En az 6 karakter",
    updatePasswordBtn: "Şifreyi Güncelle",
    deletePermanently: "Hesabı kalıcı olarak sil",
    deleteAccNotice: "Bu işlem geri alınamaz. Cüzdanın, işlem geçmişin ve hesap bilgilerin tamamen silinir.",
    deleteAccBtn: "Hesabımı Sil",
    cancelBtn: "Vazgeç",
    yesDeleteBtn: "Evet, Sil",
  },
  EN: {
    home: "Home",
    portfolio: "Portfolio",
    history: "Transaction History",
    logout: "Log Out",
    marketTitle: "Market",
    marketDesc: "Track live cryptocurrency prices, analyze, and trade.",
    portfolioTitle: "Portfolio",
    portfolioDesc: "Your cash balance and owned assets.",
    historyTitle: "Transaction History",
    historyDesc: "A record of all your past buy and sell trades.",
    searchPlaceholder: "Search crypto or transaction...",
    inspect: "Inspect",
    back: "Back to Market",
    buy: "Buy",
    sell: "Sell",
    dollar: "Dollar (USD)",
    amount: "Amount",
    totalValue: "Total Portfolio Value (USDT + Cryptos)",
    cash: "USDT (Cash)",
    changePass: "Change Password",
    deleteAcc: "Delete Account",
    aiWidgetTitle: "CopCoin AI Advisor",
    aiPlaceholder: "Ask a question about the market...",
    aiSend: "Send",
    loading: "Loading...",
    noTransactions: "You have no transactions yet. Select a coin from Market and trade.",
    price: "Price",
    priceChart: "Price Chart",
    action: "Action",
    asset: "Asset",
    total: "Total",
    date: "Date",
    welcome: "Welcome",
    welcomeDesc: "Please log in to continue your trades",
    joinUs: "Join Us",
    joinUsDesc: "Create your account and start trading with your welcome balance",
    usernameLabel: "Username",
    usernamePlaceholder: "Your username",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••••••••••",
    logIn: "Log In",
    register: "Register",
    loggingIn: "Logging in...",
    registering: "Registering...",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    authExpiredNotice: "Your session has expired. Please log in again for security.",
    serverError: "Cannot reach server. Please make sure backend is running.",
    accountSettings: "Account Settings",
    accountInfoTab: "Account Info",
    changePasswordTab: "Change Password",
    deleteAccountTab: "Delete Account",
    currentPasswordLabel: "Current Password",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    minCharPlaceholder: "At least 6 characters",
    updatePasswordBtn: "Update Password",
    deletePermanently: "Permanently delete account",
    deleteAccNotice: "This action cannot be undone. Your wallet, transaction history, and account details will be permanently deleted.",
    deleteAccBtn: "Delete My Account",
    cancelBtn: "Cancel",
    yesDeleteBtn: "Yes, Delete",
  }
};

const t = (key, lang) => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["TR"]?.[key] || key;
};

const COINS = [
  { symbol: "BTC", name: "Bitcoin", badgeBg: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", badgeBg: "#8a92b2" },
  { symbol: "SOL", name: "Solana", badgeBg: "#800080" },
  { symbol: "DOGE", name: "Dogecoin", badgeBg: "#c2a633" },
  { symbol: "ADA", name: "Cardano", badgeBg: "#0033ad" },
  { symbol: "XRP", name: "Ripple", badgeBg: "#23292f" },
  { symbol: "DOT", name: "Polkadot", badgeBg: "#e6007a" },
  { symbol: "AVAX", name: "Avalanche", badgeBg: "#e84142" },
  { symbol: "LINK", name: "Chainlink", badgeBg: "#2a5ada" },
  { symbol: "SHIB", name: "Shiba Inu", badgeBg: "#ffaa00" },
];

//SHARED UI 

function IconBadge({ size = 56, radius = 16 }) {
  return (
    <div
      className="flex items-center justify-center mx-auto shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${COLORS.yellow}, #e0ac00)`,
        borderRadius: radius,
        boxShadow: `0 6px 20px -6px rgba(253,199,0,0.45)`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" style={{ width: size * 0.46, height: size * 0.46 }}>
        <path d="M3 17L9 11L13 15L21 7" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7H21V13" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block rounded-full animate-spin"
      style={{ width: 14, height: 14, border: "2px solid rgba(20,20,20,0.3)", borderTopColor: "#141414" }}
    />
  );
}

function MessageBox({ text, type }) {
  if (!text) return null;
  const isError = type === "error";
  return (
    <div
      className="mt-3.5 rounded-xl px-3.5 py-3 text-sm text-center"
      style={{
        background: isError ? COLORS.errorBg : COLORS.successBg,
        border: `1px solid ${isError ? COLORS.errorBorder : COLORS.successBorder}`,
        color: isError ? COLORS.errorText : COLORS.successText,
      }}
    >
      {text}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-xs mb-2 font-medium" style={{ color: "#a3a3a3" }}>{label}</label>
      <input
        {...props}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
        style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
        onFocus={(e) => { e.target.style.borderColor = COLORS.yellow; e.target.style.background = "#161616"; }}
        onBlur={(e) => { e.target.style.borderColor = COLORS.inputBorder; e.target.style.background = COLORS.inputBg; }}
      />
    </div>
  );
}

function PrimaryButton({ children, loading, loadingText, ghost, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
      style={{
        background: ghost ? COLORS.inputBg : hover && !loading ? COLORS.yellowHover : COLORS.yellow,
        color: ghost ? COLORS.textMain : "#141414",
        border: ghost ? `1px solid ${hover ? COLORS.cardBorderHover : COLORS.inputBorder}` : "none",
        opacity: loading || props.disabled ? 0.6 : 1,
        cursor: loading || props.disabled ? "not-allowed" : "pointer",
      }}
    >
      {loading ? (<><Spinner /><span>{loadingText || "Lütfen bekleyin..."}</span></>) : children}
    </button>
  );
}

function fmtUsd(n) {
  const num = parseFloat(n);
  if (isNaN(num)) return "-";
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function AssetBadge({ label, bg, size = 28 }) {
  return (
    <span
      className="flex items-center justify-center rounded-lg font-bold shrink-0"
      style={{ width: size, height: size, background: bg, color: "#141414", fontSize: size * 0.4 }}
    >
      {label}
    </span>
  );
}

function Card({ title, className = "", children, right = null, height = null }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`rounded-[20px] p-6 transition-all ${className}`}
      style={{
        background: COLORS.card,
        border: `1px solid ${hover ? COLORS.cardBorderHover : COLORS.cardBorder}`,
        boxShadow: hover ? "0 20px 40px -24px rgba(0,0,0,0.7)" : "none",
        height: height || undefined,
        display: height ? "flex" : undefined,
        flexDirection: height ? "column" : undefined,
      }}
    >
      {title && (
        <div className="flex items-center justify-between mb-4.5 shrink-0">
          <h2 className="flex items-center gap-2 text-sm font-medium" style={{ color: COLORS.textMain }}>
            <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: COLORS.yellow, boxShadow: `0 0 8px ${COLORS.yellow}` }} />
            {title}
          </h2>
          {right}
        </div>
      )}
      <div style={height ? { flex: 1, minHeight: 0 } : {}}>
        {children}
      </div>
    </div>
  );
}

// AUTH SCREEN

function AuthScreen({ onAuthed, expiredNotice, lang, setLang, theme, setTheme }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    expiredNotice ? { text: t("authExpiredNotice", lang), type: "error" } : { text: "", type: "" }
  );

  const isLogin = mode === "login";

  const switchMode = (next) => {
    setMode(next);
    setMessage({ text: "", type: "" });
    setUsername("");
    setPassword("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || (isLogin ? (lang === "TR" ? "Giriş başarısız oldu!" : "Login failed!") : (lang === "TR" ? "Kayıt başarısız oldu!" : "Registration failed!")), type: "error" });
        return;
      }

      if (isLogin) {
        setMessage({ text: data.message || (lang === "TR" ? "Giriş başarılı!" : "Login successful!"), type: "success" });
        setTimeout(() => {
          onAuthed({ token: data.token, username: data.username, balance: data.balance, userId: data.id });
        }, 400);
      } else {
        setMessage({ text: data.message || (lang === "TR" ? "Kayıt başarılı! Şimdi giriş yapabilirsin." : "Registration successful! You can log in now."), type: "success" });
        setTimeout(() => {
          setMode("login");
          setMessage({ text: "", type: "" });
        }, 1000);
      }
    } catch (err) {
      setMessage({ text: t("serverError", lang), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={pageBg}>
      <div className="absolute top-6 right-6 flex gap-2">
        <button
          onClick={() => setLang(lang === "TR" ? "EN" : "TR")}
          className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.95]"
          style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
        >
          {lang === "TR" ? "EN" : "TR"}
        </button>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.95] flex items-center justify-center"
          style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
          aria-label={theme === "dark" ? "Açık tema" : "Koyu tema"}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 14, height: 14 }}>
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 14, height: 14 }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      <div
        className="w-full rounded-3xl px-8 pt-10 pb-8"
        style={{ maxWidth: 380, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)" }}
      >
        <div className="mb-5 flex items-center justify-center gap-2.5">
          <img src="/logo-symbol.png" alt="CopCoin" style={{ height: 48, width: "auto" }} />
          <span className="font-bold text-2xl tracking-tight" style={{ color: COLORS.yellow }}>CopCoin</span>
        </div>

        {isLogin ? (
          <>
            <h1 className="text-center font-bold text-2xl mb-1" style={{ color: COLORS.textMain, letterSpacing: "-0.02em" }}>{t("welcome", lang)}</h1>
            <p className="text-center text-sm mb-7 px-1.5" style={{ color: COLORS.textMuted, lineHeight: 1.5 }}>{t("welcomeDesc", lang)}</p>
          </>
        ) : (
          <>
            <h1 className="text-center font-bold text-2xl mb-1" style={{ color: COLORS.textMain, letterSpacing: "-0.02em" }}>{t("joinUs", lang)}</h1>
            <p className="text-center text-sm mb-7 px-1.5" style={{ color: COLORS.textMuted, lineHeight: 1.5 }}>{t("joinUsDesc", lang)}</p>
          </>
        )}

        <form onSubmit={submit}>
          <Field label={t("usernameLabel", lang)} type="text" placeholder={t("usernamePlaceholder", lang)} value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Field label={t("passwordLabel", lang)} type="password" placeholder={t("passwordPlaceholder", lang)} value={password} onChange={(e) => setPassword(e.target.value)} required />

          <PrimaryButton type="submit" loading={loading} loadingText={isLogin ? t("loggingIn", lang) : t("registering", lang)}>
            <span>{isLogin ? t("logIn", lang) : t("register", lang)}</span>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#141414" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </PrimaryButton>
        </form>

        <MessageBox text={message.text} type={message.type} />

        <p className="text-center text-sm mt-5" style={{ color: COLORS.textMuted }}>
          {isLogin ? (
            <>{t("noAccount", lang)}{" "}<a onClick={() => switchMode("register")} className="font-bold cursor-pointer hover:underline" style={{ color: COLORS.yellow }}>{t("register", lang)}</a></>
          ) : (
            <>{t("haveAccount", lang)}{" "}<a onClick={() => switchMode("login")} className="font-bold cursor-pointer hover:underline" style={{ color: COLORS.yellow }}>{t("logIn", lang)}</a></>
          )}
        </p>
      </div>
    </div>
  );
}

//yan bar

function NavIcon({ path, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: size, height: size }}>
      <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { key: "home", label: "Ana Sayfa", icon: "M3 11L12 4L21 11M5 10V20H19V10" },
  { key: "portfolio", label: "Portföy", icon: "M4 4H20V20H4V4ZM4 10H20M10 10V20" },
  { key: "history", label: "İşlem Geçmişi", icon: "M12 8V12L15 15M21 12A9 9 0 1 1 12 3" },
];

function Sidebar({ active, onNavigate, username, onLogout, onOpenAccount, lang }) {
  return (
    <div
      className="hidden md:flex flex-col shrink-0"
      style={{ width: 240, background: COLORS.sidebar, borderRight: `1px solid ${COLORS.cardBorder}`, height: "100vh" }}
    >
      <div className="flex items-center px-5 py-7">
        <img src="/logo-dark.png" alt="CopCoin" style={{ height: 46, width: "auto" }} />
      </div>

      <nav className="flex-1 px-3 mt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-150 active:scale-[0.97]"
              style={{
                background: isActive ? "rgba(253,199,0,0.1)" : "transparent",
                color: isActive ? COLORS.yellow : COLORS.textMuted,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <NavIcon path={item.icon} />
              {t(item.key, lang)}
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-5 pt-3" style={{ borderTop: `1px solid ${COLORS.cardBorder}` }}>
        <div className="flex items-center gap-2 px-2.5 py-1.5 mb-2 rounded-lg text-[10.5px] font-semibold" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", color: COLORS.successText }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLORS.successText, boxShadow: `0 0 8px ${COLORS.successText}`, animation: "copcoin-dot-pulse 1.5s ease-in-out infinite" }} />
          <span>{lang === "TR" ? "Canlı • Fiyatlar 15s'de bir güncelleniyor" : "Live • Prices sync every 15s"}</span>
        </div>

        <button
          onClick={onOpenAccount}
          className="w-full flex items-center gap-2.5 px-2 py-2 mb-2 rounded-xl transition-all duration-150 active:scale-[0.97]"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.inputBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <span
            className="flex items-center justify-center rounded-full font-bold text-xs shrink-0"
            style={{ width: 32, height: 32, background: COLORS.yellow, color: "#141414" }}
          >
            {username?.[0]?.toUpperCase() || "?"}
          </span>
          <span className="text-[13.5px] font-semibold truncate flex-1 text-left" style={{ color: COLORS.textMain }}>{username}</span>
          <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14, color: COLORS.textMuted }}>
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={onLogout}
          className="w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-150 active:scale-[0.97]"
          style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.inputBorder; }}
        >
          {t("logout", lang)}
        </button>
      </div>
    </div>
  );
}

function MobileNav({ active, onNavigate, lang }) {
  return (
    <div
      className="flex md:hidden overflow-x-auto gap-2 px-4 py-3 mb-2"
      style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-transform duration-150 active:scale-[0.95]"
            style={{ background: isActive ? "rgba(253,199,0,0.1)" : COLORS.inputBg, color: isActive ? COLORS.yellow : COLORS.textMuted }}
          >
            <NavIcon path={item.icon} size={14} />
            {t(item.key, lang)}
          </button>
        );
      })}
    </div>
  );
}

function MiniSparkline({ points, color }) {
  if (!points || points.length < 2) {
    return <div style={{ width: 90, height: 32 }} />;
  }
  const prices = points.map((p) => parseFloat(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 90, h = 32;
  const step = w / (prices.length - 1);
  const path = prices
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - ((p - min) / range) * h).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ana ekran

function HomeView({ prices, lastPrices, history, onInspect, coins = COINS, lang }) {
  function priceChange(sym) {
    const last = lastPrices[sym];
    const current = prices[sym];
    if (!last || !current) return null;
    const diff = current - last;
    if (diff === 0) return null;
    const pct = ((diff / last) * 100).toFixed(2);
    return { up: diff > 0, text: (diff > 0 ? "▲ +" : "▼ ") + pct + "%" };
  }

  return (
    <div className="max-w-[1150px] w-full mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textMain, letterSpacing: "-0.02em" }}>{t("marketTitle", lang)}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>{t("marketDesc", lang)}</p>

      {/* Sabit yükseklik ve içeride kaydırma alanı düzeltildi */}
      <Card height={540}>
        <div className="overflow-y-auto overflow-x-hidden h-full -mr-5 pr-3 max-h-[440px]">
          {coins.map((coin, i) => {
            const change = priceChange(coin.symbol);
            return (
              <div
                key={coin.symbol}
                onClick={() => onInspect(coin.symbol)}
                className="flex items-center justify-between py-4 px-2 -mx-2 gap-4 flex-wrap rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.99]"
                style={{ borderBottom: i < coins.length - 1 ? `1px solid ${COLORS.cardBorder}` : "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div className="flex items-center gap-3 shrink-0" style={{ minWidth: 150 }}>
                  <AssetBadge label={coin.symbol[0]} bg={coin.badgeBg} size={36} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: COLORS.textMain }}>{coin.name}</div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>{coin.symbol}/USDT</div>
                  </div>
                </div>

                <div className="hidden sm:block shrink-0">
                  <MiniSparkline points={history[coin.symbol]} color={change ? (change.up ? COLORS.successText : COLORS.errorText) : COLORS.yellow} />
                </div>

                <div className="text-right shrink-0" style={{ minWidth: 100 }}>
                  <div className="font-bold text-sm" style={{ color: COLORS.textMain }}>{fmtUsd(prices[coin.symbol])}</div>
                  {change && (
                    <div className="text-xs" style={{ color: change.up ? COLORS.successText : COLORS.errorText }}>{change.text}</div>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onInspect(coin.symbol); }}
                  className="rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all duration-150 active:scale-[0.95] shrink-0"
                  style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.yellow; e.currentTarget.style.color = COLORS.yellow; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.inputBorder; e.currentTarget.style.color = COLORS.textMain; }}
                >
                  {t("inspect", lang)}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function LineChart({ points, mainSymbol, compareList = [], compareData = {}, lang }) {
  const [highlightedSymbol, setHighlightedSymbol] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!points || points.length < 2) {
    return (
      <div className="flex items-center justify-center" style={{ height: 220, color: COLORS.textMuted, fontSize: 13 }}>
        {lang === "TR" ? "Grafik verisi yükleniyor..." : "Loading chart data..."}
      </div>
    );
  }

  const formatTime = (isoStr) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch (e) {
      return "";
    }
  };

  const mainPrices = points.map((p) => parseFloat(p.price));
  const w = 700, h = 200, pad = 12;
  const step = (w - pad * 2) / (mainPrices.length - 1);

  if (!compareList || compareList.length === 0) {
    const min = Math.min(...mainPrices);
    const max = Math.max(...mainPrices);
    const range = max - min || 1;
    const coords = mainPrices.map((p, i) => [pad + i * step, h - pad - ((p - min) / range) * (h - pad * 2)]);
    const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const areaPath = `${linePath} L ${coords[coords.length - 1][0].toFixed(1)} ${h} L ${coords[0][0].toFixed(1)} ${h} Z`;
    const up = mainPrices[mainPrices.length - 1] >= mainPrices[0];
    const lineColor = up ? COLORS.successText : COLORS.errorText;

    const tooltipTop = hoveredPoint && (hoveredPoint.y < 65 ? hoveredPoint.y + 15 : hoveredPoint.y - 65);

    return (
      <div className="flex flex-col gap-3" style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 220 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartFadeSingle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chartFadeSingle)" stroke="none" />
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {coords.map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx.toFixed(1)}
              cy={cy.toFixed(1)}
              r="6"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint({
                symbol: mainSymbol,
                price: mainPrices[idx],
                time: formatTime(points[idx]?.createdAt),
                x: cx,
                y: cy,
                color: lineColor
              })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        <div className="flex justify-between items-center text-[10px] px-2.5 mt-0.5" style={{ color: COLORS.textMuted }}>
          <span>{formatTime(points[0]?.createdAt)}</span>
          <span>{formatTime(points[Math.floor(points.length / 2)]?.createdAt)}</span>
          <span>{formatTime(points[points.length - 1]?.createdAt)}</span>
        </div>

        {hoveredPoint && (
          <div
            className="absolute pointer-events-none rounded-xl p-2.5 text-[11px] border"
            style={{
              left: `${(hoveredPoint.x / w) * 100}%`,
              top: `${tooltipTop}px`,
              transform: "translateX(-50%)",
              background: COLORS.card,
              borderColor: COLORS.cardBorder,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
              color: COLORS.textMain,
              zIndex: 50
            }}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: hoveredPoint.color }} />
              <span>{hoveredPoint.symbol}</span>
            </div>
            <div className="font-semibold text-xs">{fmtUsd(hoveredPoint.price)}</div>
            <div className="text-[9.5px] mt-1" style={{ color: COLORS.textMuted }}>
              {hoveredPoint.time}
            </div>
          </div>
        )}
      </div>
    );
  }

  const firstMainPrice = mainPrices[0] || 1;
  const mainPcts = mainPrices.map((p) => ((p - firstMainPrice) / firstMainPrice) * 100);

  const seriesData = [
    {
      symbol: mainSymbol,
      pcts: mainPcts,
      color: COINS.find((c) => c.symbol === mainSymbol)?.badgeBg || COLORS.yellow
    }
  ];

  compareList.forEach((sym) => {
    const compPts = compareData[sym];
    if (compPts && compPts.length >= 2) {
      const compPrices = compPts.map((p) => parseFloat(p.price));
      const firstCompPrice = compPrices[0] || 1;
      const compPcts = compPrices.map((p) => ((p - firstCompPrice) / firstCompPrice) * 100);
      seriesData.push({
        symbol: sym,
        pcts: compPcts,
        color: COINS.find((c) => c.symbol === sym)?.badgeBg || "#ffffff"
      });
    }
  });

  const allPcts = seriesData.map(s => s.pcts).flat();
  const minPct = Math.min(...allPcts);
  const maxPct = Math.max(...allPcts);
  const rangePct = maxPct - minPct || 1;

  const tooltipTop = hoveredPoint && (hoveredPoint.y < 65 ? hoveredPoint.y + 15 : hoveredPoint.y - 65);

  return (
    <div className="flex flex-col gap-3" style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 220 }} preserveAspectRatio="none">
        {minPct < 0 && maxPct > 0 && (() => {
          const zeroY = h - pad - ((0 - minPct) / rangePct) * (h - pad * 2);
          return (
            <line
              x1="0"
              y1={zeroY.toFixed(1)}
              x2={w}
              y2={zeroY.toFixed(1)}
              stroke={COLORS.cardBorder}
              strokeDasharray="4,4"
              strokeWidth="1.2"
            />
          );
        })()}

        {seriesData.map((series) => {
          const coords = series.pcts.map((pct, i) => [
            pad + i * step,
            h - pad - ((pct - minPct) / rangePct) * (h - pad * 2)
          ]);
          const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
          
          const isHighlighted = highlightedSymbol === series.symbol;
          const isAnyHighlighted = highlightedSymbol !== null;
          const isMuted = isAnyHighlighted && !isHighlighted;

          return (
            <path
              key={series.symbol}
              d={linePath}
              fill="none"
              stroke={series.color}
              strokeWidth={isHighlighted ? "3.2" : "2.2"}
              opacity={isMuted ? "0.22" : "1"}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "stroke-width 0.2s ease, opacity 0.2s ease" }}
            />
          );
        })}

        {seriesData.map((series) => {
          const coords = series.pcts.map((pct, i) => [
            pad + i * step,
            h - pad - ((pct - minPct) / rangePct) * (h - pad * 2)
          ]);
          
          const isHighlighted = highlightedSymbol === series.symbol;
          const isAnyHighlighted = highlightedSymbol !== null;
          const isMuted = isAnyHighlighted && !isHighlighted;
          if (isMuted) return null;

          return coords.map(([cx, cy], idx) => {
            const originalPoint = (series.symbol === mainSymbol ? points : compareData[series.symbol])[idx];
            return (
              <circle
                key={`${series.symbol}-${idx}`}
                cx={cx.toFixed(1)}
                cy={cy.toFixed(1)}
                r="6"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint({
                  symbol: series.symbol,
                  price: parseFloat(originalPoint.price),
                  pct: series.pcts[idx],
                  time: formatTime(originalPoint.createdAt),
                  x: cx,
                  y: cy,
                  color: series.color
                })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          });
        })}
      </svg>

      <div className="flex justify-between items-center text-[10px] px-2.5 mt-0.5" style={{ color: COLORS.textMuted }}>
        <span>{formatTime(points[0]?.createdAt)}</span>
        <span>{formatTime(points[Math.floor(points.length / 2)]?.createdAt)}</span>
        <span>{formatTime(points[points.length - 1]?.createdAt)}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
        {seriesData.map((series) => {
          const isHighlighted = highlightedSymbol === series.symbol;
          return (
            <div
              key={series.symbol}
              onMouseEnter={() => setHighlightedSymbol(series.symbol)}
              onMouseLeave={() => setHighlightedSymbol(null)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-all duration-150"
              style={{
                borderColor: isHighlighted ? series.color : COLORS.cardBorder,
                background: isHighlighted ? "rgba(253,199,0,0.06)" : COLORS.inputBg,
                boxShadow: isHighlighted ? `0 0 10px -3px ${series.color}` : "none",
                transform: isHighlighted ? "scale(1.04)" : "scale(1)"
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ background: series.color, boxShadow: `0 0 6px ${series.color}` }} />
              <span style={{ color: COLORS.textMain }}>{series.symbol}</span>
              <span className="text-[10px]" style={{ color: series.pcts[series.pcts.length - 1] >= 0 ? COLORS.successText : COLORS.errorText }}>
                {(series.pcts[series.pcts.length - 1] >= 0 ? "+" : "")}{series.pcts[series.pcts.length - 1].toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] italic text-center mt-1" style={{ color: COLORS.textMuted }}>
        {lang === "TR" 
          ? `* Yüzdeler, grafiğin başlangıç noktası olan ${formatTime(points[0]?.createdAt)} fiyatı referans alınarak hesaplanmıştır.`
          : `* Percentages are calculated relative to the starting price at ${formatTime(points[0]?.createdAt)}.`}
      </div>

      {hoveredPoint && (
        <div
          className="absolute pointer-events-none rounded-xl p-2.5 text-[11px] border"
          style={{
            left: `${(hoveredPoint.x / w) * 100}%`,
            top: `${tooltipTop}px`,
            transform: "translateX(-50%)",
            background: COLORS.card,
            borderColor: COLORS.cardBorder,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
            color: COLORS.textMain,
            zIndex: 50
          }}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: hoveredPoint.color }} />
            <span>{hoveredPoint.symbol}</span>
          </div>
          <div className="font-semibold text-xs">{fmtUsd(hoveredPoint.price)}</div>
          {hoveredPoint.pct !== undefined && (
            <div className="text-[10px] mt-0.5" style={{ color: hoveredPoint.pct >= 0 ? COLORS.successText : COLORS.errorText }}>
              {hoveredPoint.pct >= 0 ? "+" : ""}{hoveredPoint.pct.toFixed(2)}%
            </div>
          )}
          <div className="text-[9.5px] mt-1" style={{ color: COLORS.textMuted }}>
            {hoveredPoint.time}
          </div>
        </div>
      )}
    </div>
  );
}


function CoinDetailView({ coin, price, lastPrice, history, historyLoading, userId, token, onBack, onTraded, lang }) {
  const [action, setAction] = useState("BUY");
  const [usdValue, setUsdValue] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeMessage, setTradeMessage] = useState({ text: "", type: "" });
  const [timeframe, setTimeframe] = useState("15m");

  const [compareList, setCompareList] = useState([]);
  const [compareData, setCompareData] = useState({});
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleCompareCoin = async (sym) => {
    if (compareList.includes(sym)) {
      setCompareList(compareList.filter((s) => s !== sym));
    } else {
      if (!compareData[sym]) {
        try {
          const res = await fetch(`${API_BASE}/api/market/history?asset=${sym}`);
          const data = await res.json();
          setCompareData((prev) => ({ ...prev, [sym]: data }));
        } catch (e) {
          console.error(e);
        }
      }
      setCompareList([...compareList, sym]);
    }
  };

  const coinInfo = COINS.find((c) => c.symbol === coin);

  const change = (() => {
    if (!lastPrice || !price) return null;
    const diff = price - lastPrice;
    if (diff === 0) return null;
    const pct = ((diff / lastPrice) * 100).toFixed(2);
    return { up: diff > 0, text: (diff > 0 ? "▲ +" : "▼ ") + pct + "%" };
  })();

  const updateFromUsd = (val) => {
    setUsdValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && price > 0) {
      setCoinValue((num / price).toFixed(8));
    } else {
      setCoinValue("");
    }
  };

  const updateFromCoin = (val) => {
    setCoinValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && price > 0) {
      setUsdValue((num * price).toFixed(2));
    } else {
      setUsdValue("");
    }
  };

  const submitTrade = async (e) => {
    e.preventDefault();
    const amount = parseFloat(coinValue);
    if (!amount || amount <= 0) return;
    setTradeMessage({ text: "", type: "" });
    setTradeLoading(true);
    try {
      const res = await apiFetch(`${API_BASE}/api/trade/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: Number(userId), coinSymbol: coin, action, amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTradeMessage({ text: data.error || data.message || (lang === "TR" ? "İşlem başarısız oldu." : "Transaction failed."), type: "error" });
        return;
      }
      setTradeMessage({ text: data.message || (lang === "TR" ? "İşlem başarıyla gerçekleşti." : "Transaction completed successfully."), type: "success" });
      setUsdValue("");
      setCoinValue("");
      onTraded({
        action,
        coin,
        amount,
        price: data.executionPrice || price,
        total: data.totalCost || amount * price,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    } catch (err) {
      setTradeMessage({ text: lang === "TR" ? "Sunucuya ulaşılamadı. Backend çalışıyor mu?" : "Cannot reach server. Is backend running?", type: "error" });
    } finally {
      setTradeLoading(false);
    }
  };

  const compareDropdown = (
    <div style={{ position: "relative", zIndex: 10 }}>
      <button
        onClick={() => setCompareOpen(!compareOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 active:scale-[0.97]"
        style={{
          background: compareList.length > 0 ? "rgba(253,199,0,0.08)" : COLORS.inputBg,
          borderColor: compareList.length > 0 ? COLORS.yellow : COLORS.inputBorder,
          color: compareList.length > 0 ? COLORS.yellow : COLORS.textMain
        }}
      >
        <span>{lang === "TR" ? "Kıyasla" : "Compare"} ({compareList.length})</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 10, height: 10, transform: compareOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {compareOpen && (
        <>
          <div className="fixed inset-0" style={{ zIndex: 9 }} onClick={() => setCompareOpen(false)} />
          <div className="absolute right-0 mt-1.5 rounded-xl border p-2 flex flex-col gap-1 w-44" style={{ zIndex: 10, background: COLORS.card, borderColor: COLORS.cardBorder, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}>
            {COINS.filter((c) => c.symbol !== coin).map((c) => {
              const checked = compareList.includes(c.symbol);
              return (
                <button
                  key={c.symbol}
                  type="button"
                  onClick={() => toggleCompareCoin(c.symbol)}
                  className="flex items-center justify-between w-full text-left px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium transition-all"
                  style={{
                    background: checked ? "rgba(253,199,0,0.05)" : "transparent",
                    color: checked ? COLORS.yellow : COLORS.textMain
                  }}
                  onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = COLORS.inputBg; }}
                  onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = "transparent"; }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.badgeBg }} />
                    {c.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    style={{
                      accentColor: COLORS.yellow,
                      cursor: "pointer"
                    }}
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-[1150px] w-full mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium mb-5"
        style={{ color: COLORS.textMuted }}
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t("back", lang)}
      </button>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <AssetBadge label={coin[0]} bg={coinInfo?.badgeBg} size={44} />
        <div>
          <div className="font-bold text-xl" style={{ color: COLORS.textMain }}>{coinInfo?.name} <span style={{ color: COLORS.textMuted, fontWeight: 500 }}>· {coin}/USDT</span></div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg" style={{ color: COLORS.textMain }}>{fmtUsd(price)}</span>
            {change && <span className="text-sm" style={{ color: change.up ? COLORS.successText : COLORS.errorText }}>{change.text}</span>}
          </div>
        </div>
        <div className="flex gap-1 ml-auto" style={{ background: COLORS.inputBg, borderRadius: 10, padding: "3px", border: `1px solid ${COLORS.cardBorder}` }}>
          {[["15m", 60], ["30m", 120], ["1h", 240], ["all", null]].map(([tf]) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: "3px 10px",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 700,
                transition: "all 0.15s ease",
                background: timeframe === tf ? COLORS.yellow : "transparent",
                color: timeframe === tf ? "#000" : COLORS.textMuted,
                border: "none",
                cursor: "pointer"
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <Card title={t("priceChart", lang)} className="col-span-12 lg:col-span-7" height={540} right={compareDropdown}>
          {historyLoading ? (
            <div className="flex items-center justify-center gap-2" style={{ height: 220, color: COLORS.textMuted, fontSize: 13 }}>
              <Spinner /> {t("loading", lang)}
            </div>
          ) : (
            <LineChart
              points={(() => {
                const sliceCount = timeframe === "15m" ? 60 : timeframe === "30m" ? 120 : timeframe === "1h" ? 240 : history.length;
                return history.slice(-sliceCount);
              })()}
              mainSymbol={coin}
              compareList={compareList}
              compareData={(() => {
                if (timeframe === "all") return compareData;
                const sliceCount = timeframe === "15m" ? 60 : timeframe === "30m" ? 120 : timeframe === "1h" ? 240 : null;
                if (!sliceCount) return compareData;
                const sliced = {};
                Object.entries(compareData).forEach(([k, v]) => { sliced[k] = v.slice(-sliceCount); });
                return sliced;
              })()}
              lang={lang}
            />
          )}
        </Card>

        <Card title={`${coin} ${action === "BUY" ? (lang === "TR" ? "Al" : "Buy") : (lang === "TR" ? "Sat" : "Sell")}`} className="col-span-12 lg:col-span-5" height={540}>
          <form onSubmit={submitTrade}>
            <div className="flex gap-2 mb-4">
              {["BUY", "SELL"].map((a) => {
                const isActive = action === a;
                const isBuy = a === "BUY";
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAction(a)}
                    className="flex-1 rounded-xl py-2.5 font-bold text-[13.5px] transition-all duration-150 active:scale-[0.96]"
                    style={{
                      background: isActive ? (isBuy ? COLORS.successBg : COLORS.errorBg) : COLORS.inputBg,
                      border: `1px solid ${isActive ? (isBuy ? COLORS.successBorder : COLORS.errorBorder) : COLORS.inputBorder}`,
                      color: isActive ? (isBuy ? COLORS.successText : COLORS.errorText) : COLORS.textMuted,
                    }}
                  >
                    {isBuy ? (lang === "TR" ? "AL" : "BUY") : (lang === "TR" ? "SAT" : "SELL")}
                  </button>
                );
              })}
            </div>

            <div className="mb-3">
              <label className="block text-xs mb-2 font-medium" style={{ color: "#a3a3a3" }}>{t("dollar", lang)}</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={usdValue}
                  onChange={(e) => updateFromUsd(e.target.value)}
                  className="w-full rounded-xl pl-4 pr-14 py-3 text-sm outline-none"
                  style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: COLORS.textMuted }}>USD</span>
              </div>
            </div>

            <div className="flex justify-center my-1">
              <span
                className="flex items-center justify-center rounded-full"
                style={{ width: 28, height: 28, background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}` }}
              >
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M7 10L12 15L17 10" stroke={COLORS.yellow} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-xs mb-2 font-medium" style={{ color: "#a3a3a3" }}>{t("amount", lang)} ({coin})</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.00000001"
                  min="0"
                  placeholder="0.00000000"
                  value={coinValue}
                  onChange={(e) => updateFromCoin(e.target.value)}
                  className="w-full rounded-xl pl-4 pr-14 py-3 text-sm outline-none"
                  style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: COLORS.textMuted }}>{coin}</span>
              </div>
            </div>

            <PrimaryButton type="submit" loading={tradeLoading} loadingText={lang === "TR" ? "Gönderiliyor..." : "Sending..."}>
              {action === "BUY" ? t("buy", lang) : t("sell", lang)}
            </PrimaryButton>
          </form>
          <MessageBox text={tradeMessage.text} type={tradeMessage.type} />
        </Card>
      </div>
    </div>
  );
}

//  PORTFOLIO

function PortfolioView({ wallet, walletError, prices, coins = COINS, lang }) {
  const usdt = wallet ? parseFloat(wallet.usdtBalance || 0) : 0;
  
  let totalCryptoValue = 0;
  if (wallet && prices) {
    COINS.forEach(coin => {
      const fieldName = coin.symbol.toLowerCase() + "Balance";
      const qty = parseFloat(wallet[fieldName] || 0);
      const price = prices[coin.symbol] || 0;
      totalCryptoValue += qty * price;
    });
  }
  const totalValue = usdt + totalCryptoValue;

  const rows = [
    { label: "USDT (Nakit)", badge: <AssetBadge label="$" bg={COLORS.yellow} />, qty: fmtUsd(usdt), val: null }
  ];

  if (wallet) {
    coins.forEach(coin => {
      const fieldName = coin.symbol.toLowerCase() + "Balance";
      const qty = parseFloat(wallet[fieldName] || 0);
      const price = prices[coin.symbol] || 0;
      const val = qty * price;
      
      rows.push({
        label: coin.symbol,
        badge: <AssetBadge label={coin.symbol[0]} bg={coin.badgeBg} />,
        qty: qty.toFixed(6) + " " + coin.symbol,
        val: fmtUsd(val)
      });
    });
  }

  return (
    <div className="max-w-[1150px] w-full mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textMain, letterSpacing: "-0.02em" }}>{t("portfolioTitle", lang)}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>{t("portfolioDesc", lang)}</p>

      {/* Ortak sabit yükseklik ve içeride kaydırma alanı düzeltildi */}
      <Card height={540}>
        <div className="text-3xl font-bold mb-1" style={{ letterSpacing: "-0.02em", color: COLORS.textMain }}>{fmtUsd(totalValue)}</div>
        <div className="text-[13px] mb-5" style={{ color: COLORS.textMuted }}>{t("totalValue", lang)}</div>

        <div className="overflow-y-auto overflow-x-hidden h-full -mr-5 pr-3 max-h-[380px]">
          {rows.map((row, i, arr) => (
            <div
              key={row.label}
              className="flex justify-between items-center py-3 text-sm"
              style={{ borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.cardBorder}` : "none" }}
            >
              <div className="flex items-center gap-2.5 font-semibold" style={{ color: COLORS.textMain }}>{row.badge}{row.label === "USDT (Nakit)" ? t("cash", lang) : row.label}</div>
              <div className="text-right">
                <div style={{ color: COLORS.textMain }}>{row.qty}</div>
                {row.val && <div className="text-[12.5px]" style={{ color: COLORS.textMuted }}>{row.val}</div>}
              </div>
            </div>
          ))}
        </div>
        <MessageBox text={walletError} type="error" />
      </Card>
    </div>
  );
}

// Alım satım geçmişi görüntüleme

function HistoryView({ transactions, error, loading, lang }) {
  return (
    <div className="max-w-[1150px] w-full mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textMain, letterSpacing: "-0.02em" }}>{t("historyTitle", lang)}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>{t("historyDesc", lang)}</p>

      <Card height={540}>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8" style={{ color: COLORS.textMuted, fontSize: 13 }}>
            <Spinner /> {t("loading", lang)}
          </div>
        ) : error ? (
          <MessageBox text={error} type="error" />
        ) : transactions.length === 0 ? (
          <div className="text-center text-[13.5px] py-8" style={{ color: COLORS.textMuted }}>
            {t("noTransactions", lang)}
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-hidden h-full -mr-5 pr-3 max-h-[440px]">
            {transactions.map((tItem, i) => {
              const isBuy = tItem.transactionType === "BUY";
              return (
                <div
                  key={tItem.id ?? i}
                  className="flex justify-between items-center py-3.5 text-sm"
                  style={{ borderBottom: i < transactions.length - 1 ? `1px solid ${COLORS.cardBorder}` : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-lg px-2.5 py-1 text-[11px] font-bold"
                      style={{
                        background: isBuy ? COLORS.successBg : COLORS.errorBg,
                        color: isBuy ? COLORS.successText : COLORS.errorText,
                      }}
                    >
                      {isBuy ? (lang === "TR" ? "AL" : "BUY") : (lang === "TR" ? "SAT" : "SELL")}
                    </span>
                    <span className="font-semibold" style={{ color: COLORS.textMain }}>{tItem.assetName}</span>
                    <span style={{ color: COLORS.textMuted }}>{parseFloat(tItem.amount).toFixed(6)} {tItem.assetName}</span>
                  </div>
                  <div className="text-right">
                    <div style={{ color: COLORS.textMain }}>{fmtUsd(tItem.totalCost)}</div>
                    <div className="text-[11.5px]" style={{ color: COLORS.textMuted }}>
                      {new Date(tItem.createdAt).toLocaleString(lang === "TR" ? "tr-TR" : "en-US")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// COPCOIN AI 
function AiWidget({ token, open, onOpenChange, lang, theme }) {
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [aiLog, setAiLog] = useState([]);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState({ text: "", type: "" });
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [aiLog, aiLoading]);

  const openPanel = () => {
    onOpenChange(true);
    setBubbleDismissed(true);
  };

  const submitAi = async (e) => {
    e.preventDefault();
    const question = aiQuestion.trim();
    if (!question) return;
    setAiMessage({ text: "", type: "" });
    setAiLog((log) => [...log, { role: "question", text: question }]);
    setAiQuestion("");
    setAiLoading(true);
    try {
      const res = await apiFetch(`${API_BASE}/api/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiMessage({ text: data.error || data.message || (lang === "TR" ? "Yapay zeka servisi şu anda yanıt vermiyor. Lütfen daha sonra tekrar deneyiniz." : "AI service is not responding. Please try again later."), type: "error" });
        return;
      }
      setAiLog((log) => [...log, { role: "answer", text: data.answer }]);
    } catch (err) {
      setAiMessage({ text: lang === "TR" ? "Sunucuya ulaşılamadı. Backend çalışıyor mu?" : "Cannot reach server. Is backend running?", type: "error" });
    } finally {
      setAiLoading(false);
    }
  };

  const botIconPath = "M12 3L14 9L20 12L14 15L12 21L10 15L4 12L10 9L12 3Z";

  return (
    <>
      {/* Konuşma balonu */}
      {!open && !bubbleDismissed && (
        <div
          className="fixed z-40 flex items-end gap-2"
          style={{ bottom: 96, right: 24, maxWidth: 260 }}
        >
          <div
            onClick={openPanel}
            className="rounded-2xl rounded-br-sm px-4 py-3 text-[13px] cursor-pointer"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.textMain, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.6)", lineHeight: 1.45 }}
          >
            <div className="font-bold mb-0.5" style={{ color: COLORS.yellow }}>CopCoin AI</div>
            {lang === "TR" ? "Merhaba! Portföyün ve piyasa trendleri hakkında merak ettiklerini sorabilirsin — yardımcı olayım mı?" : "Hello! You can ask me anything about your portfolio and market trends — how can I help?"}
          </div>
          <button
            onClick={() => setBubbleDismissed(true)}
            className="rounded-full flex items-center justify-center shrink-0 transition-transform duration-150 active:scale-90"
            style={{ width: 20, height: 20, background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMuted, fontSize: 11, marginBottom: 2 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Yuvarlak buton */}
      <button
        onClick={() => onOpenChange(!open)}
        className="fixed flex items-center justify-center rounded-full transition-transform duration-150 hover:scale-105 active:scale-95"
        style={{
          bottom: 24, right: 24, width: 58, height: 58,
          background: `linear-gradient(155deg, ${COLORS.yellow}, #e0ac00)`,
          boxShadow: "0 10px 30px -8px rgba(253,199,0,0.55)",
          zIndex: open ? 20 : 60,
        }}
        aria-label="CopCoin AI Botu"
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24 }}>
          <path d={botIconPath} stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Sağdan açılan panel */}
      <div
        className="fixed top-0 right-0 h-full flex flex-col transition-transform duration-300"
        style={{
          width: 300,
          maxWidth: "88vw",
          background: COLORS.sidebar,
          borderLeft: `1px solid ${COLORS.cardBorder}`,
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: open ? "-20px 0 50px -20px rgba(0,0,0,0.6)" : "none",
          zIndex: 50,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}>
          <span
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 34, height: 34, background: `linear-gradient(155deg, ${COLORS.yellow}, #e0ac00)` }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 17, height: 17 }}>
              <path d={botIconPath} stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1">
            <div className="font-bold text-sm" style={{ color: COLORS.textMain }}>CopCoin AI</div>
            <div className="text-[11.5px]" style={{ color: COLORS.textMuted }}>{lang === "TR" ? "Size nasıl yardımcı olabilirim?" : "How can I help you?"}</div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 active:scale-90"
            style={{ width: 28, height: 28, background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMuted }}
            aria-label="Kapat"
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {aiLog.length === 0 && (
            <div className="text-center text-[13px] py-6 px-2" style={{ color: COLORS.textMuted }}>
              {lang === "TR" ? "Portföyün ve piyasa trendleri hakkında bir soru sor." : "Ask a question about your portfolio and market trends."}
            </div>
          )}
          {aiLog.map((entry, i) => (
            <div
              key={i}
              className="rounded-2xl px-3.5 py-3 text-[13.3px]"
              style={{
                lineHeight: 1.5,
                maxWidth: "88%",
                alignSelf: entry.role === "question" ? "flex-end" : "flex-start",
                background: entry.role === "question" ? COLORS.inputBg : (theme === "dark" ? "#151107" : "#fffbeb"),
                color: entry.role === "question" ? COLORS.textMain : (theme === "dark" ? "#f4e2a6" : "#b45309"),
                border: `1px solid ${entry.role === "question" ? COLORS.inputBorder : (theme === "dark" ? "#2a2210" : "#fef3c7")}`,
              }}
            >
              {entry.text}
            </div>
          ))}
          {aiLoading && (
            <div className="flex items-center gap-2 self-start text-[12.5px]" style={{ color: COLORS.textMuted }}>
              <Spinner /> {lang === "TR" ? "Düşünüyor..." : "Thinking..."}
            </div>
          )}
          <div ref={logEndRef} />
        </div>

        <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${COLORS.cardBorder}` }}>
          <MessageBox text={aiMessage.text} type={aiMessage.type} />
          <form onSubmit={submitAi} className="mt-2">
            <div className="flex items-end gap-2">
              <textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={t("aiPlaceholder", lang)}
                required
                rows={1}
                className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] outline-none resize-none"
                style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitAi(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 active:scale-90"
                style={{ width: 40, height: 40, background: COLORS.yellow, opacity: aiLoading ? 0.6 : 1 }}
              >
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 17, height: 17 }}>
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#141414" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// PANEL profil, sifre degistir, hesap sil

function AccountPanel({ token, username, userId, onClose, onAccountDeleted, lang, wallet, transactions = [], prices }) {
  const [tab, setTab] = useState("info"); // info | password | danger
  const [walletOpen, setWalletOpen] = useState(false);

  // sifre degistirme formu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ text: "", type: "" });

  // hesap silme onayi
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState({ text: "", type: "" });

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setPwMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setPwMessage({ text: lang === "TR" ? "Yeni şifreler birbiriyle uyuşmuyor." : "New passwords do not match.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setPwMessage({ text: lang === "TR" ? "Yeni şifre en az 6 karakter olmalı." : "New password must be at least 6 characters.", type: "error" });
      return;
    }

    setPwLoading(true);
    try {
      const res = await apiFetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMessage({ text: data.error || data.message || (lang === "TR" ? "Şifre değiştirilemedi." : "Failed to change password."), type: "error" });
        return;
      }
      setPwMessage({ text: data.message || (lang === "TR" ? "Şifre güncellendi." : "Password updated."), type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwMessage({ text: lang === "TR" ? "Sunucuya ulaşılamadı. Backend çalışıyor mu?" : "Cannot reach server. Is backend running?", type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  const submitDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteMessage({ text: "", type: "" });
    setDeleteLoading(true);
    try {
      const res = await apiFetch(`${API_BASE}/api/auth/delete-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteMessage({ text: data.error || data.message || (lang === "TR" ? "Hesap silinemedi." : "Failed to delete account."), type: "error" });
        return;
      }
      onAccountDeleted();
    } catch (err) {
      setDeleteMessage({ text: lang === "TR" ? "Sunucuya ulaşılamadı. Backend çalışıyor mu?" : "Cannot reach server. Is backend running?", type: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { key: "info", label: t("accountInfoTab", lang) },
    { key: "password", label: t("changePasswordTab", lang) },
    { key: "danger", label: t("deleteAccountTab", lang) },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 70 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-3xl overflow-hidden"
        style={{ maxWidth: 440, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)" }}
      >
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}>
          <span
            className="flex items-center justify-center rounded-full font-bold text-base shrink-0"
            style={{ width: 44, height: 44, background: COLORS.yellow, color: "#141414" }}
          >
            {username?.[0]?.toUpperCase() || "?"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate" style={{ color: COLORS.textMain }}>{username}</div>
            <div className="text-[11.5px]" style={{ color: COLORS.textMuted }}>{t("accountSettings", lang)}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 active:scale-90"
            style={{ width: 30, height: 30, background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMuted }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 15, height: 15 }}>
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3">
          {tabs.map((tItem) => {
            const isActive = tab === tItem.key;
            return (
              <button
                key={tItem.key}
                onClick={() => setTab(tItem.key)}
                className="px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-all duration-150 active:scale-[0.95]"
                style={{
                  background: isActive ? "rgba(253,199,0,0.1)" : "transparent",
                  color: isActive ? COLORS.yellow : COLORS.textMuted,
                }}
              >
                {tItem.label}
              </button>
            );
          })}
        </div>

        <div className="px-6 py-5" style={{ minHeight: 320 }}>
          {tab === "info" && (() => {
            const ownedAssets = wallet ? COINS.map(coin => {
              const field = `${coin.symbol.toLowerCase()}Balance`;
              const balance = wallet[field] || 0;
              return {
                ...coin,
                balance,
                price: prices?.[coin.symbol] || 0,
                value: balance * (prices?.[coin.symbol] || 0)
              };
            }).filter(asset => asset.balance > 0.00000001) : [];

             const cashBalance = wallet ? parseFloat(wallet.usdtBalance || 0) : 0;
             const totalCryptoValue = ownedAssets.reduce((sum, asset) => sum + asset.value, 0);
             const totalUsdValue = totalCryptoValue + cashBalance;

             return (
               <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center py-2 text-sm border-b" style={{ borderColor: COLORS.cardBorder }}>
                   <span style={{ color: COLORS.textMuted }}>{t("usernameLabel", lang)}</span>
                   <span className="font-semibold text-base" style={{ color: COLORS.textMain }}>{username}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 text-sm border-b" style={{ borderColor: COLORS.cardBorder }}>
                   <span style={{ color: COLORS.textMuted }}>{lang === "TR" ? "Toplam İşlem Sayısı" : "Total Transactions"}</span>
                   <span className="font-bold px-2.5 py-0.5 rounded-full text-xs" style={{ background: COLORS.inputBg, color: COLORS.yellow }}>
                     {transactions?.length || 0}
                   </span>
                 </div>
                 
                 <div className="flex justify-between items-center py-2 text-sm border-b" style={{ borderColor: COLORS.cardBorder }}>
                   <span style={{ color: COLORS.textMuted }}>{lang === "TR" ? "Toplam Varlık Değeri" : "Total Asset Value"}</span>
                   <span className="font-bold text-sm" style={{ color: COLORS.yellow }}>
                     {fmtUsd(totalUsdValue)}
                   </span>
                 </div>
                 <div className="flex justify-between items-center py-2 text-sm border-b" style={{ borderColor: COLORS.cardBorder }}>
                   <span style={{ color: COLORS.textMuted }}>{lang === "TR" ? "Kripto Yatırım Değeri" : "Crypto Assets Value"}</span>
                   <span className="font-semibold text-sm" style={{ color: COLORS.textMain }}>
                     {fmtUsd(totalCryptoValue)}
                   </span>
                 </div>

                 <div className="mt-1">
                   <div className="text-[11.5px] font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                     {lang === "TR" ? "Cüzdan Detayları" : "Wallet Details"}
                   </div>
                   {ownedAssets.length === 0 && cashBalance <= 0 ? (
                     <div className="text-center text-xs py-3 rounded-2xl border" style={{ borderColor: COLORS.cardBorder, color: COLORS.textMuted }}>
                       {lang === "TR" ? "Cüzdanda varlık bulunmuyor." : "No assets in wallet."}
                     </div>
                   ) : (
                     <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                       {cashBalance > 0 && (
                         <div className="flex justify-between items-center py-2 text-xs border-b" style={{ borderColor: COLORS.cardBorder }}>
                           <div className="flex items-center gap-2 font-medium" style={{ color: COLORS.textMain }}>
                             <span className="w-5 h-5 rounded-full bg-[#f5a623] flex items-center justify-center text-[10px] font-bold text-[#141414]">S</span>
                             {lang === "TR" ? "USDT (Kullanılabilir Nakit)" : "USDT (Available Cash)"}
                           </div>
                           <div className="text-right">
                             <div className="font-semibold" style={{ color: COLORS.textMain }}>{cashBalance.toFixed(2)} USDT</div>
                             <div className="text-[10px]" style={{ color: COLORS.textMuted }}>{fmtUsd(cashBalance)}</div>
                           </div>
                         </div>
                       )}
                       {ownedAssets.map((asset) => (
                         <div key={asset.symbol} className="flex justify-between items-center py-2 text-xs border-b last:border-0" style={{ borderColor: COLORS.cardBorder }}>
                           <div className="flex items-center gap-2 font-medium" style={{ color: COLORS.textMain }}>
                             <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-[#141414]" style={{ background: asset.badgeBg }}>{asset.symbol[0]}</span>
                             {asset.symbol}
                           </div>
                           <div className="text-right">
                             <div className="font-semibold" style={{ color: COLORS.textMain }}>{asset.balance.toFixed(6)} {asset.symbol}</div>
                             <div className="text-[10px]" style={{ color: COLORS.textMuted }}>{fmtUsd(asset.value)}</div>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             );
           })()}

          {tab === "password" && (
            <form onSubmit={submitPasswordChange}>
              <Field label={t("currentPasswordLabel", lang)} type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <Field label={t("newPasswordLabel", lang)} type="password" placeholder={t("minCharPlaceholder", lang)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <Field label={t("confirmPasswordLabel", lang)} type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <PrimaryButton type="submit" loading={pwLoading} loadingText={lang === "TR" ? "Güncelleniyor..." : "Updating..."}>{t("updatePasswordBtn", lang)}</PrimaryButton>
              <MessageBox text={pwMessage.text} type={pwMessage.type} />
            </form>
          )}

          {tab === "danger" && (
            <div>
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}` }}
              >
                <div className="font-bold text-sm mb-1.5" style={{ color: COLORS.errorText }}>{t("deletePermanently", lang)}</div>
                <p className="text-[12.5px] leading-relaxed" style={{ color: COLORS.textMuted }}>
                  {t("deleteAccNotice", lang)}
                </p>
              </div>

              {!deleteConfirming ? (
                <button
                  onClick={() => setDeleteConfirming(true)}
                  className="w-full rounded-2xl py-3 font-bold text-sm transition-transform duration-150 active:scale-[0.97]"
                  style={{ background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, color: COLORS.errorText }}
                >
                  {t("deleteAccBtn", lang)}
                </button>
              ) : (
                <form onSubmit={submitDeleteAccount}>
                  <Field label={lang === "TR" ? "Onaylamak için şifreni gir" : "Enter password to confirm"} type="password" placeholder="••••••••" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setDeleteConfirming(false); setDeletePassword(""); setDeleteMessage({ text: "", type: "" }); }}
                      className="flex-1 rounded-xl py-3 text-sm font-semibold transition-transform duration-150 active:scale-[0.96]"
                      style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
                    >
                      {t("cancelBtn", lang)}
                    </button>
                    <button
                      type="submit"
                      disabled={deleteLoading}
                      className="flex-1 rounded-xl py-3 text-sm font-bold transition-transform duration-150 active:scale-[0.96]"
                      style={{ background: COLORS.errorText, color: "#1a0000", opacity: deleteLoading ? 0.6 : 1 }}
                    >
                      {deleteLoading ? (lang === "TR" ? "Siliniyor..." : "Deleting...") : t("yesDeleteBtn", lang)}
                    </button>
                  </div>
                  <MessageBox text={deleteMessage.text} type={deleteMessage.type} />
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// DASHBOARD ROOT 

function Header({ view, searchQuery, setSearchQuery, theme, setTheme, lang, setLang, triggerTransition }) {
  const getTitleKey = () => {
    if (view === "home") return "marketTitle";
    if (view === "portfolio") return "portfolioTitle";
    if (view === "history") return "historyTitle";
    if (view === "detail") return "priceChart";
    return "";
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between px-6 md:px-8 py-4 gap-4"
      style={{ borderBottom: `1px solid ${COLORS.cardBorder}`, background: COLORS.sidebar }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold" style={{ color: COLORS.textMain, letterSpacing: "-0.02em" }}>
          {t(getTitleKey(), lang)}
        </h1>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {view !== "detail" && (
          <div className="relative w-full sm:w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder", lang)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none transition-all duration-150"
              style={{
                background: COLORS.inputBg,
                border: `1px solid ${COLORS.inputBorder}`,
                color: COLORS.textMain,
              }}
            />
            <svg
              className="absolute left-2.5 top-2.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 12, height: 12, color: COLORS.textMuted }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        )}

        <button
          onClick={() => triggerTransition(() => setLang(lang === "TR" ? "EN" : "TR"))}
          className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.95]"
          style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
        >
          {lang === "TR" ? "EN" : "TR"}
        </button>

        <button
          onClick={() => triggerTransition(() => setTheme(theme === "dark" ? "light" : "dark"))}
          className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.95] flex items-center justify-center"
          style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, color: COLORS.textMain }}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ session, onLogout, onAccountDeleted, theme, setTheme, lang, setLang, triggerTransition }) {
  const { token, username, userId } = session;

  const [view, setView] = useState(() => {
    return sessionStorage.getItem("copcoin_view") || "home"; 
  });
  const [selectedCoin, setSelectedCoin] = useState(() => {
    return sessionStorage.getItem("copcoin_selected_coin") || null; 
  });
  const [accountOpen, setAccountOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(""); 

  const [prices, setPrices] = useState(() => {
    const p = {};
    COINS.forEach(c => p[c.symbol] = 0);
    return p;
  });
  const [lastPrices, setLastPrices] = useState(() => {
    const lp = {};
    COINS.forEach(c => lp[c.symbol] = null);
    return lp;
  });

  const [homeHistory, setHomeHistory] = useState(() => {
    const h = {};
    COINS.forEach(c => h[c.symbol] = []);
    return h;
  });
  const [detailHistory, setDetailHistory] = useState([]);
  const [detailHistoryLoading, setDetailHistoryLoading] = useState(false);

  const [wallet, setWallet] = useState(null);
  const [walletError, setWalletError] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [transactionsError, setTransactionsError] = useState("");
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("copcoin_view", view);
    if (selectedCoin) {
      sessionStorage.setItem("copcoin_selected_coin", selectedCoin);
    } else {
      sessionStorage.removeItem("copcoin_selected_coin");
    }
  }, [view, selectedCoin]);

  const loadPrices = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/market/prices`);
      const data = await res.json();
      setPrices((prevPrices) => {
        const newLastPrices = {};
        const newPrices = {};
        COINS.forEach(c => {
          newLastPrices[c.symbol] = prevPrices[c.symbol] || null;
          newPrices[c.symbol] = parseFloat(data[c.symbol] || 0);
        });
        setLastPrices(newLastPrices);
        return newPrices;
      });
    } catch (err) {
      
    }
  }, []);

  const loadHomeHistory = useCallback(async () => {
    try {
      const promises = COINS.map(c => 
        fetch(`${API_BASE}/api/market/history?asset=${c.symbol}`).then(r => r.json())
      );
      const histories = await Promise.all(promises);
      
      const newHistory = {};
      COINS.forEach((c, idx) => {
        newHistory[c.symbol] = histories[idx].slice(-30);
      });
      setHomeHistory(newHistory);
    } catch (err) {}
  }, []);

  const loadDetailHistory = useCallback(async (symbol) => {
    setDetailHistoryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/market/history?asset=${symbol}`);
      const data = await res.json();
      setDetailHistory(data); 
    } catch (err) {
      setDetailHistory([]);
    } finally {
      setDetailHistoryLoading(false);
    }
  }, []);

  const loadWallet = useCallback(async () => {
    if (!userId) return;
    setWalletError("");
    try {
      const res = await apiFetch(`${API_BASE}/api/wallet/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) {
        setWalletError(data.error || data.message || "Cüzdan bilgisi alınamadı.");
        return;
      }
      setWallet(data);
    } catch (err) {
      setWalletError("Sunucuya ulaşılamadı. Backend çalışıyor mu?");
    }
  }, [token, userId]);

  const loadTransactions = useCallback(async () => {
    if (!userId) return;
    setTransactionsError("");
    try {
      const res = await apiFetch(`${API_BASE}/api/wallet/${userId}/transactions`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) {
        setTransactionsError(data.error || data.message || "İşlem geçmişi alınamadı.");
        return;
      }
      setTransactions(data);
    } catch (err) {
      setTransactionsError("Sunucuya ulaşılamadı. Backend çalışıyor mu?");
    } finally {
      setTransactionsLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    loadPrices();
    loadHomeHistory();
    const interval = setInterval(() => { loadPrices(); loadHomeHistory(); }, 15000);
    return () => clearInterval(interval);
  }, [loadPrices, loadHomeHistory]);

  useEffect(() => { loadWallet(); }, [loadWallet]);
  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  useEffect(() => {
    if (view === "detail" && selectedCoin) {
      loadDetailHistory(selectedCoin);
    }
  }, [view, selectedCoin, loadDetailHistory]);

  const handleInspect = (symbol) => {
    setSelectedCoin(symbol);
    setView("detail");
  };

  const handleTraded = () => {
    loadWallet();
    loadTransactions();
  };

  const handleNavigate = (key) => {
    setView(key);
    setSelectedCoin(null);
    setSearchQuery(""); 
  };

  const filteredCoins = COINS.filter(coin => 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPortfolioCoins = COINS.filter(coin => 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx => 
    tx.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tx.transactionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden flex" style={pageBg}>
      <Sidebar
        active={view === "detail" ? "home" : view}
        onNavigate={handleNavigate}
        username={username}
        onLogout={onLogout}
        onOpenAccount={() => setAccountOpen(true)}
        lang={lang}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <MobileNav active={view === "detail" ? "home" : view} onNavigate={handleNavigate} lang={lang} />
        
        <Header
          view={view}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          setTheme={setTheme}
          lang={lang}
          setLang={setLang}
          triggerTransition={triggerTransition}
        />

        <div
          className="flex-1 p-6 md:p-8 overflow-y-auto transition-[padding] duration-300"
          style={{ color: COLORS.textMain, paddingRight: aiOpen ? "min(300px, 30vw)" : undefined }}
        >
          {view === "home" && (
            <HomeView
              prices={prices}
              lastPrices={lastPrices}
              history={homeHistory}
              onInspect={handleInspect}
              coins={filteredCoins}
              lang={lang}
            />
          )}

          {view === "detail" && selectedCoin && (
            <CoinDetailView
              coin={selectedCoin}
              price={prices[selectedCoin]}
              lastPrice={lastPrices[selectedCoin]}
              history={detailHistory}
              historyLoading={detailHistoryLoading}
              userId={userId}
              token={token}
              onBack={() => { setView("home"); setSelectedCoin(null); }}
              onTraded={handleTraded}
              lang={lang}
            />
          )}

          {view === "portfolio" && <PortfolioView wallet={wallet} walletError={walletError} prices={prices} coins={filteredPortfolioCoins} lang={lang} />}
          {view === "history" && <HistoryView transactions={filteredTransactions} error={transactionsError} loading={transactionsLoading} lang={lang} />}
        </div>
      </div>

      <AiWidget token={token} open={aiOpen} onOpenChange={setAiOpen} lang={lang} theme={theme} />

      {accountOpen && (
        <AccountPanel
          token={token}
          username={username}
          userId={userId}
          onClose={() => setAccountOpen(false)}
          onAccountDeleted={onAccountDeleted}
          lang={lang}
          wallet={wallet}
          transactions={transactions}
          prices={prices}
        />
      )}
    </div>
  );
}



//  yükleme ekranı

function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "#000000", zIndex: 100 }}
    >
      <div className="flex items-center gap-2.5 mb-10">
        <img src="/logo-symbol.png" alt="CopCoin" style={{ height: 40, width: "auto" }} />
        <span className="font-bold text-xl tracking-tight" style={{ color: COLORS.yellow }}>CopCoin</span>
      </div>
      <style>{`
        @keyframes copcoin-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes copcoin-dot-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div style={{ position: "relative", width: 64, height: 64, animation: "copcoin-orbit-spin 1s linear infinite" }}>
        <span
          style={{
            position: "absolute", top: 0, left: "50%", width: 14, height: 14, marginLeft: -7,
            borderRadius: "50%", background: COLORS.yellow, boxShadow: `0 0 10px ${COLORS.yellow}`,
            animation: "copcoin-dot-pulse 1s ease-in-out infinite",
          }}
        />
        <span
          style={{
            position: "absolute", bottom: 0, left: "50%", width: 14, height: 14, marginLeft: -7,
            borderRadius: "50%", background: COLORS.yellow, boxShadow: `0 0 10px ${COLORS.yellow}`,
            animation: "copcoin-dot-pulse 1s ease-in-out 0.5s infinite",
          }}
        />
      </div>
      <p className="mt-6 text-sm font-medium" style={{ color: COLORS.textMuted }}>
        Yükleniyor, lütfen bekleyin...
      </p>
    </div>
  );
}

const SESSION_KEY = "copcoin_session";

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [expiredNotice, setExpiredNotice] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  // Tema dan dil secenekleri
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("copcoin_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("copcoin_lang");
    if (saved) {
      const upper = saved.toUpperCase();
      if (upper === "TR" || upper === "EN") return upper;
    }
    return "TR";
  });

  // Tema CSS degiskenleri guncelleme effekti
  useEffect(() => {
    localStorage.setItem("copcoin_theme", theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.style.setProperty("--color-bg", "#f4f6f8");
      root.style.setProperty("--color-sidebar", "#ffffff");
      root.style.setProperty("--color-card", "#ffffff");
      root.style.setProperty("--color-card-border", "#e2e8f0");
      root.style.setProperty("--color-card-border-hover", "#cbd5e1");
      root.style.setProperty("--color-input-bg", "#f8fafc");
      root.style.setProperty("--color-input-border", "#cbd5e1");
      root.style.setProperty("--color-text-main", "#0f172a");
      root.style.setProperty("--color-text-muted", "#64748b");
      root.style.setProperty("--color-error-bg", "#fef2f2");
      root.style.setProperty("--color-error-border", "#fee2e2");
      root.style.setProperty("--color-error-text", "#dc2626");
      root.style.setProperty("--color-success-bg", "#f0fdf4");
      root.style.setProperty("--color-success-border", "#dcfce7");
      root.style.setProperty("--color-success-text", "#16a34a");
      root.style.setProperty("--color-page-bg", "radial-gradient(circle at 15% 0%, rgba(253,199,0,0.04), transparent 40%), radial-gradient(circle at 85% 100%, rgba(253,199,0,0.02), transparent 45%), #f4f6f8");
    } else {
      root.style.setProperty("--color-bg", "#000000");
      root.style.setProperty("--color-sidebar", "#0a0a0a");
      root.style.setProperty("--color-card", "#0a0a0a");
      root.style.setProperty("--color-card-border", "#1c1c1c");
      root.style.setProperty("--color-card-border-hover", "#2c2c2c");
      root.style.setProperty("--color-input-bg", "#121212");
      root.style.setProperty("--color-input-border", "#232323");
      root.style.setProperty("--color-text-main", "#ffffff");
      root.style.setProperty("--color-text-muted", "#8a8a8a");
      root.style.setProperty("--color-error-bg", "#220d0e");
      root.style.setProperty("--color-error-border", "#3a1416");
      root.style.setProperty("--color-error-text", "#ff583c");
      root.style.setProperty("--color-success-bg", "#0d2214");
      root.style.setProperty("--color-success-border", "#163a1e");
      root.style.setProperty("--color-success-text", "#4ade80");
      root.style.setProperty("--color-page-bg", "radial-gradient(circle at 15% 0%, rgba(253,199,0,0.05), transparent 40%), radial-gradient(circle at 85% 100%, rgba(253,199,0,0.04), transparent 45%), #000000");
    }
  }, [theme]);

  // Dil secimi kaydetme effekti
  useEffect(() => {
    localStorage.setItem("copcoin_lang", lang);
  }, [lang]);

  // Tema veya Dil değiştiğinde pürüzsüz geçiş için yükleme ekranını tetikleyen yardımcı fonksiyon
  const triggerTransition = (actionCallback) => {
    setShowLoadingScreen(true);
    actionCallback();
    setTimeout(() => {
      setShowLoadingScreen(false);
    }, 1200); 
  };

  const handleAuthed = (s) => {
    setSession(s);
    setExpiredNotice(false);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setShowLoadingScreen(true);
    setTimeout(() => setShowLoadingScreen(false), 2000); 
  };

  const handleLogout = async () => {
    try {
      await apiFetch(`${API_BASE}/api/auth/logout`, { method: "POST" });
    } catch (e) {}
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("copcoin_view");          
    sessionStorage.removeItem("copcoin_selected_coin");  
    setSession(null);
  };

  const handleAccountDeleted = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  useEffect(() => {
    sessionExpiredHandler = () => {
      sessionStorage.removeItem(SESSION_KEY);
      setSession(null);
      setExpiredNotice(true);
    };
    return () => { sessionExpiredHandler = null; };
  }, []);

  const numberInputStyle = (
    <style>{`
      input[type=number]::-webkit-outer-spin-button,
      input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type=number] {
        -moz-appearance: textfield;
      }
      @keyframes copcoin-dot-pulse {
        0%, 100% { opacity: 0.45; transform: scale(0.85); }
        50% { opacity: 1; transform: scale(1.1); }
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 0px; 
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-input-border, #2c2c2c);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-text-muted, #8a8a8a);
      }
    `}</style>
  );

  if (!session) return (<>{numberInputStyle}{showLoadingScreen && <LoadingScreen />}<AuthScreen onAuthed={handleAuthed} expiredNotice={expiredNotice} lang={lang} setLang={(l) => triggerTransition(() => setLang(l))} theme={theme} setTheme={(th) => triggerTransition(() => setTheme(th))} /></>);
  if (showLoadingScreen) return (<>{numberInputStyle}<LoadingScreen /></>);
  return (
    <>
      {numberInputStyle}
      <Dashboard
        session={session}
        onLogout={handleLogout}
        onAccountDeleted={handleAccountDeleted}
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        triggerTransition={triggerTransition}
      />
    </>
  );
}