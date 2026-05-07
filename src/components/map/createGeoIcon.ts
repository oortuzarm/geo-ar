import L from 'leaflet'

/**
 * Shared factory for the teardrop pin used in both the editor and the public map.
 *
 * @param selected - true when this point is the currently selected/focused pin
 * @param active   - false renders a gray pin (inactive point in the editor)
 * @param dimmed   - true renders the pin at reduced opacity (unselected while another is focused)
 */
export function createGeoIcon(
  selected: boolean,
  active: boolean,
  dimmed = false,
): L.DivIcon {
  const color  = !active ? '#6b7280' : selected ? '#0ea5e9' : '#ef4444'
  const ring   = selected ? 'box-shadow: 0 0 0 3px rgba(14,165,233,0.5);' : ''
  const opacity = dimmed && !selected ? 'opacity: 0.4;' : ''

  return L.divIcon({
    className: '',
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid rgba(255,255,255,0.8);
      ${ring}
      ${opacity}
    "></div>`,
    iconSize:     [28, 28],
    iconAnchor:   [14, 28],
    popupAnchor:  [0, -32],
  })
}
