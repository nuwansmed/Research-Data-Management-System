from .wound import Wound
from app import db
import datetime

class Culture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    culture_id = db.Column(db.String(80), nullable=False)
    wound_id = db.Column(db.Integer, db.ForeignKey('wound.id'), nullable=False)
    wound = db.relationship('Wound', backref=db.backref('cultures', lazy=True))
    front_image_path = db.Column(db.String(120))
    back_image_path = db.Column(db.String(120))
    culture_date = db.Column(db.Date, default=datetime.date.today)
    observations = db.Column(db.String(120))
