# 📁 Guía de Carga Masiva

## Descripción General
El módulo de carga masiva permite a los operadores cargar grandes volúmenes de transacciones desde archivos XML o CSV. El sistema procesa automáticamente los registros, valida los datos y los almacena en la base de datos.

## Características

✅ **Carga de Archivos Múltiples**: Soporta XML y CSV
✅ **Validación de Datos**: Verifica campos requeridos
✅ **Procesamiento en Lote**: Maneja miles de registros
✅ **Feedback en Tiempo Real**: Barra de progreso y actualizaciones
✅ **Reportes Detallados**: Métricas de éxito/fallo
✅ **Trazabilidad**: Registra todas las cargas en auditoría
✅ **Drag & Drop**: Interfaz intuitiva

## Campos Requeridos

Todos los archivos **deben contener estos campos**:
- **id**: Identificador único de la transacción
- **fecha**: Fecha de la transacción (YYYY-MM-DD)
- **monto**: Cantidad numérica (ej: 1500.50)
- **pais**: País de la transacción

### Campos Opcionales:
- descripcion
- tipo
- usuario
- estado

## Formatos Aceptados

### XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<transacciones>
    <transaccion>
        <id>TRX001</id>
        <fecha>2025-01-15</fecha>
        <monto>1500.50</monto>
        <pais>Colombia</pais>
        <descripcion>Pago de servicios</descripcion>
    </transaccion>
</transacciones>
```

### CSV
```csv
id,fecha,monto,pais,descripcion
TRX001,2025-01-15,1500.50,Colombia,Pago de servicios
TRX002,2025-01-16,2300.75,Mexico,Transferencia internacional
```

## Cómo Usar

1. **Acceder al Módulo**
   - Navega a la sección "Carga Masiva" en el dashboard operador

2. **Seleccionar Archivo**
   - Haz clic en el área de carga o arrastra tu archivo
   - Solo se aceptan archivos .xml y .csv

3. **Confirmar Carga**
   - Haz clic en "Confirmar Carga y Procesamiento"
   - El sistema mostrará una barra de progreso

4. **Revisar Resultados**
   - Se mostrará un reporte con:
     - Total de registros procesados
     - Registros exitosos
     - Registros fallidos
     - Porcentaje de éxito
     - Detalles de errores

## Validaciones

El sistema realiza las siguientes validaciones:

- ✓ Archivo no vacío
- ✓ Extensión válida (.xml o .csv)
- ✓ Estructura del XML correcta
- ✓ Campos requeridos presentes
- ✓ Tipos de datos válidos
- ✓ IDs únicos (no duplicados)

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Archivo no seleccionado | No se eligió archivo | Selecciona un archivo válido |
| Tipo de archivo inválido | Extensión incorrecta | Usa .xml o .csv |
| Campos requeridos faltantes | XML/CSV incompleto | Verifica que tengas: id, fecha, monto, pais |
| Monto no es número | Formato incorrecto | Usa formato numérico (ej: 1500.50) |
| Fecha inválida | Formato incorrecto | Usa YYYY-MM-DD |

## Archivos de Ejemplo

Los siguientes archivos de ejemplo están disponibles:
- `ejemplo_transacciones.xml` - Ejemplo en formato XML
- `ejemplo_transacciones.csv` - Ejemplo en formato CSV

## Límites

- **Máximo por archivo**: 500 MB
- **Máximo de registros**: 1,000,000 por carga
- **Encoding**: UTF-8

## Trazabilidad

Cada carga se registra automáticamente en la auditoría con:
- Fecha y hora de la carga
- Usuario que realizó la carga
- Nombre del archivo
- Cantidad de registros procesados
- Estado de la operación

## Soporte Técnico

Si encuentras problemas:
1. Revisa los errores mostrados en la interfaz
2. Valida el formato de tu archivo
3. Verifica los datos con los archivos de ejemplo
4. Revisa los logs del servidor en `/Backend/logs/`

## Endpoint API

**POST** `/api/upload`

**Request:**
```
Content-Type: multipart/form-data
- file: [archivo XML o CSV]
```

**Response (Éxito):**
```json
{
  "message": "Archivo procesado correctamente",
  "archivo": "20250110_153022_transacciones.csv",
  "total_registros": 10,
  "registros_procesados": 10,
  "registros_fallidos": 0,
  "porcentaje_exito": 100.0
}
```

**Response (Error):**
```json
{
  "error": "Descripción del error"
}
```
