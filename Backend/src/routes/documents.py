from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import csv
import xml.etree.ElementTree as ET
from datetime import datetime
import psycopg2
import psycopg2.extras

documents_bp = Blueprint('documents', __name__)

ALLOWED_EXTENSIONS = {'xml', 'csv'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads')

# Crear carpeta de uploads si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Verifica que el archivo tenga extensión permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    """Obtiene conexión a la base de datos"""
    try:
        from config import Config
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

def parse_xml_file(file_path):
    """Parsea un archivo XML y extrae los datos"""
    records = []
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        # Busca elementos 'transaccion' o 'record' dependiendo de la estructura
        for element in root.findall('.//transaccion') or root.findall('.//record'):
            record = {}
            for child in element:
                record[child.tag] = child.text
            records.append(record)
        
        return records, len(records)
    except Exception as e:
        raise Exception(f"Error al parsear XML: {str(e)}")

def parse_csv_file(file_path):
    """Parsea un archivo CSV y extrae los datos"""
    records = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            csv_reader = csv.DictReader(f)
            for row in csv_reader:
                records.append(row)
        return records, len(records)
    except Exception as e:
        raise Exception(f"Error al parsear CSV: {str(e)}")

def validate_record(record):
    """Valida que un registro tenga los campos mínimos requeridos"""
    required_fields = ['id', 'fecha', 'monto', 'pais']
    for field in required_fields:
        if field not in record or not record[field]:
            return False, f"Campo requerido faltante: {field}"
    return True, "OK"

def save_records_to_db(records, file_name, user_id=1):
    """Guarda los registros validados en la base de datos"""
    conn = get_db_connection()
    if not conn:
        return 0, "Error de conexión a base de datos"
    
    try:
        cur = conn.cursor()
        saved_count = 0
        failed_count = 0
        errors = []
        
        for record in records:
            # Validar registro
            is_valid, message = validate_record(record)
            
            if not is_valid:
                failed_count += 1
                errors.append(f"Registro {record.get('id', 'N/A')}: {message}")
                continue
            
            try:
                # Insertar en tabla de documentos/transacciones
                # Ajusta la tabla según tu esquema de BD
                cur.execute("""
                    INSERT INTO transacciones (
                        id_transaccion, fecha, monto, pais, 
                        archivo_origen, estado, creado_en
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                """, (
                    record.get('id'),
                    record.get('fecha'),
                    float(record.get('monto', 0)),
                    record.get('pais'),
                    file_name,
                    'procesado',
                    datetime.now()
                ))
                saved_count += 1
            except Exception as e:
                failed_count += 1
                errors.append(f"Registro {record.get('id', 'N/A')}: {str(e)}")
        
        # Registrar en trazabilidad
        try:
            cur.execute("""
                INSERT INTO trazabilidad_auditoria (
                    fecha_hora, usuario, accion, detalle_json, pais
                ) VALUES (%s, %s, %s, %s, %s)
            """, (
                datetime.now(),
                f"user_{user_id}",
                'CARGA_MASIVA',
                f'Archivo: {file_name}, Registros: {saved_count}/{len(records)}',
                'Sistema'
            ))
        except:
            pass  # Si falla trazabilidad, no afecta el resultado
        
        conn.commit()
        cur.close()
        conn.close()
        
        return saved_count, errors
    
    except Exception as e:
        if conn:
            conn.close()
        return 0, [f"Error al guardar en BD: {str(e)}"]

@documents_bp.route('/upload', methods=['POST'])
def upload_file():
    """Endpoint para carga masiva de archivos XML/CSV"""
    
    # Validar que haya archivo
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Nombre de archivo vacío'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Solo se permiten archivos .xml o .csv'}), 400
    
    try:
        # Guardar archivo temporalmente
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Parsear archivo según su tipo
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        if file_ext == 'xml':
            records, total = parse_xml_file(filepath)
        else:  # csv
            records, total = parse_csv_file(filepath)
        
        if not records:
            return jsonify({'error': 'El archivo no contiene registros válidos'}), 400
        
        # Guardar en base de datos
        saved_count, errors = save_records_to_db(records, filename)
        
        response = {
            'message': 'Archivo procesado correctamente',
            'archivo': filename,
            'total_registros': total,
            'registros_procesados': saved_count,
            'registros_fallidos': total - saved_count,
            'porcentaje_exito': round((saved_count / total * 100), 2) if total > 0 else 0
        }
        
        if errors:
            response['errores'] = errors[:10]  # Mostrar primeros 10 errores
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al procesar archivo: {str(e)}'}), 500
    
    finally:
        # Limpiar archivo temporal si existe
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except:
            pass
