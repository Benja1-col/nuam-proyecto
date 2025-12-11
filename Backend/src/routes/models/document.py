from src.database import db
from datetime import datetime

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(120), nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    archivo = db.Column(db.String(255), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
