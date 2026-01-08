============================================================
SISTEMA DE MONITOREO ACUÍCOLA "AQUASMART" - UPIIT 2026
============================================================

AquaSmart es una plataforma integral diseñada para la optimización 
de la producción de Tilapia mediante el monitoreo digital de 
parámetros fisicoquímicos y la automatización de estrategias nutricionales.

------------------------------------------------------------
REQUISITOS PREVIOS
------------------------------------------------------------
1. XAMPP Control Panel (Para MySQL y servidor Apache).
2. Node.js (Versión 18.0 o superior).
3. Navegador Web moderno (Google Chrome o Microsoft Edge).

------------------------------------------------------------
COMANDOS DE INSTALACIÓN (DEPENDENCIAS)
------------------------------------------------------------

Si es la primera vez que descargas el proyecto, ejecuta estos 
comandos para instalar todas las librerías necesarias:

PASO A: INSTALACIÓN EN EL BACKEND
1. Abre una terminal en la carpeta /backend y ejecuta:
   npm install express mysql2 cors dotenv jsonwebtoken bcryptjs

PASO B: INSTALACIÓN EN EL FRONTEND
1. Abre una terminal en la carpeta /frontend y ejecuta:
   npm install axios chart.js react-chartjs-2 bootstrap jspdf jspdf-autotable html2canvas react-router-dom

------------------------------------------------------------
PASOS PARA LA PUESTA EN MARCHA
------------------------------------------------------------

PASO 1: CONFIGURACIÓN DE LA BASE DE DATOS
1. Inicie XAMPP y active los módulos "Apache" y "MySQL".
2. Diríjase a http://localhost/phpmyadmin
3. Cree una nueva base de datos llamada: proyecto_acuicola
4. Importe el archivo SQL proporcionado en la pestaña "SQL".

PASO 2: SERVIDOR (BACKEND)
1. En la terminal de /backend, verifique su archivo .env:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=proyecto_acuicola
   JWT_SECRET=palabra_secreta_upiit
2. Inicie con: node server.js

PASO 3: INTERFAZ (FRONTEND)
1. En la terminal de /frontend, inicie con: npm start
2. Acceda a: http://localhost:3000

------------------------------------------------------------
FUNCIONALIDADES CLAVE DE LA VERSIÓN FINAL
------------------------------------------------------------
- GESTIÓN TÉCNICA: Cálculo automático de biomasa (kg) y densidad.
- PROGRESO DE DÍAS: Contador real de días desde la siembra y 
  barra de porcentaje de madurez del pez.
- NUTRICIÓN INTELIGENTE: Algoritmo que recomienda el pellet 
  exacto (Iniciador, Crecimiento, Desarrollo, Engorda) según edad.
- BITÁCORA CLÍNICA: Registro de bajas y síntomas para 
  prevención de enfermedades (Ich, Streptococcus, etc.).
- MONITOREO GRÁFICO: Comparativa visual de Temperatura Agua 
  vs. Ambiente y niveles de pH.
- REPORTE MAESTRO: Generación de PDF con tablas estadísticas 
  y capturas automáticas de las gráficas de sensores.
- ALERTAS DE SEGURIDAD: Indicadores rojos para temperaturas 
  críticas (>32°C) y niveles de stock de alimento bajos.

------------------------------------------------------------
CRÉDITOS TÉCNICOS
------------------------------------------------------------
- Stack: MERN (MySQL, Express, React, Node).
- UI/UX: Glassmorphism Design.
- Reportes: jsPDF + html2canvas.

============================================================
Desarrollado para el Proyecto de Ingeniería - UPIIT IPN
Innovación Tecnológica para la Sustentabilidad Acuícola
============================================================