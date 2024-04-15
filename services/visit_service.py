import json
import os
import glob
from flask import current_app, request
from models.location import Location
from models.visit import Visit

def get_combined_visit_data():
    # Load the schema to identify all fields and image fields
    with open('assets/schema/LocationDataManager.json') as schema_file:
        schema = json.load(schema_file)
        all_fields = list(schema['properties'].keys())
        image_fields = [key for key, value in schema['properties'].items() if value.get('type') == 'array' and value.get('items', {}).get('format') == 'data-url']
    
    # Fetch all visits and related location data
    visits = Visit.query.join(Location, Visit.location_id == Location.id).all()
    combined_data = []

    for visit in visits:
        # Fetch dynamic data from visit
        dynamic_data = json.loads(visit.dynamic_data) if isinstance(visit.dynamic_data, str) else visit.dynamic_data or {}
        
        # Initialize non-existent fields with "No entry"
        for field in all_fields:
            if field not in dynamic_data:
                dynamic_data[field] = "No entry" if field not in image_fields else []

        current_app.logger.info(f'Dynamic Data after initialization: {dynamic_data}')

        # Handle image fields (construct file paths for images)
        for field in image_fields:
            # Construct the directory path for the images
            image_directory = os.path.join('assets', 'images', 'locations', visit.location.location_id, visit.visit_date.strftime('%Y-%m-%d'), field)
            # Find all image files in the directory
            image_filenames = glob.glob(f"{image_directory}/*")
            # Construct URLs with correct forward slashes
            image_urls = [
                request.host_url.rstrip('/') + '/' + '/'.join(filename.split(os.sep))
                for filename in image_filenames
            ]
            # Extend the list with the new URLs
            dynamic_data[field] = image_urls if dynamic_data[field] == "No entry" else dynamic_data[field] + image_urls
            
            for url in image_urls:
                current_app.logger.info(f'Constructed Image URL: {url}')  # Log the URL

        # Combine data
        combined_visit = {
            'location_id': visit.location.location_id,
            'latitude': visit.location.latitude,
            'longitude': visit.location.longitude,
            'visit_date': visit.visit_date.strftime('%Y-%m-%d'),
            **dynamic_data  # Add dynamic data with image URLs and other fields
        }

        combined_data.append(combined_visit)

    return combined_data
