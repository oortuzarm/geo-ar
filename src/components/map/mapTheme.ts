/**
 * Central visual token system for all map markers and activation radii.
 *
 * ── How to use ──────────────────────────────────────────────────────────────
 *   import { mapTheme } from './mapTheme'
 *   const { marker: m, activationRadius: ar } = mapTheme
 *
 * ── Future theming ──────────────────────────────────────────────────────────
 *   This object is the single integration point for per-project branding.
 *   When custom colors are added, override or replace `mapTheme` at the call
 *   site (e.g. per-project, per-tenant) — no other file needs to change.
 *   UI for customisation is NOT implemented yet; this is architectural prep.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Shape of an activation-radius circle's Leaflet PathOptions subset. */
export interface RadiusStyle {
  color:       string
  fillColor:   string
  fillOpacity: number
  weight:      number
  opacity:     number
}

export const mapTheme = {
  // ── Bubble-card marker ────────────────────────────────────────────────────
  marker: {
    /** Card width in px */
    cardWidth:           64,
    /** Card height in px (rounded rect, above the pointer) */
    cardHeight:          52,
    /** Downward pointer triangle height in px */
    pointerH:            10,
    /** Pointer half-width in px (each side of the triangle) */
    pointerHW:           8,
    /** Card corner radius in px */
    cardRadius:          12,
    /** Default white border */
    borderColor:         'rgba(255,255,255,0.92)',
    borderWidth:         2.5,
    /** Cyan border for the selected pin */
    selectedBorderColor: '#0ea5e9',
    selectedBorderWidth: 3.5,
    /** Glow blur radius in px — used as drop-shadow blur for the selected state */
    glowColor:           'rgba(14,165,233,0.70)',
    glowSize:            8,
    /** Drop-shadow on every pin — passed directly to drop-shadow() filter */
    shadow:              '0 4px 12px rgba(0,0,0,0.55)',
    /** Background for fallback (no image) — softer navy, less dominant */
    fallbackBg:          '#1a2d48',
    /** Background for inactive points (editor only) */
    inactiveBg:          '#1f2937',
    /** Opacity of pins that are NOT selected while another point IS selected */
    dimOpacity:          0.40,
  },

  // ── Activation-radius circles ──────────────────────────────────────────────
  activationRadius: {
    /** Unselected, nothing else selected — full red */
    default: {
      color:       '#ef4444',
      fillColor:   '#ef4444',
      fillOpacity: 0.07,
      weight:      1,
      opacity:     0.70,
    } as RadiusStyle,

    /** Selected point — cyan, prominent */
    selected: {
      color:       '#0ea5e9',
      fillColor:   '#0ea5e9',
      fillOpacity: 0.18,
      weight:      3,
      opacity:     1,
    } as RadiusStyle,

    /** Unselected while another point IS selected — faded red */
    dimmed: {
      color:       '#ef4444',
      fillColor:   '#ef4444',
      fillOpacity: 0.03,
      weight:      1,
      opacity:     0.35,
    } as RadiusStyle,
  },
}
