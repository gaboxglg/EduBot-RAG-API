# EduBot RAG - Backend TP Final

Backend inteligente desarrollado con arquitectura N-Tier para un asistente educativo basado en RAG (Retrieval-Augmented Generation).

## Tecnologías Implementadas
- **Runtime:** Node.js + Express
- **Base de Datos:** Supabase (PostgreSQL) con cálculo vectorial en memoria.
- **Inteligencia Artificial:** Google Gemini API (cliente HTTP nativo con auto-descubrimiento).
- **Seguridad y Middlewares:** CORS, Helmet.

## Instalación y Entorno Local
1. Clonar el repositorio.
2. Crear un archivo `.env` en la raíz basándose en la plantilla `.env.sample`.
3. Ejecutar `npm install` para instalar las dependencias.
4. Levantar el entorno de desarrollo con `node server.js` (o `npm run dev`).

## Arquitectura
El proyecto respeta de manera estricta el patrón de diseño **N-Tier** para aislar responsabilidades y garantizar la escalabilidad:
- **Routes:** Manejo de peticiones HTTP y exposición de endpoints.
- **Services:** Lógica de negocio principal, vectorización de texto e integración resiliente con Gemini (manejo de errores 503).
- **Repositories:** Capa de persistencia, consultas a Supabase y cálculo matemático de similitud de coseno.