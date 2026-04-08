import { useEffect, useState } from "react";
import batmotorLogo from "@/assets/BATMOTORLogo.svg";
import AuthBatmotorShell from "@/components/auth/AuthBatmotorShell";
import { getUseMock } from "@/api/client.js";

const REMEMBER_EMAIL_KEY = "batmotor-remember-email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidLoginEmail(s) {
  const t = String(s || "").trim();
  return t.length > 0 && EMAIL_RE.test(t);
}

function mapLoginError(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const msg = data?.message ?? data?.error;
  if (status === 400) {
    const flat = data?.issues?.formErrors;
    if (Array.isArray(flat) && flat.length) return flat.join(" ");
    return msg || "Dados inválidos. Confira e-mail e senha.";
  }
  if (status === 401) {
    return msg || "E-mail ou senha incorretos.";
  }
  if (status === 403) {
    return msg || "Acesso não permitido para este usuário.";
  }
  if (status === 500) {
    return msg || "Erro no servidor. Tente novamente em instantes.";
  }
  if (!err?.response && (err?.code === "ECONNABORTED" || err?.message?.includes?.("timeout"))) {
    return getUseMock()
      ? "Tempo esgotado. Tente de novo."
      : "A API demorou demais ou não respondeu. Confira se o backend está rodando.";
  }
  if (!err?.response) {
    if (err?.message === "Credenciais invalidas") {
      return "E-mail ou senha incorretos.";
    }
    return getUseMock()
      ? "Não foi possível entrar. Confira e-mail e senha."
      : "Servidor indisponível. Tente mais tarde ou confira se a API da empresa está no ar.";
  }
  return msg || "Não foi possível entrar. Tente novamente.";
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [error, setError] = useState("");
  const [forgotHint, setForgotHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (saved && isValidLoginEmail(saved)) {
        setEmail(String(saved).trim().toLowerCase());
        setRemember(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    if (!isValidLoginEmail(email)) {
      setError("E-mail inválido.");
      return;
    }
    setError("");
    setForgotHint(false);
    setIsLoading(true);
    const fallbackName = "Usuário";
    try {
      await onLogin({
        email: email.trim().toLowerCase(),
        password,
        fallbackName
      });
      try {
        if (remember) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY);
        }
      } catch {
        /* ignore */
      }
    } catch (_err) {
      setError(mapLoginError(_err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBatmotorShell
      heroTitle="BEM-VINDO (A) PAINEL BATMOTORES"
      heroSub="central de dados em tempo real"
      heroTitleId="login-hero-title"
    >
      <div className="login-batmotor__card">
        <header className="login-batmotor__header">
          <h1 className="visually-hidden">Batmotor — entrar</h1>
          <img src={batmotorLogo} alt="Batmotor" className="login-batmotor__logo-img" />
          <p className="login-batmotor__tagline">Motores e Baterias</p>
        </header>

        <form className="login-batmotor__form" onSubmit={handleSubmit} noValidate>
          <p className="login-batmotor__hint small text-muted" style={{ marginBottom: "1rem" }}>
            Use o e-mail e a senha cadastrados no sistema (o perfil ADMIN, GERENTE ou FUNCIONÁRIO vem do cadastro,
            não é escolhido aqui).
          </p>

          <div className="login-batmotor__field">
            <span className="login-batmotor__field-icon" aria-hidden>
              <i className="ri-mail-line" />
            </span>
            <input
              id="login-email"
              className="login-batmotor__input"
              type="email"
              autoComplete="username"
              placeholder="E-mail corporativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="E-mail corporativo"
            />
          </div>

          <div className="login-batmotor__field">
            <span className="login-batmotor__field-icon" aria-hidden>
              <i className="ri-lock-2-line" />
            </span>
            <input
              id="login-password"
              className="login-batmotor__input login-batmotor__input--has-toggle"
              type={pwdVisible ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Senha"
            />
            <button
              type="button"
              className="login-batmotor__toggle-pwd"
              onClick={() => setPwdVisible((v) => !v)}
              aria-label={pwdVisible ? "Ocultar senha" : "Mostrar senha"}
            >
              <i className={pwdVisible ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden />
            </button>
          </div>

          <div className="login-batmotor__options">
            <label className="login-batmotor__remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Lembrar e-mail neste dispositivo</span>
            </label>
            <button
              type="button"
              className="login-batmotor__link"
              onClick={() => {
                setForgotHint((v) => !v);
                setError("");
              }}
            >
              Esqueceu a senha?
            </button>
          </div>

          {forgotHint ? (
            <p className="login-batmotor__hint" role="status">
              Recuperação de senha automática ainda não está disponível. Peça a um administrador para redefinir seu
              acesso no sistema.
            </p>
          ) : null}

          {error ? <p className="login-batmotor__error">{error}</p> : null}

          <button className="login-batmotor__btn login-batmotor__btn--submit" type="submit" disabled={isLoading}>
            {isLoading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>
      </div>
    </AuthBatmotorShell>
  );
}

export default LoginPage;
