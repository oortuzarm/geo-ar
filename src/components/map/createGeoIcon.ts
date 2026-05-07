import L from 'leaflet'
import { mapTheme } from './mapTheme'

const m = mapTheme.marker

// Softer icon opacity (0.50) so fallback navy cards feel quieter than thumbnails.
const FALLBACK_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
  `width="22" height="22" fill="rgba(255,255,255,0.50)">` +
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
 * @param selected - true → cyan border + glow + subtle scale-up
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

  // filter: drop-shadow traces the full composite shape (card + pointer).
  // Selected gets an additional glow layer on top.
  const shadowFilter = selected
    ? `drop-shadow(${m.shadow}) drop-shadow(0 0 ${m.glowSize}px ${m.glowColor})`
    : `drop-shadow(${m.shadow})`

  // Selected cards scale up slightly from the pointer tip (transform-origin: bottom center).
  // This gives visual elevation without changing the hit area or anchor.
  const transform = selected
    ? 'transform:scale(1.08);transform-origin:50% 100%;'
    : ''

  const opacity =
    dimmed && !selected ? m.dimOpacity :
    !active && !selected ? 0.5 :
    1

  const bg = active ? m.fallbackBg : m.inactiveBg

  const inner = image
    ? `<img src="${image}" style="width:100%;height:100%;object-fit:cover;display:block;">`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${FALLBACK_SVG}</div>`

  // Two-layer triangle pointer:
  //   outer — full triangle in borderColor
  //   inner — slightly smaller triangle in bg, offset 1px up
  // Net result: a triangle that looks like it has the card's border on its edges.
  const innerTriangleOffset = 1
  const innerPhw = phw - Math.round(borderWidth * 0.7)
  const innerPh  = ph  - innerTriangleOffset

  const outerTriangle =
    `<div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);` +
    `width:0;height:0;` +
    `border-left:${phw}px solid transparent;` +
    `border-right:${phw}px solid transparent;` +
    `border-top:${ph}px solid ${borderColor};` +
    `"></div>`

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
    `${transform}` +
    `">` +
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
