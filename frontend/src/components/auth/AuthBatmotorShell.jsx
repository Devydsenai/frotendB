import imgPages from "@/assets/imgPages.svg";

/**
 * Duas colunas: hero + ilustração | card (login / cadastro).
 * @param {string} [brandLogo] — ex.: cadastro com marca no hero (esquerda).
 * @param {string} [brandTagline] — texto abaixo do logo.
 */
function AuthBatmotorShell({
  heroTitle,
  heroSub,
  heroTitleId = "batmotor-hero-title",
  brandLogo,
  brandTagline,
  children
}) {
  const showBrand = Boolean(brandLogo);

  return (
    <div className="login-batmotor">
      <div className="login-batmotor__layout">
        <section
          className={`login-batmotor__hero${showBrand ? " login-batmotor__hero--with-brand" : ""}`}
          aria-labelledby={heroTitleId}
        >
          {showBrand ? (
            <div className="login-batmotor__hero-brand">
              <img src={brandLogo} alt="Batmotor" className="login-batmotor__hero-brand-img" decoding="async" />
              {brandTagline ? <p className="login-batmotor__hero-brand-tag">{brandTagline}</p> : null}
            </div>
          ) : null}

          {heroTitle ? (
            <h2
              id={heroTitleId}
              className={showBrand ? "visually-hidden" : "login-batmotor__hero-title"}
            >
              {heroTitle}
            </h2>
          ) : (
            <h2 id={heroTitleId} className="visually-hidden">
              Batmotor
            </h2>
          )}

          {!showBrand && heroSub ? <p className="login-batmotor__hero-sub">{heroSub}</p> : null}

          <div className="login-batmotor__hero-art-wrap">
            <img src={imgPages} alt="" className="login-batmotor__hero-art" decoding="async" />
          </div>
        </section>

        <div className="login-batmotor__aside">{children}</div>
      </div>
    </div>
  );
}

export default AuthBatmotorShell;
