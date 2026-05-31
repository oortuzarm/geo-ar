# Changes to the GeoPoint serializer (Blueprint, Blueprinter, or ActiveModel::Serializer).
# Add these fields to the existing serializer:

# If using Blueprinter:
field :activation_mode
field :activation_polygon

# If using ActiveModel::Serializer:
attributes :activation_mode, :activation_polygon

# If using a manual as_json / to_h approach, add to the hash:
# activation_mode:    activation_mode,
# activation_polygon: activation_polygon,
