**File `theme.css`**
(application theme / design tokens)

*Questo file definisce il tema grafico globale dell’applicazione tramite CSS variables.*

**Serve per:**
- centralizzare colori, spaziature e valori di stile
- garantire coerenza visiva tra tutte le pagine e componenti
- facilitare modifiche future al design (theme-based)
- fornire variabili riutilizzabili a CSS custom e componenti UI
- separare il **design system** dalla logica applicativa

-----------------------------------------------------------------------------------------------------

**Scope**
- le variabili sono definite in `:root`
- sono quindi **globali** e disponibili in tutta l’app
- possono essere usate in:
  - `index.css`
  - CSS dei componenti
  - layout (`AppNavbar`, cards, offcanvas, ecc.)

-----------------------------------------------------------------------------------------------------

**Color Palette**
*Colori principali del brand*

- `--brand-900: #2d3038`
  - colore principale scuro (navbar, header, elementi chiave)
- `--brand-700: #3d5684`
  - variante scura secondaria
- `--brand-600: #6a7194`
  - colore intermedio
- `--brand-500: #5e586f`
  - colore neutro/secondario
- `--brand-400: #895e72`
  - accento (hover, badge, highlight)

-----------------------------------------------------------------------------------------------------

**Background & Text**
*Colori di base dell’interfaccia*

- `--bg: #f6f7fb`
  - background principale dell’app
- `--card: #ffffff`
  - background card e contenitori
- `--text: #1f2430`
  - colore testo principale
- `--muted: #6b7280`
  - testo secondario / descrizioni

-----------------------------------------------------------------------------------------------------

**Layout & UI Tokens**
*Variabili per struttura e componenti*

- `--radius: 14px`
  - border-radius standard (card, modali, bottoni)
- `--shadow: 0 10px 24px rgba(0,0,0,.10)`
  - ombra standard per card e overlay
- `--overlay-light: 255 255 255`
  - base RGB per overlay chiari (es. rgba)
- `--overlay-dark: 45 48 56`
  - base RGB per overlay scuri

-----------------------------------------------------------------------------------------------------

**Drawer / Layout laterale**
*Usato per menu offcanvas / push layout*

- `--drawer-w: 260px`
  - larghezza drawer laterale
- `--drawer-gap: 24px`
  - spazio di spostamento del contenuto
- `--content-max: 1200px`
  - larghezza massima del contenuto centrale

-----------------------------------------------------------------------------------------------------

**Global styles**
*Stili base applicati al `body`*

- reset margini:
  - `margin: 0`
- applicazione tema:
  - `background: var(--bg)`
  - `color: var(--text)`

Questo garantisce:
- colore coerente su tutta l’app
- nessuna dipendenza dal browser default

-----------------------------------------------------------------------------------------------------

**Integrazione nell’app**
Il file `theme.css` viene importato **una sola volta** nel punto di bootstrap:

```ts
import "./css/theme.css";
