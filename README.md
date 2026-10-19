# Landing Dynamic · Plataforma de Negocio con Landing Dinámica y Admin No-Code

Plataforma integral para negocios que combina una **Landing Page de alto impacto y conversión** con un **Panel de Administración dinámico, modular y sin código**. 

Permite a cualquier empresa u organización gestionar su presencia digital, catálogo de productos/servicios, embudo de pedidos directos a WhatsApp, y operaciones internas completas desde una única solución escalable.

---

## 🚀 Propuesta de Valor para el Negocio

### 1. Landing Page Dinámica de Alta Conversión
- **Experiencia visual inmersiva**: Portada cinematográfica con paseo en video sincronizado con el scroll (*video scrub* con GSAP y Lenis), animaciones fluidas y optimización para móviles.
- **Identidad visual 100 % configurable**: 4 plantillas completas de diseño preconstruidas (*Finca*, *Órbita*, *Atardecer* y *Lima*), 4 estilos de portada (dividida, panel, centrada y tarjeta), control total de paletas de colores (con validación de contraste WCAG), tipografías y bordes.
- **Catálogo comercial en tiempo real**: Productos, precios, combos y disponibilidad ("Agotado" / "Disponible") sincronizados directamente con la base de datos.
- **Asistente de ventas y pedidos por WhatsApp**:
  - Chatbot guiado paso a paso para selección de productos, cantidades, datos de contacto y entrega (sin costos de IA).
  - Enlace directo a WhatsApp con el pedido y total prellenado.
  - Registro automático del pedido en el panel administrativo.
- **SEO técnico y cumplimiento legal**: Datos estructurados JSON-LD (`LocalBusiness`, catálogo de ofertas, FAQs), Open Graph, sitemap automático, robots.txt y página de política de tratamiento de datos personales conforme a la Ley 1581.

### 2. Panel de Administración Dinámico (`/admin`)
- **Constructor de Módulos No-Code**: Crea y gestiona nuevos módulos operativos al vuelo sin tocar código ni desplegar:
  - **Módulos de Registros**: Formularios dinámicos con más de 14 tipos de campos (fotos, archivos adjuntos, selectores, fechas, relaciones).
  - **Tablas SQL Nativas**: Creación y modificación automática de tablas en PostgreSQL con claves foráneas, enums y filtros.
  - **Consultas SQL / Reportes**: Vistas analíticas y de solo lectura para métricas y totales.
  - CRUD completo, filtros avanzados, ordenación, paginación e **importación/exportación masiva en Excel (.xlsx) y CSV**.
- **Gestor Visual del Sitio Web (CMS en vivo)**:
  - Edición bloque a bloque de textos, fotos, videos, orden y visibilidad.
  - Sistema de borrador, vista previa instantánea y publicación con un clic (regeneración automática vía Deploy Hook).
- **Control de Pedidos y Notificaciones en Vivo**:
  - Alerta sonora y visual en tiempo real de nuevos pedidos en el panel.
  - Notificaciones automáticas a Telegram (opcional).
  - Gestión rápida de estados y contacto directo a WhatsApp del cliente.
- **Métricas y Analítica de Negocio**:
  - Dashboard con métricas de ventas estimadas, pedidos de la semana, visitas y tasa de conversión (sin cookies ni rastreadores invasivos).
