# 🚀 GUÍA RÁPIDA - CARGA MASIVA

## ⚡ En 3 Pasos

### Paso 1️⃣: Terminal 1 - Inicia el Backend
```bash
cd Backend
python app.py
```
Deberías ver: `Running on http://127.0.0.1:5000`

### Paso 2️⃣: Terminal 2 - Inicia el Frontend
```bash
cd frontend
npm start
```
Se abrirá automáticamente en http://localhost:3000

### Paso 3️⃣: Usa el Módulo
1. Navega a **"Carga Masiva"** en el menú
2. Arrastra o selecciona `Backend/ejemplo_transacciones.xml` o `.csv`
3. Haz clic en **"Confirmar Carga y Procesamiento"**
4. ¡Listo! Verás los resultados automáticamente

---

## 📦 Archivos de Prueba Listos

✅ `Backend/ejemplo_transacciones.xml` - XML con 5 transacciones
✅ `Backend/ejemplo_transacciones.csv` - CSV con 10 transacciones

Ambos tienen la estructura correcta para procesar sin errores.

---

## 🧪 Pruebas Automáticas (Opcional)

```bash
cd Backend
python test_upload.py
```

Ejecutará 3 pruebas:
- ✅ Carga XML
- ✅ Carga CSV
- ✅ Rechazo de archivo inválido

---

## 🔍 Verificar Estructura

```bash
python verify_structure.py
```

Verifica que todos los archivos estén en su lugar.

---

## 📊 Qué Esperar

Cuando cargues un archivo, verás:

| Métrica | Ejemplo |
|---------|---------|
| 📁 Archivo Procesado | `20250110_153022_transacciones.csv` |
| 📈 Total de Registros | `10` |
| ✅ Registros Procesados | `10` |
| ❌ Registros Fallidos | `0` |
| 🎯 Porcentaje de Éxito | `100.0%` |

---

## 🎨 Interfaz Visual

La pantalla tiene:
- 📤 Zona de carga con drag & drop
- 📊 Tabla de resultados automática
- ⚠️ Errores destacados (si hay)
- 🔄 Botón para procesar otro archivo

---

## 💡 Consejos

✨ Los campos **REQUERIDOS** son:
- `id` - Identificador único
- `fecha` - En formato YYYY-MM-DD
- `monto` - Número con decimales
- `pais` - País de la transacción

✨ Puedes agregar más campos en tu CSV/XML y se guardarán también.

✨ Si ves errores, revisa que:
- El archivo tenga los 4 campos requeridos
- Las fechas estén en formato correcto
- Los montos sean números válidos

---

## 🐛 Si Algo Falla

**Error: "No se puede conectar al backend"**
→ Verifica que hayas ejecutado `python app.py` en el paso 1

**Error: "Tipo de archivo inválido"**
→ Solo se aceptan `.xml` y `.csv`

**Error: "Campos requeridos faltantes"**
→ Agrega: id, fecha, monto, pais

**Error: "Fecha inválida"**
→ Usa formato YYYY-MM-DD (ej: 2025-01-15)

---

## 📞 Documentación Completa

Para más detalles, lee:
- 📖 `CARGA_MASIVA_GUIA.md` - Guía detallada
- 📋 `RESUMEN_IMPLEMENTACION.md` - Todo lo implementado

---

## 🎉 ¡Listo!

Tu módulo de carga masiva está completamente funcional y listo para usar.

**¿Preguntas?** Revisa la guía completa en `CARGA_MASIVA_GUIA.md`

¡A cargar datos! 📁✨
