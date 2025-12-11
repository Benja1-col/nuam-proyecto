# 🐛 GUÍA DE DEBUGGING Y SOLUCIÓN DE PROBLEMAS

## 🔍 Verificación Rápida

### 1. Verifica que todo esté en su lugar
```bash
python verify_structure.py
```

Debe mostrar ✅ en todos los archivos.

### 2. Verifica dependencias Python
```bash
cd Backend
pip list | grep -E "Flask|psycopg2|bcrypt"
```

Si falta algo:
```bash
pip install -r requirements.txt
```

### 3. Verifica que Node está instalado
```bash
node --version
npm --version
```

---

## 🚀 INICIO CORRECTO

### Orden Correcto de Iniciación:

```
TERMINAL 1:
cd Backend
python app.py
# Espera a que veas: "Running on http://127.0.0.1:5000"

TERMINAL 2:
cd frontend
npm start
# Espera a que se abra el navegador
```

### ✅ Señales de que está funcionando:

**Backend (Terminal 1):**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

**Frontend (Terminal 2):**
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

---

## 🔴 PROBLEMAS COMUNES

### Problema 1: "ModuleNotFoundError: No module named 'src'"

**Causa:** Python no encuentra el paquete src

**Solución:**
```bash
# Asegúrate de estar en la carpeta Backend
cd Backend

# Crea __init__.py en src si no existe
touch src/__init__.py
touch src/routes/__init__.py
touch src/routes/models/__init__.py

# Verifica la estructura
ls -la src/
ls -la src/routes/
```

### Problema 2: "Error de conexión a la base de datos"

**Causa:** PostgreSQL no está corriendo o credenciales inválidas

**Solución:**
```bash
# Verifica que PostgreSQL esté corriendo
# Windows:
Get-Service postgresql-x64-15  # o tu versión

# Si no está corriendo:
net start postgresql-x64-15

# Linux/Mac:
brew services start postgresql
# o
sudo service postgresql start

# Verifica credenciales en Backend/.env
cat .env
```

### Problema 3: "Error al conectar... FATAL: database 'tu_bd' does not exist"

**Causa:** La base de datos no existe

**Solución:**
```bash
# Conecta a PostgreSQL
psql -U tu_usuario -h localhost

# En psql crea la BD:
CREATE DATABASE tu_bd;

# Crea las tablas:
CREATE TABLE transacciones (
    id_transaccion VARCHAR(255) PRIMARY KEY,
    fecha DATE,
    monto DECIMAL(10,2),
    pais VARCHAR(100),
    archivo_origen VARCHAR(255),
    estado VARCHAR(50),
    creado_en TIMESTAMP
);

CREATE TABLE trazabilidad_auditoria (
    id SERIAL PRIMARY KEY,
    fecha_hora TIMESTAMP,
    usuario VARCHAR(100),
    pais VARCHAR(100),
    accion VARCHAR(100),
    detalle_json TEXT
);

# Verifica
\dt
\q
```

### Problema 4: "ERR_CONNECTION_REFUSED - No puede conectar a http://127.0.0.1:5000"

**Causa:** El backend no está corriendo

**Solución:**
```bash
# En Terminal 1:
cd Backend
python app.py

# Si falla, verifica si hay error en el output
# Busca líneas rojas con "ERROR" o "Exception"
```

### Problema 5: "404 Not Found - POST /api/upload"

**Causa:** El Blueprint no está registrado o ruta incorrecta

**Solución:**
```bash
# Verifica que Backend/app.py tenga:
# from src.routes.documents import documents_bp
# app.register_blueprint(documents_bp, url_prefix='/api')

# Verifica con curl:
curl -X GET http://127.0.0.1:5000/api/estado
# Debe responder: {"status":"backend funcionando..."}

# Si no responde, el backend no está corriendo
```

### Problema 6: "Module has no attribute 'DictCursor'"

**Causa:** psycopg2 no está bien instalado

**Solución:**
```bash
pip uninstall psycopg2-binary -y
pip install psycopg2-binary==2.9.11
```

### Problema 7: "Frontend no carga en http://localhost:3000"

**Causa:** npm start falló

**Solución:**
```bash
cd frontend

# Limpia caché
rm -rf node_modules package-lock.json

# Reinstala
npm install

# Inicia
npm start

# Si sigue fallando, busca el error en la terminal
```

---

## 🧪 PRUEBAS DE DIAGNÓSTICO

### Test 1: ¿Funciona el backend?

```bash
curl -X GET http://127.0.0.1:5000/api/estado
```

Respuesta esperada:
```json
{"status":"backend funcionando correctamente"}
```

Si falla: El backend no está corriendo.

### Test 2: ¿Puede el backend conectar a la BD?

```bash
# En Python:
python -c "
from config import Config
import psycopg2

try:
    conn = psycopg2.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        dbname=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD
    )
    print('✅ BD conectada')
    conn.close()
except Exception as e:
    print(f'❌ Error: {e}')
"
```

### Test 3: ¿Carga correctamente un archivo?

