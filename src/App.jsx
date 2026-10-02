import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { translations } from './data/translations'
import { products } from './data/products'

const languageOrder = ['bs', 'en', 'tr']
const categoryOrder = ['dried', 'cheese', 'ajvar', 'juices']

function App() {
  const [language, setLanguage] = useState(() => {
    const saved = window.localStorage.getItem('mezze-language')
    return saved || 'bs'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('dried')
  const [isLoading, setIsLoading] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('mezze-language', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    setIsLoading(true)
    const timer = window.setTimeout(() => setIsLoading(false), 420)
    return () => window.clearTimeout(timer)
  }, [language, activeCategory])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 220)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const t = translations[language]

  const visibleProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [activeCategory],
  )

  return (
    <div className="site-shell">
      <div className={`loading-screen ${isLoading ? 'visible' : ''}`} aria-live="polite" aria-busy={isLoading}>
        <div className="loading-logo">
          <img src="/mezzelogo.png" alt="Mezze Platter Shop logo" />
        </div>
        <span className="loading-text">Mezze</span>
      </div>

      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#home" aria-label="Mezze Platter Shop home">
            <span className="brand-mark">
              <img
                src="/mezzelogo.png"
                alt="Mezze Platter Shop logo"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </span>
            <span className="brand-text">
              <strong>MEZZE</strong>
              <small>PLATTER SHOP</small>
            </span>
          </a>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
            {t.nav.map((item) => (
              <a key={item.key} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}

            <div className="mobile-nav-lang" aria-label="Language selector">
              {languageOrder.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={language === code ? 'active' : ''}
                  onClick={() => {
                    setLanguage(code)
                    setMenuOpen(false)
                  }}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>

          <div className="nav-tools">
            <div className="lang-switch" aria-label="Language selector">
              {languageOrder.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={language === code ? 'active' : ''}
                  onClick={() => setLanguage(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-media" style={{ backgroundImage: "url('/heroimage.JPG')" }} />
          <div className="hero-overlay" />

          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">{t.hero.eyebrow}</p>
              <h1>{t.hero.title}</h1>
              <p className="hero-subtitle">{t.hero.subtitle}</p>

              <div className="cta-row">
                <a href="#products" className="primary-btn">
                  {t.hero.primaryButton}
                </a>
                <a href="#about" className="secondary-btn">
                  {t.hero.secondaryButton}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="section">
          <div className="section-heading">
            <p className="eyebrow">{t.products.eyebrow}</p>
            <h2>{t.products.heading}</h2>
            <p>{t.products.subheading}</p>
          </div>

          <div className="category-tabs" role="tablist" aria-label="Product categories">
            {categoryOrder.map((category) => {
              const categoryMeta = t.categories[category]

              return (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? 'category-tab active' : 'category-tab'}
                  onClick={() => setActiveCategory(category)}
                >
                  <span>{categoryMeta.title}</span>
                  <small>{categoryMeta.subtitle}</small>
                </button>
              )
            })}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => {
              const name = product.name[language]
              const description = product.description?.[language] || ''

              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={name} />
                    ) : (
                      <div className="placeholder-box">{t.products.placeholder}</div>
                    )}
                  </div>

                  <div className="product-body">
                    <h3>{name}</h3>
                    {description ? <p>{description}</p> : null}

                    {(product.price || product.unit) && (
                      <div className="product-meta">
                        {product.price ? <span className="price">{product.price}</span> : null}
                        {product.unit ? <span className="unit">{product.unit}</span> : null}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="about-grid">
            <div className="about-copy">
              <p className="eyebrow">{t.about.eyebrow}</p>
              <h2>{t.about.title}</h2>
              <p>{t.about.text}</p>

              <div className="about-badges">
                {t.about.points.map((point) => (
                  <span key={point}>{point}</span>
                ))}
              </div>
            </div>

            <div className="about-visual">
              <div className="about-main-image" style={{ backgroundImage: "url('/heroimage.JPG')" }} />
              <div className="about-mini-card">
                <span>{t.about.badge}</span>
                <strong>{t.about.location}</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-card">
            <div className="contact-copy">
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.text}</p>
            </div>

            <div className="contact-info">
              <div>
                <span>{t.contact.address}</span>
                <strong>{t.contact.location}</strong>
              </div>
              <div>
                <span>{t.contact.city}</span>
                <strong>{t.contact.cityValue}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <button
        type="button"
        className={`scroll-top-btn ${showBackToTop ? 'visible' : ''}`}
        aria-label="Vrati na početak"
        onClick={scrollToTop}
      >
        <span>Vrati na početak</span>
      </button>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/mezzelogo.png" alt="Mezze Platter Shop logo" />
            <div>
              <strong>MEZZE PLATTER SHOP</strong>
              <span>{t.footer.location}</span>
            </div>
          </div>

          <div className="footer-links">
            {t.nav.map((item) => (
              <a key={item.key} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="footer-lang" aria-label="Language switcher">
            {languageOrder.map((code) => (
              <button
                key={code}
                type="button"
                className={language === code ? 'active' : ''}
                onClick={() => setLanguage(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
