# Changes to app/models/geo_point.rb
# Add to the existing model:

ACTIVATION_MODES = %w[radius polygon].freeze

validates :activation_mode, inclusion: { in: ACTIVATION_MODES }
validates :activation_polygon, presence: true, if: -> { activation_mode == "polygon" }

validate :activation_polygon_is_valid_geojson, if: -> { activation_mode == "polygon" && activation_polygon.present? }

private

def activation_polygon_is_valid_geojson
  geom = activation_polygon
  unless geom.is_a?(Hash) &&
         geom["type"] == "Feature" &&
         geom.dig("geometry", "type").in?(%w[Polygon MultiPolygon]) &&
         geom.dig("geometry", "coordinates").is_a?(Array)
    errors.add(:activation_polygon, "must be a valid GeoJSON Feature with Polygon or MultiPolygon geometry")
  end
end
