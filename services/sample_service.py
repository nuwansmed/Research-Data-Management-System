from flask import current_app
from models.sample import Sample
from config import db

def create_sample(sample_id, location_id, tree_number, sample_number):
    try:
        new_sample = Sample(sample_id=sample_id, location_id=location_id, tree_number=tree_number, sample_number=sample_number)
        db.session.add(new_sample)
        db.session.commit()
        

        return new_sample
    except Exception as e:
        # Handle exceptions (like database errors) here
        db.session.rollback()
        raise e

def get_all_samples():
    try:
        return Sample.query.all()
    except Exception as e:
        # Handle exceptions
        raise e



def get_all_sample_ids():
    samples = Sample.query.with_entities(Sample.sample_id).all()
    return [Sample.sample_id for sample in samples]

# Add more functions as needed for updating, deleting, etc.
