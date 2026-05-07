import L from 'leaflet'
import { mapTheme } from './mapTheme'

const m = mapTheme.marker

const FALLBACK_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
  `width="20" height="20" fill="rgba(255,255,255,0.85)">` +
  `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13` +
  `c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 ` +
  `2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>` +
  `</svg>`

/**
 * Creates a bubble-card marker icon for both the editor and public map.
 *
 * Shape: rounded-rect card + downward CSS-triangle pointer.
 * The pointer tip maps to the lat/lng via iconAnchor.
 *
 * @param selected - true → cyan border + glow
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
  const { cardWidth: cw, cardHeight: ch, pointerH: ph, pointerHW: phw, cardRadius: cr } = m

  const totalH = ch + ph
  const halfCw = cw / 2

  // Border
  const borderWidth = selected ? m.selectedBorderWidth : m.borderWidth
  const borderColor = selected ? m.selectedBorderColor : m.borderColor

  // drop-shadow traces the composite shape (card + pointer triangle)
  const shadowFilter = selected
    ? `drop-shadow(0 3px 8px rgba(0,0,0,0.6)) drop-shadow(0 0 0 ${m.glowSize}px ${m.glowColor})`
    : `drop-shadow(0 3px 8px rgba(0,0,0,0.55))`

  const opacity =
    dimmed && !selected ? m.dimOpacity :
    !active && !selected ? 0.5 :
    1

  const bg = active ? m.fallbackBg : m.inactiveBg

  const inner = image
    ? `<img src="${image}" style="width:100%;height:100%;object-fit:cover;display:block;">`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${FALLBACK_SVG}</div>`

  // The pointer triangle must match the card border color so it looks seamless.
  // We achieve the filled-triangle look with two stacked borders:
  //   outer: borderColor (same as card border)
  //   inner (inset 1px): bg color — creates the card-fill effect on the pointer
  // Simpler approach: just a solid colored triangle matching the border, with
  // a slightly smaller inner triangle in bg color offset 1px down.
  const outerTriangle =
    `<div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);` +
    `width:0;height:0;` +
    `border-left:${phw}px solid transparent;` +
    `border-right:${phw}px solid transparent;` +
    `border-top:${ph}px solid ${borderColor};` +
    `"></div>`

  // Inner fill triangle — sits 1px above, slightly narrower, fills with bg color
  // so only the border edge of the outer triangle remains visible
  const innerTriangleOffset = 1
  const innerPhw = phw - Math.round(borderWidth * 0.7)
  const innerPh  = ph  - innerTriangleOffset
  const innerTriangle =
    `<div style="position:absolute;bottom:${innerTriangleOffset}px;left:50%;transform:translateX(-50%);` +
    `width:0;height:0;` +
    `border-left:${innerPhw}px solid transparent;` +
    `border-right:${innerPhw}px solid transparent;` +
    `border-top:${innerPh}px solid ${bg};` +
    `"></div>`

  const html =
    `<div style="` +
    `position:relative;` +
    `width:${cw}px;height:${totalH}px;` +
    `opacity:${opacity};` +
    `filter:${shadowFilter};` +
    `">` +
    // Card
    `<div style="` +
    `width:${cw}px;height:${ch}px;` +
    `border-radius:${cr}px;` +
    `overflow:hidden;` +
    `background:${bg};` +
    `border:${borderWidth}px solid ${borderColor};` +
    `box-sizing:border-box;` +
    `">${inner}</div>` +
    outerTriangle +
    innerTriangle +
    `</div>`

  return L.divIcon({
    className:   '',
    html,
    iconSize:    [cw, totalH],
    iconAnchor:  [halfCw, totalH],   // pointer tip maps to lat/lng
    popupAnchor: [0, -(totalH + 4)],
  })
}
