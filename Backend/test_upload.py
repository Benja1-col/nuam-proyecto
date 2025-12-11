#!/usr/bin/env python3
"""
Script de prueba para el módulo de carga masiva
Prueba el endpoint /api/upload con archivos de ejemplo
"""

import requests
import os
import sys
import json

BASE_URL = "http://127.0.0.1:5000"
UPLOAD_ENDPOINT = f"{BASE_URL}/api/upload"

def test_upload_xml():
    """Prueba la carga de un archivo XML"""
    print("\n" + "="*60)
    print("🧪 PRUEBA 1: Carga de archivo XML")
    print("="*60)
    
    xml_file = "ejemplo_transacciones.xml"
    
    if not os.path.exists(xml_file):
        print(f"❌ El archivo {xml_file} no existe")
        return False
    
    try:
        with open(xml_file, 'rb') as f:
            files = {'file': f}
            response = requests.post(UPLOAD_ENDPOINT, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Carga exitosa")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.json())
            return False
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_upload_csv():
    """Prueba la carga de un archivo CSV"""
    print("\n" + "="*60)
    print("🧪 PRUEBA 2: Carga de archivo CSV")
    print("="*60)
    
    csv_file = "ejemplo_transacciones.csv"
    
    if not os.path.exists(csv_file):
        print(f"❌ El archivo {csv_file} no existe")
        return False
    
    try:
        with open(csv_file, 'rb') as f:
            files = {'file': f}
            response = requests.post(UPLOAD_ENDPOINT, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Carga exitosa")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.json())
            return False
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_invalid_file():
    """Prueba con un archivo inválido"""
    print("\n" + "="*60)
    print("🧪 PRUEBA 3: Carga de archivo inválido (debe fallar)")
    print("="*60)
    
    # Crear archivo temporal inválido
    invalid_file = "test_invalid.txt"
    with open(invalid_file, 'w') as f:
        f.write("Este es un archivo de texto inválido")
    
    try:
        with open(invalid_file, 'rb') as f:
            files = {'file': f}
            response = requests.post(UPLOAD_ENDPOINT, files=files)
        
        if response.status_code != 200:
            print("✅ Validación correcta - archivo rechazado")
            print(f"Mensaje: {response.json()}")
            return True
        else:
            print("❌ El sistema aceptó un archivo inválido")
            return False
    
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        return False
    
    finally:
        if os.path.exists(invalid_file):
            os.remove(invalid_file)

def check_backend_running():
    """Verifica si el backend está corriendo"""
    print("\n" + "="*60)
    print("🔍 Verificando conexión con el backend...")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/api/estado", timeout=5)
        if response.status_code == 200:
            print(f"✅ Backend activo: {response.json()}")
            return True
        else:
            print(f"❌ Backend respondió con error: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend")
        print(f"   Asegúrate de que el servidor esté corriendo en {BASE_URL}")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Ejecuta todas las pruebas"""
    print("\n" + "█"*60)
    print("█ PRUEBAS DEL MÓDULO DE CARGA MASIVA")
    print("█"*60)
    
    # Verificar backend
    if not check_backend_running():
        print("\n⚠️ El backend no está disponible. Inicia con: python app.py")
        sys.exit(1)
    
    results = []
    
    # Ejecutar pruebas
    results.append(("XML", test_upload_xml()))
    results.append(("CSV", test_upload_csv()))
    results.append(("Archivo Inválido", test_invalid_file()))
    
    # Resumen
    print("\n" + "="*60)
    print("📊 RESUMEN DE PRUEBAS")
    print("="*60)
    
    for test_name, result in results:
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"{test_name}: {status}")
    
    total_passed = sum(1 for _, result in results if result)
    print(f"\nTotal: {total_passed}/{len(results)} pruebas pasadas")
    
    return 0 if total_passed == len(results) else 1

if __name__ == "__main__":
    sys.exit(main())
