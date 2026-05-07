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
  // ── Pin marker ─────────────────────────────────────────────────────────────
  marker: {
    /** Outer circle diameter in px */
    size:                44,
    /** Default white border for all pins */
    borderColor:         'rgba(255,255,255,0.9)',
    borderWidth:         2.5,
    /** Cyan border for the selected pin */
    selectedBorderColor: '#0ea5e9',
    selectedBorderWidth: 3,
    /** Glow ring that appears on the selected pin */
    glowColor:           'rgba(14,165,233,0.45)',
    glowSize:            4,
    /** Drop-shadow on every pin */
    shadow:              '0 2px 10px rgba(0,0,0,0.5)',
    /** Background shown when the point has no thumbnail image */
    fallbackBg:          '#0f172a',   // dark navy — premium feel
    /** Background for inactive points (editor only) */
    inactiveBg:          '#1f2937',   // dark gray
    /** Opacity of pins that are NOT selected while another point IS selected */
    dimOpacity:          0.45,
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
