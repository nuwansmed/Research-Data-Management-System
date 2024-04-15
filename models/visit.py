from config import db  # Import db from config

class Visit(db.Model):
    __tablename__ = 'visits'

    id = db.Column(db.Integer, primary_key=True)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    visit_date = db.Column(db.Date, nullable=False)
    dynamic_data = db.Column(db.JSON)  # Use db.JSON for automatic handling

    def __repr__(self):
        return f'<Visit {self.id} at Location {self.location_id}>'
