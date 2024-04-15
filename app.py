from flask import Flask, send_from_directory
from config import db  # Import db from config
from routes.location_routes import location_blueprint
from routes.visit_routes import visit_blueprint
from routes.microscopy_routes import microscopy_blueprint

app = Flask(__name__, static_folder='./research-data-manager/build', static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize the database with the Flask app

# Register blueprints (controllers)
app.register_blueprint(location_blueprint)
app.register_blueprint(visit_blueprint)
app.register_blueprint(microscopy_blueprint)

@app.route('/assets/<path:filename>')
def serve_static(filename):
    return send_from_directory('assets', filename)


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)
