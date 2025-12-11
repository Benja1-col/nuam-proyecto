#!/usr/bin/env python3
"""
CHECKLIST FINAL - Validación de Implementación de Carga Masiva
Ejecuta esto para verificar que todo esté listo
"""

import os
import sys
from pathlib import Path

def check_file_exists(path, description):
    """Verifica si un archivo existe"""
    exists = os.path.exists(path)
    status = "✅" if exists else "❌"
    print(f"{status} {description}: {path}")
    return exists

def check_file_contains(path, text, description):
    """Verifica si un archivo contiene cierto texto"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            found = text in content
            status = "✅" if found else "❌"
            print(f"{status} {description}")
            return found
    except:
        print(f"❌ {description} (No se pudo leer el archivo)")
        return False

def main():
    print("\n" + "█"*70)
    print("█ CHECKLIST FINAL - CARGA MASIVA")
    print("█"*70 + "\n")
    
    all_ok = True
    
    # Sección 1: Archivos Principales
    print("📁 ARCHIVOS PRINCIPALES\n")
    
    files_to_check = [
        ("Backend/app.py", "Backend - App Principal"),
        ("Backend/src/routes/documents.py", "Backend - Módulo de Documentos"),
        ("Backend/config.py", "Backend - Configuración"),
        ("Backend/requirements.txt", "Backend - Dependencias"),
        ("Backend/ejemplo_transacciones.xml", "Backend - Ejemplo XML"),
        ("Backend/ejemplo_transacciones.csv", "Backend - Ejemplo CSV"),
        ("Backend/test_upload.py", "Backend - Script de Pruebas"),
        ("frontend/src/Upload.js", "Frontend - Componente Upload"),
        ("frontend/src/App.js", "Frontend - App Principal"),
        ("frontend/package.json", "Frontend - Dependencias"),
    ]
    
    for filepath, description in files_to_check:
        if not check_file_exists(filepath, description):
            all_ok = False
    
    # Sección 2: Documentación
    print("\n📚 DOCUMENTACIÓN\n")
    
    docs = [
        ("INICIO_RAPIDO.md", "Guía Rápida (3 pasos)"),
        ("README_CARGA_MASIVA.md", "README Principal"),
        ("CARGA_MASIVA_GUIA.md", "Guía Completa de Usuario"),
        ("DEBUGGING_GUIA.md", "Guía de Debugging"),
        ("RESUMEN_IMPLEMENTACION.md", "Resumen Técnico"),
        ("ENTREGA_FINAL.md", "Documento de Entrega"),
    ]
    
    for filepath, description in docs:
        if not check_file_exists(filepath, description):
            all_ok = False
    
    # Sección 3: Validaciones de Código
    print("\n🔍 VALIDACIONES DE CÓDIGO\n")
    
    # Verifica imports en app.py
    if check_file_contains(
        "Backend/app.py",
        "from src.routes.documents import documents_bp",
        "Backend - Import correcto del Blueprint"
    ):
        pass
    else:
        all_ok = False
    
    # Verifica registro del blueprint
    if check_file_contains(
        "Backend/app.py",
        "app.register_blueprint(documents_bp",
        "Backend - Blueprint registrado"
    ):
        pass
    else:
        all_ok = False
    
    # Verifica Upload.js importado en App.js
    if check_file_contains(
        "frontend/src/App.js",
        "Upload",
        "Frontend - Upload importado en App.js"
    ):
        pass
    else:
        all_ok = False
    
    # Verifica ruta /upload en App.js
    if check_file_contains(
        "frontend/src/App.js",
        "path=\"/upload\"",
        "Frontend - Ruta /upload configurada"
    ):
        pass
    else:
        all_ok = False
    
    # Sección 4: Archivos de Prueba
    print("\n🧪 ARCHIVOS DE PRUEBA\n")
    
    if check_file_exists("Backend/test_upload.py", "Script de pruebas automáticas"):
        pass
    else:
        all_ok = False
    
    if check_file_exists("verify_structure.py", "Verificador de estructura"):
        pass
    else:
        all_ok = False
    
    # Sección 5: Estructura de Carpetas
    print("\n📂 ESTRUCTURA DE CARPETAS\n")
    
    folders_to_check = [
        ("Backend/src/routes", "Backend Routes"),
        ("Backend/src/routes/models", "Backend Models"),
        ("frontend/src", "Frontend Source"),
    ]
    
    for folderpath, description in folders_to_check:
        if os.path.isdir(folderpath):
            print(f"✅ {description}: {folderpath}")
        else:
            print(f"❌ {description}: {folderpath}")
            all_ok = False
    
    # Sección 6: Resumen
    print("\n" + "="*70)
    
    if all_ok:
        print("✅ ¡IMPLEMENTACIÓN COMPLETA Y VALIDADA!")
        print("\nTodos los archivos están en su lugar y listos para usar.")
        print("\nPróximos pasos:")
        print("1. Lee: INICIO_RAPIDO.md")
        print("2. Abre Terminal 1: cd Backend && python app.py")
        print("3. Abre Terminal 2: cd frontend && npm start")
        print("4. ¡Disfruta tu carga masiva!")
    else:
        print("❌ FALTAN ALGUNOS ARCHIVOS O CONFIGURACIONES")
        print("\nVerifica los elementos marcados con ❌ arriba")
        print("Lee DEBUGGING_GUIA.md para más información")
    
    print("="*70 + "\n")
    
    return 0 if all_ok else 1

if __name__ == "__main__":
    sys.exit(main())
