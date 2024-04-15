from flask import Flask, Blueprint, request, jsonify
import os
import json
from werkzeug.utils import secure_filename

microscopy_blueprint = Blueprint('microscopy_blueprint', __name__)

# Directory where schema and images will be stored
SCHEMA_DIR = 'schema'  # Adjust the path as needed
IMAGES_DIR = 'assets/images/reference'
SCHEMA_FILE = 'schema_file.json'  # The name of the schema file

@microscopy_blueprint.route('/api/microscopy/save-schema', methods=['POST'])
def save_schema():
    # Create directories if they don't exist
    if not os.path.exists(SCHEMA_DIR):
        os.makedirs(SCHEMA_DIR)
    if not os.path.exists(IMAGES_DIR):
        os.makedirs(IMAGES_DIR)

    schema = json.loads(request.form['schema'])
    # Save schema in a file
    with open(os.path.join(SCHEMA_DIR, 'schema_file.json'), 'w') as f:
        json.dump(schema, f)

# Save images
    for key in request.files:
        image = request.files[key]
        original_filename = secure_filename(image.filename)  # Secure the filename
        file_extension = os.path.splitext(original_filename)[1]  # Extract file extension
        image_number = key.split('/')[-1]  # Extract image number from the key

        # Construct new filename if needed
        new_filename = f"{image_number}{file_extension}"
        image_path = os.path.join(IMAGES_DIR, key.replace('/', os.sep), new_filename)
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        image.save(image_path)

    return 'Schema and images saved successfully', 200


@microscopy_blueprint.route('/api/microscopy/load-schema', methods=['GET'])
def load_schema():
    try:
        # Construct the full path to the schema file
        schema_path = os.path.join(SCHEMA_DIR, SCHEMA_FILE)

        # Check if the schema file exists
        if not os.path.exists(schema_path):
            return jsonify({'error': 'Schema file not found'}), 404

        # Open and read the schema file
        with open(schema_path, 'r') as file:
            schema = json.load(file)
        
        # Return the schema as JSON
        return jsonify(schema)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