```bash
cd Backend

# Usando curl:
curl -X POST -F "file=@ejemplo_transacciones.csv" http://127.0.0.1:5000/api/upload

# Respuesta esperada:
# {"message":"Archivo procesado...","registros_procesados":10,...}
```

### Test 4: ¿Funciona toda la cadena?

```bash
python test_upload.py
```

Debe mostrar ✅ en las 3 pruebas.

---

## 📋 CHECKLIST DE SOLUCIÓN

Si algo no funciona, sigue esta lista:

- [ ] ¿Está PostgreSQL corriendo? (`psql --version`)
- [ ] ¿Existe el .env con credenciales correctas?
- [ ] ¿Existen las tablas? (`\dt` en psql)
- [ ] ¿Está el backend iniciado? (Terminal 1)
- [ ] ¿Responde el backend? (curl a /api/estado)
- [ ] ¿Está npm instalado? (`npm --version`)
- [ ] ¿Está el frontend iniciado? (Terminal 2)
- [ ] ¿Se abrió http://localhost:3000?
- [ ] ¿Los archivos están en su lugar? (verify_structure.py)
- [ ] ¿Imports funcionan? (python test_upload.py)

---

## 🔐 VERIFICACIÓN DE SEGURIDAD

### Test CORS
```bash
curl -X OPTIONS http://127.0.0.1:5000/api/upload \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

Debe tener: `Access-Control-Allow-Origin: *`

### Test de Validación de Tipo de Archivo
```bash
# Intenta cargar un .txt (debe fallar)
echo "contenido" > test.txt
curl -X POST -F "file=@test.txt" http://127.0.0.1:5000/api/upload

# Respuesta esperada:
# {"error":"Solo se permiten archivos .xml o .csv"}
```

---

## 📊 LOGS Y DEBUGGING

### Ver logs del backend en tiempo real
```bash
# Terminal con el backend, mira la salida

# Busca líneas como:
# "Error al procesar archivo:"
# "Error al conectar a BD:"
# "Archivo procesado: ..."
```

### Ver logs del frontend en tiempo real
```bash
# Terminal con npm, mira la salida

# Busca errores en la consola del navegador:
# F12 → Console → Busca errores rojos
```

### Aumentar verbosidad del backend
```python
# En Backend/app.py, cambia:
app.run(debug=True)  # Ya está en debug

# Si necesitas más info:
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 🔧 SOLUCIONES AVANZADAS

### Problema: Puerto 5000 ya está en uso
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Alternativa: Cambia el puerto en Backend/app.py:
app.run(debug=True, port=5001)
```

### Problema: Puerto 3000 ya está en uso
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>

# Alternativa: npm start usará otro puerto automáticamente
```

### Problema: "ConnectionError: ('connection closed',)"
```bash
# Causa: Pool de conexiones agotado o BD cerró conexión

# Solución en Backend/app.py:
import psycopg2.pool

connection_pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,  # min 1, max 20 conexiones
    host=Config.DB_HOST,
    # ... resto de parámetros
)
```

---

## 📞 RESUMEN RÁPIDO DE COMANDOS

```bash
# Backend
cd Backend
python app.py              # Inicia backend
python test_upload.py     # Prueba automática
python verify_structure.py # Verifica estructura

# Frontend
cd frontend
npm install               # Instala dependencias
npm start                 # Inicia frontend

# PostgreSQL
psql -U usuario -h localhost
\dt                       # Lista tablas
\q                        # Salir

# Diagnóstico
curl http://127.0.0.1:5000/api/estado
python -c "import psycopg2; print('OK')"
```

---

## 🎯 FLUJO CORRECTO DE EJECUCIÓN

```
1. Abre 2 terminales en la raíz del proyecto

TERMINAL 1:
├─ cd Backend
├─ python app.py
└─ Espera: "Running on http://127.0.0.1:5000"

TERMINAL 2:
├─ cd frontend
├─ npm install (si es la primera vez)
├─ npm start
└─ Espera: navegador abre http://localhost:3000

WEB BROWSER:
├─ http://localhost:3000 abierto
├─ Login con credenciales
├─ Click en "Carga Masiva"
├─ Arrastra archivo XML o CSV
├─ Click "Confirmar Carga"
└─ Ver resultados
```

Si algo no funciona en este punto, revisa esta guía desde el inicio.

---

## ✅ VALIDACIÓN FINAL

Cuando todo esté funcionando, deberías ver:

```
✅ Backend respondiendo a requests
✅ Frontend cargando en navegador
✅ Puedes hacer login
✅ Aparece botón "Carga Masiva"
✅ Puedes seleccionar archivo
✅ Archivo se procesa correctamente
✅ Ves tabla de resultados con 100% éxito
✅ Datos guardados en BD (verifica con psql)
```

Si ves todo esto: **¡ÉXITO! Tu carga masiva está lista.** 🎉

---

Para más ayuda, abre los archivos:
- README_CARGA_MASIVA.md
- CARGA_MASIVA_GUIA.md
- INICIO_RAPIDO.md
