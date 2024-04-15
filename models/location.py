from config import db  # Import db from config

class Location(db.Model):
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    location_id = db.Column(db.String(120), unique=True, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    time_stable_data = db.Column(db.JSON)  # New column for storing time-stable data as JSON

    # Relationship with Visit
    visits = db.relationship('Visit', backref='location', lazy=True)

    def __init__(self, location_id, latitude, longitude, time_stable_data=None):
        self.location_id = location_id
        self.latitude = self.validate_latitude(latitude)
        self.longitude = self.validate_longitude(longitude)
        self.time_stable_data = time_stable_data

    @staticmethod
    def validate_latitude(latitude):
        if -90 <= float(latitude) <= 90:
            return latitude
        raise ValueError('Invalid latitude value')

    @staticmethod
    def validate_longitude(longitude):
        if -180 <= float(longitude) <= 180:
            return longitude
        raise ValueError('Invalid longitude value')

    def __repr__(self):
        return f'<Location {self.location_id}>'
