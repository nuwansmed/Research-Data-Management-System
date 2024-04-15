import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, render_template, redirect, url_for, jsonify

from models.sample import Sample
from services.sample_service import create_sample, get_all_sample_ids

sample_routes = Blueprint('sample_routes', __name__)



ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@sample_routes.route('/sample_data_manager', methods=['GET', 'POST'])
def sample_data_manager():
    if request.method == 'POST':
        try:
            # Form data handling
            location_id = request.form.get('locationId')
            sample_id = request.form.get('sampleId')  # Adjusted to match JavaScript
            sample_number = request.form.get('sampleNumber')
            tree_number = request.form.get('treeNumber')
        

            # Call the service layer to handle business logic
            create_sample(sample_id, location_id, tree_number, sample_number)

            # File upload handling
            if 'files' in request.files:
                files = request.files.getlist('files')
                sample_dir = os.path.join('images', 'samples', sample_id)
                os.makedirs(sample_dir, exist_ok=True)

                for index, file in enumerate(files):
                    if file and file.filename and allowed_file(file.filename):
                        filename = secure_filename(file.filename)
                        new_filename = f'{sample_id}_{index+1}.{filename.rsplit(".", 1)[1].lower()}'
                        file.save(os.path.join(sample_dir, new_filename))
                    else:
                        return jsonify({'status': 'error', 'message': 'Invalid file type'})

            # Return JSON response
            return jsonify({'status': 'success', 'sampleId': sample_id})

        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)})

    return render_template('sample_data_manager.html')

@sample_routes.route('/api/samples/ids', methods=['GET'])
def get_sample_ids():
    sample_ids = get_all_sample_ids()
    return jsonify(sample_ids)