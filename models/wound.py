from .sample import Sample
from app import db

class Wound(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wound_id = db.Column(db.String(80), nullable=False)
    sample_id = db.Column(db.Integer, db.ForeignKey('sample.id'), nullable=False)
    sample = db.relationship('Sample', backref=db.backref('wounds', lazy=True))
