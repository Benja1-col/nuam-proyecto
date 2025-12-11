from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import bcrypt 
from config import Config 
from src.routes.documents import documents_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(documents_bp, url_prefix='/api') 

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            cursor_factory=psycopg2.extras.DictCursor 
        )
        return conn
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

@app.route("/api/estado", methods=["GET"])
def estado():
    return jsonify({"status": "backend funcionando correctamente"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    password_from_frontend = data.get('password')

    conn = get_db_connection()
    if conn is None: return jsonify({'error': 'Error de conexión BD'}), 500

    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor) 
        cur.execute('SELECT id_rol, password_hash FROM usuarios WHERE correo = %s', (correo,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user and bcrypt.checkpw(password_from_frontend.encode('utf-8'), user['password_hash'].encode('utf-8')):
            rol_map = {1: 'Administrador', 2: 'Operador', 3: 'Auditor'}
            return jsonify({'message': 'MFA requerido', 'mfa_required': True, 'rol': rol_map.get(user['id_rol'], 'Auditor')}), 200
        
        return jsonify({'error': 'Credenciales inválidas'}), 401
    except Exception as e:
        return jsonify({'error': 'Error servidor'}), 500

@app.route('/api/verify_mfa', methods=['POST'])
def verify_mfa():
    if request.get_json().get('mfa_code') == '123456':
        return jsonify({'message': 'Autenticación exitosa', 'token': 'simulated_jwt', 'isAuthenticated': True}), 200
    return jsonify({'error': 'Código inválido'}), 401

# --- RUTA DE AUDITORÍA SIMPLIFICADA Y ROBUSTA ---
@app.route('/api/auditoria', methods=['GET'])
def get_auditoria_data():
    conn = get_db_connection()
    if conn is None: return jsonify({'error': 'Error conexión BD'}), 500

    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # Consulta simple: Trae todo, ordenado por fecha.
        cur.execute('SELECT id, fecha_hora, usuario, pais, accion, detalle_json FROM trazabilidad_auditoria ORDER BY fecha_hora DESC')
        registros = cur.fetchall()
        
        data = []
        for row in registros:
            data.append({
                'id': row['id'], 
                'fecha_hora': row['fecha_hora'].isoformat() if row['fecha_hora'] else None,
                'usuario': row['usuario'],
                'pais': row['pais'],
                'accion': row['accion'],
                'detalle_json': row['detalle_json']
            })
        cur.close()
        conn.close()
        return jsonify(data), 200 # Devuelve ARRAY simple
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error servidor'}), 500

if __name__ == "__main__":
    app.run(debug=True)