from .location import Location
from config import db

class Sample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sample_id = db.Column(db.String(80), nullable=False)
    tree_number = db.Column(db.Integer)
    sample_number = db.Column(db.Integer)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    location = db.relationship('Location', backref=db.backref('samples', lazy=True))