- **Seguridad y Control de Acceso**:
  - Autenticación segura con contraseñas encriptadas con PBKDF2-SHA256 y sesiones HttpOnly.
  - Roles de usuario (Administrador total o Usuario con permisos granulares por módulo de lectura o edición).
  - Registro de auditoría completo (`admin.audit_log`) y consola SQL protegida.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend Landing** | [Astro 7](https://astro.build) (prerenderizado / SSR híbrido) · [Tailwind CSS 4](https://tailwindcss.com) · [GSAP](https://gsap.com) · [Lenis](https://lenis.darkroom.engineering) · [Sharp](https://sharp.pixelplumbing.com) |
| **Admin Panel (SPA)** | [React 19](https://react.dev) (isla interactiva SSR sin recarga) · [Radix UI](https://www.radix-ui.com) · [nuvo-ui](https://nuvo-ui.xyz) · [TanStack Table](https://tanstack.com/table) |
| **Base de Datos** | [Neon PostgreSQL](https://neon.tech) Serverless con Connection Pooling (`pg`) |
| **Infraestructura** | [Vercel](https://vercel.com) (Serverless Functions + Edge CDN) · Deploy Hooks |

---

## 📦 Puesta en Marcha

### Requisitos previos
- **Node.js** 22.12 o superior.
- **pnpm** instalado globalmente.
- Instancia de **PostgreSQL** (se recomienda [Neon](https://neon.tech)).

### 1. Instalación de dependencias
```sh
pnpm install
```

### 2. Variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como referencia las siguientes variables:
```ini
# Base de datos Neon (Pooler para funciones serverless, Unpooled para migraciones)
DATABASE_URL="postgresql://usuario:pass@ep-pooler.region.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://usuario:pass@ep-direct.region.neon.tech/neondb?sslmode=require"

# URL pública del sitio (para canónica, sitemap y JSON-LD)
SITE_URL="https://tu-dominio.com"

# Deploy Hook de Vercel (opcional: redespliega la landing al publicar cambios desde el panel)
VERCEL_DEPLOY_HOOK=""

# Notificaciones opcionales a Telegram
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
```

### 3. Migraciones y usuario administrador inicial
Ejecuta las migraciones en la base de datos y genera el primer usuario de acceso al panel:
```sh
# Ejecutar migraciones
pnpm db:migrate

# Ver estado de migraciones
pnpm db:status

# Crear usuario administrador
pnpm admin:create
```

### 4. Servidor de desarrollo
```sh
pnpm dev
```
- **Landing pública:** `http://localhost:4321`
- **Panel de administración:** `http://localhost:4321/admin`

---

## 📋 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia el entorno de desarrollo local con recarga en vivo |
| `pnpm build` | Compila la landing estática y las funciones serverless de la API y el panel |
| `pnpm preview` | Previsualiza el build de producción en local |
| `pnpm db:migrate` | Aplica las migraciones pendientes en PostgreSQL |
| `pnpm db:status` | Consulta el historial y estado de migraciones |
| `pnpm db:seed` | Carga datos iniciales de prueba (opcional) |
| `pnpm admin:create` | Script interactivo para crear o restablecer usuarios administradores |
| `pnpm audit:components` | Auditoría de componentes y consistencia arquitectónica |

---

## 📂 Arquitectura del Proyecto

El código sigue **Clean Architecture modular por *features***, separando estrictamente la presentación del dominio y los servicios de base de datos:

```text
├── db/
│   └── migrations/               # Migraciones SQL estructuradas (0001…0007)
├── public/                       # Archivos estáticos, videos optimizados, manifest
├── scripts/                      # Utilidades de base de datos y administración
├── src/
│   ├── features/
│   │   ├── admin/                # Panel de administración dinámico (SPA React)
│   │   │   ├── appearance/       # Personalización de marca y tema del admin
│   │   │   ├── auth/             # Login, rate-limiting, sesiones y CSRF
│   │   │   ├── core/             # Enrutador cliente SPA, contratos de esquemas y API
│   │   │   ├── dashboard/        # Métricas de negocio y gráficos de pedidos
│   │   │   ├── module-editor/    # Constructor No-Code de módulos y tablas SQL
│   │   │   ├── orders/           # Gestión de pedidos en tiempo real
│   │   │   ├── records/          # CRUD genérico, importador/exportador Excel (.xlsx)
│   │   │   ├── shell/            # Layout del panel, barra lateral y notificaciones
│   │   │   ├── site-editor/      # CMS visual: editor de bloques, temas y plantillas
│   │   │   ├── sql/              # Consola de consultas SQL seguras
│   │   │   └── users/            # Gestión de usuarios, roles y permisos
│   │   └── landing/              # Landing page pública y optimizada
│   │       ├── components/       # Componentes de bloques (Hero, Catálogo, FAQs, etc.)
│   │       ├── domain/           # Tipos de contenido, temas, plantillas y esquemas SEO
│   │       ├── scripts/          # Lógica interactiva cliente (video scrub, animaciones)
│   │       └── server/           # Carga de contenido activo desde base de datos
│   ├── layouts/                  # Layouts base de Astro (metas, fuentes, estilos)
│   ├── pages/
│   │   ├── admin/[...path].astro # Contenedor SSR que monta la SPA del panel
│   │   ├── api/admin/            # Endpoints REST protegidos para el admin
│   │   ├── index.astro           # Entrada principal de la landing dinámica
│   │   └── privacidad.astro      # Política de privacidad y tratamiento de datos
│   ├── shared/                   # Componentes de UI comunes, clientes DB y utilidades
│   └── styles/                   # Tokens globales de diseño y utilidades CSS
```

---

## 🎬 Flujo de Trabajo para Nuevos Negocios

1. **Configurar el Negocio**:
   - Accede a `/admin` con tu usuario administrador.
   - Ve a **Sitio web → Plantillas** y selecciona la que mejor se adapte al rubro (*Finca*, *Órbita*, *Atardecer* o *Lima*).
   - Ajusta colores corporativos, tipografía y disposición del menú.
2. **Definir el Catálogo y Datos**:
   - En **Sitio web → Bloques**, personaliza los textos, imágenes, videos y preguntas frecuentes.
   - Si tu negocio requiere tablas a medida (clientes, reservas, proveedores, inventario), créalas al instante en **Constructor de módulos**.
3. **Publicar Cambios**:
   - Revisa la vista previa en el panel.
   - Presiona **Publicar**: el sitio actualiza la landing en vivo o dispara el *Deploy Hook* para regenerar la versión estática de alto rendimiento.
4. **Recibir y Gestionar Pedidos**:
   - Los clientes exploran la web, usan el chat interactivo o el catálogo y envían sus pedidos a WhatsApp.
   - El equipo de ventas recibe el aviso sonoro en el panel o en Telegram para gestionar la entrega y cambiar el estado del pedido.

---

## 📚 Documentación Adicional

- [Guía Técnica del Admin](ADMIN.md): Arquitectura detallada de la base de datos, esquemas `admin` y `datos`, API y seguridad.
- [Estado del Proyecto](ESTADO.md): Registro de avances, tareas completadas y roadmap.
- [Video Scrub con Scroll](SCROLL-VIDEO.md): Especificación técnica para codificación de videos y keyframes optimizados para scrub.
- [Convenciones de Código](AGENTS.md): Reglas de desarrollo y separación de estilos/lógica en Astro.
