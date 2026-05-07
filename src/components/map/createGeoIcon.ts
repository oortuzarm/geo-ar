import L from 'leaflet'
import { mapTheme } from './mapTheme'

const m = mapTheme.marker

// Minimal map-pin SVG used as the fallback icon when a point has no image.
// Rendered white on the dark-navy background.
const FALLBACK_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
  `width="20" height="20" fill="rgba(255,255,255,0.85)">` +
  `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13` +
  `c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 ` +
  `2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>` +
  `</svg>`

/**
 * Creates a circular thumbnail marker icon for both the editor and public map.
 *
 * @param selected - true → cyan border + glow ring
 * @param active   - false → dark-gray background (inactive, editor only)
 * @param dimmed   - true → reduced opacity (unselected while another is focused)
 * @param image    - optional thumbnail URL or base64; falls back to navy + pin icon
 */
export function createGeoIcon(
  selected: boolean,
  active:   boolean,
  dimmed  = false,
  image?:  string,
): L.DivIcon {
  const size  = m.size
  const half  = size / 2

  // Border
  const borderWidth = selected ? m.selectedBorderWidth : m.borderWidth
  const borderColor = selected ? m.selectedBorderColor : m.borderColor

  // Shadow + optional glow ring
  const glow      = selected ? `, 0 0 0 ${m.glowSize}px ${m.glowColor}` : ''
  const boxShadow = `${m.shadow}${glow}`

  // Opacity: dim if unselected while another point is selected;
  //          slightly fade inactive points in the editor.
  const opacity =
    dimmed && !selected ? m.dimOpacity :
    !active && !selected ? 0.5 :
    1

  const bg = active ? m.fallbackBg : m.inactiveBg

  // Inner content: thumbnail or centered fallback icon
  const inner = image
    ? `<img src="${image}" style="width:100%;height:100%;object-fit:cover;display:block;">`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${FALLBACK_SVG}</div>`

  // Single-div approach: overflow:hidden clips the image into a circle;
  // box-shadow (incl. glow) is painted outside the border box and is NOT
  // clipped by overflow:hidden on the same element.
  const html =
    `<div style="` +
    `width:${size}px;height:${size}px;` +
    `border-radius:50%;` +
    `overflow:hidden;` +
    `background:${bg};` +
    `border:${borderWidth}px solid ${borderColor};` +
    `box-sizing:border-box;` +
    `box-shadow:${boxShadow};` +
    `opacity:${opacity};` +
    `">${inner}</div>`

  return L.divIcon({
    className:   '',
    html,
    iconSize:    [size, size],
    iconAnchor:  [half, half],   // center of circle maps to lat/lng
    popupAnchor: [0, -(half + 8)],
  })
}
