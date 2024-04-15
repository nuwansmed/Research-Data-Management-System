from flask import Blueprint, request, jsonify
from models.location import Location
from models.visit import Visit
from config import db
from datetime import datetime
import json
import os

location_blueprint = Blueprint('location_blueprint', __name__)

def add_visit(location_id, visit_date, dynamic_data, visit_files):
    new_visit = Visit(location_id=location_id, visit_date=datetime.strptime(visit_date, '%Y-%m-%d'), dynamic_data=json.dumps(dynamic_data))
    db.session.add(new_visit)
    db.session.commit()
    
    # Handle file uploads for visit
    saved_visit_files = save_uploaded_visit_files(visit_files, location_id, visit_date, new_visit.id)
    # Update dynamic_data with saved file paths for visit
    # ...

    return new_visit

def save_uploaded_location_files(files, location_id):
    saved_files = {}

    for field, file_list in files.lists():
        saved_files[field] = []
        for i, file in enumerate(file_list):
            filename = f"{i+1}.jpg"
            save_path = os.path.join('assets', 'images', 'locations', location_id, 'files', field)
            os.makedirs(save_path, exist_ok=True)
            file.save(os.path.join(save_path, filename))
            saved_files[field].append(filename)

    return saved_files

def save_uploaded_visit_files(files, location_id, visit_date, visit_id):
    saved_files = {}

    location = Location.query.filter_by(id=location_id).first()
    location_name = location.location_id if location else 'unknown'

    for field, file_list in files.lists():
        saved_files[field] = []
        for i, file in enumerate(file_list):
            filename = f"{i+1}.jpg"
            save_path = os.path.join('assets', 'images', 'locations', location_name, visit_date, field[5:])
            os.makedirs(save_path, exist_ok=True)
            file.save(os.path.join(save_path, filename))
            saved_files[field].append(filename)
    
    return saved_files

@location_blueprint.route('/api/locations', methods=['POST'])
def add_location():
    is_previous_location = request.form.get('isPreviousLocation') == 'true'
    location_id = request.form.get('locationID')
    visit_date = request.form.get('visitDate')
    dynamic_data = json.loads(request.form.get('dynamicData', '{}'))

    location_files = {key: value for key, value in request.files.items() if key.startswith('location_')}
    visit_files = {key: value for key, value in request.files.items() if key.startswith('visit_')}

    if not is_previous_location:
        latitude = float(request.form.get('latitude'))
        longitude = float(request.form.get('longitude'))
        
        new_location = Location(location_id=location_id, latitude=latitude, longitude=longitude)
        db.session.add(new_location)
        db.session.commit()
        location_id = new_location.id

        # Save files related to location
        save_uploaded_location_files(location_files, location_id)

    # Add visit (for both new and existing locations)
    add_visit(location_id, visit_date, dynamic_data, visit_files)

    return jsonify({'message': 'Location and visit added successfully'}), 201


# ... other routes and helper methods ...

@location_blueprint.route('/api/locations/ids', methods=['GET'])
def get_location_ids():
    locations = Location.query.all()
    location_ids = [{'key': str(loc.id), 'value': str(loc.id), 'text': loc.location_id} for loc in locations]
    return jsonify(location_ids)


@location_blueprint.route('/api/locations/next-index', methods=['GET'])
def get_next_location_index():
    # Query the highest index (assuming `id` is the auto-incrementing primary key)
    max_id = db.session.query(db.func.max(Location.id)).scalar()
    next_index = (max_id or 0) + 1
    return jsonify({'nextIndex': next_index})


@location_blueprint.route('/api/combined-visits', methods=['GET'])
def combined_visits():
      
    data = get_combined_visit_data()
    return jsonify(data)