# Changes to GeoPointsController (or whichever controller handles geo_point params).
# Add the new fields to the existing strong params permit list:

def geo_point_params
  params.require(:geo_point).permit(
    # ... existing permitted fields ...
    :activation_mode,
    activation_polygon: {}   # JSONB — permit as a nested hash
  )
end

# If geo_points are submitted nested inside a geo_project sync payload,
# add to the geo_project sync strong params instead:
#
# geo_points: [
#   :id, :name, :latitude, :longitude, :activation_radius,
#   # ... other existing fields ...
#   :activation_mode,
#   activation_polygon: {}
# ]
