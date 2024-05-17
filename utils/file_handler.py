import os
from werkzeug.utils import secure_filename

def save_uploaded_files(files, location_id, visit_date):
    """
    Save uploaded files in the specified directory structure.
    files: Dict of uploaded files
    location_id: ID of the location
    visit_date: Date of the visit
    Returns a dict mapping field names to saved file paths.
    """
    saved_paths = {}
    for field_name, uploaded_files in files.items():
        for i, file in enumerate(uploaded_files):
            # Validate file type here if necessary
            # e.g., if not allowed_file(file.filename): continue

            filename = secure_filename(file.filename)
            save_path = os.path.join('images', str(location_id), str(visit_date), field_name, str(i + 1))
            try:
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                file.save(save_path)
                saved_paths.setdefault(field_name, []).append(save_path)
            except Exception as e:
                # Handle exceptions (e.g., logging)
                print(f"Error saving file {filename}: {e}")
    return saved_paths

