#!/usr/bin/env python3
"""
Script de verificación de la estructura del proyecto
Comprueba que todos los archivos necesarios estén en su lugar
"""

import os
import sys

# Estructura esperada del proyecto
EXPECTED_FILES = {
    'Backend': [
        'app.py',
        'config.py',
        'requirements.txt',
        'src/routes/documents.py',
        'src/routes/auth.py',
        'src/routes/models/document.py',
        'src/routes/models/user.py',
        'ejemplo_transacciones.xml',
        'ejemplo_transacciones.csv',
        'test_upload.py',
    ],
    'frontend': [
        'src/Upload.js',
        'src/App.js',
        'src/Login.js',
        'package.json',
    ],
    'root': [
        'CARGA_MASIVA_GUIA.md',
        'RESUMEN_IMPLEMENTACION.md',
    ]
}

def check_files():
    """Verifica que los archivos necesarios existan"""
    print("\n" + "█"*60)
    print("█ VERIFICACIÓN DE ESTRUCTURA DEL PROYECTO")
    print("█"*60 + "\n")
    
    all_ok = True
    
    # Verificar archivos en raíz
    print("📁 Archivos en la raíz del proyecto:")
    for filename in EXPECTED_FILES['root']:
        exists = os.path.exists(filename)
        status = "✅" if exists else "❌"
        print(f"  {status} {filename}")
        if not exists:
            all_ok = False
    
    # Verificar archivos en Backend
    print("\n📁 Archivos en Backend/:")
    for filename in EXPECTED_FILES['Backend']:
        filepath = os.path.join('Backend', filename)
        exists = os.path.exists(filepath)
        status = "✅" if exists else "❌"
        print(f"  {status} {filepath}")
        if not exists:
            all_ok = False
    
    # Verificar archivos en frontend
    print("\n📁 Archivos en frontend/:")
    for filename in EXPECTED_FILES['frontend']:
        filepath = os.path.join('frontend', filename)
        exists = os.path.exists(filepath)
        status = "✅" if exists else "❌"
        print(f"  {status} {filepath}")
        if not exists:
            all_ok = False
    
    print("\n" + "="*60)
    
    if all_ok:
        print("✅ TODAS LAS ESTRUCTURA ESTÁ CORRECTA")
        print("\nPróximos pasos:")
        print("1. Asegúrate de que PostgreSQL esté corriendo")
        print("2. Configura las variables en .env")
        print("3. Inicia el backend: cd Backend && python app.py")
        print("4. En otra terminal, inicia el frontend: cd frontend && npm start")
        print("5. Accede a http://localhost:3000")
    else:
        print("❌ FALTAN ALGUNOS ARCHIVOS")
        print("Por favor, verifica que todos los archivos se hayan creado correctamente")
    
    print("="*60 + "\n")
    
    return 0 if all_ok else 1

def check_imports():
    """Verifica que los imports necesarios se puedan hacer"""
    print("📚 Verificando imports de Python...\n")
    
    required_packages = [
        'flask',
        'flask_cors',
        'psycopg2',
        'bcrypt',
        'werkzeug',
        'dotenv',
    ]
    
    all_ok = True
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - No instalado")
            all_ok = False
    
    if not all_ok:
        print("\n⚠️ Faltan dependencias. Instala con:")
        print("pip install -r Backend/requirements.txt")
    
    print()
    return all_ok

if __name__ == "__main__":
    print("\n")
    # Cambiar al directorio del proyecto
    project_root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_root)
    
    files_ok = check_files()
    imports_ok = check_imports()
    
    sys.exit(0 if (files_ok == 0 and imports_ok) else 1)
