// Botón flotante de ayuda: explica cómo construir queries, módulos, tablas y filtros en el admin.
// Se monta dentro del AdminShell y siempre flota en la esquina inferior derecha.
import * as React from 'react';
import { Modal } from '@/shared/ui/modal';
import { Icon } from '@/features/admin/core/ui/icons';
import type { IconKey } from '@/features/admin/core/ui/icons';
import type { HelpSection } from './HelpButton.types';

// ─── Contenido de ayuda ────────────────────────────────────────────────────────

const SECTIONS: HelpSection[] = [
  {
    id: 'queries',
    title: 'Construir Queries SQL',
    icon: 'terminal',
    content: [
      {
        label: 'Módulo tipo "records" (sin SQL)',
        description:
          'Los registros se guardan en admin.records. No necesitas SQL. El backend los busca con los filtros que defines en el campo filters del módulo.',
      },
      {
        label: 'Módulo tipo "sql" (consulta personalizada)',
        description:
          'Escribe una SELECT en el campo "Consulta SQL" del constructor. Solo lectura; el panel la pagina y filtra automáticamente.',
        code: `SELECT p.nombre, p.precio, c.nombre AS categoria
FROM datos.productos p
JOIN datos.categorias c ON c.id = p.categoria_id
WHERE p.activo = true
ORDER BY p.nombre`,
      },
      {
        label: 'Probar la query antes de guardar',
        description:
          'En el constructor de módulos abre la consola SQL (ícono de terminal) o usa /admin/sql. El endpoint POST /api/admin/sql/preview te devuelve columnas y 20 filas de prueba.',
      },
      {
        label: 'Filtros en queries SQL',
        description:
          'Usa $1, $2… como parámetros. El backend inyecta los valores según el operador del filtro. Nunca concatenes strings en el SQL.',
        code: `-- El filtro "nombre" con control "text" genera:
WHERE nombre ILIKE '%' || $1 || '%'`,
      },
    ],
  },
  {
    id: 'modules',
    title: 'Crear un Módulo',
    icon: 'package',
    content: [
      {
        label: 'Ir al Constructor de módulos',
        description:
          'Menú lateral → Módulos (o /admin/modulos). Haz clic en "+ Nuevo módulo". Rellena el nombre, grupo del menú, icono y tipo (records o sql).',
      },
      {
        label: 'Tipos de módulo',
        description:
          '"records": guarda registros en admin.records con data jsonb. Ideal para catálogos y formularios simples. "sql": muestra solo lectura de cualquier consulta SQL sobre el esquema datos.',
      },
      {
        label: 'Campos del formulario (fields)',
        description:
          'Define cada campo con su key, label y type. El constructor tiene un editor visual; también puedes pegar el JSON directamente.',
        code: `[
  { "key": "nombre", "label": "Nombre", "type": "text", "required": true },
  { "key": "precio", "label": "Precio", "type": "currency", "min": 0 },
  { "key": "estado", "label": "Estado", "type": "select",
    "options": ["activo", "inactivo"] }
]`,
      },
      {
        label: 'Activar y publicar',
        description:
          'Marca el módulo como "Activo" antes de guardar. Aparece en el menú de inmediato sin recargar la página ni desplegar.',
      },
    ],
  },
  {
    id: 'tables',
    title: 'Configurar Tablas',
    icon: 'table',
    content: [
      {
        label: 'Qué es column_configs',
        description:
          'Define qué columnas muestra la tabla y cómo las formatea. El campo "column" puede ser cualquier key de fields, o uno del sistema: id, created_at, updated_at.',
        code: `[
  { "column": "nombre",     "headerText": "Nombre",  "data_type": "text" },
  { "column": "precio",     "headerText": "Precio",  "data_type": "currency",
    "align": "right", "sortable": true },
  { "column": "estado",     "headerText": "Estado",  "data_type": "badge" },
  { "column": "created_at", "headerText": "Alta",    "data_type": "date" }
]`,
      },
      {
        label: 'Tipos de datos disponibles',
        description:
          'text · number · currency ($ con separador de miles) · date (DD/MM/YYYY) · datetime · boolean (Sí/No) · badge (pastilla de color) · list (valores separados por coma).',
      },
      {
        label: 'Opciones extra por columna',
        description:
          '"sortable": true permite ordenar esa columna. "align": "right" | "center" alinea el texto. "null_display": "—" muestra ese texto cuando el valor está vacío.',
      },
    ],
  },
  {
    id: 'filters',
    title: 'Agregar Filtros',
    icon: 'gear',
    content: [
      {
        label: 'Estructura de un filtro',
        description:
          '"name" es la clave interna (única). "label" es lo que ve el usuario. "field" es el key del campo. "control" define el control de UI. "operator" el comparador SQL.',
        code: `[
  { "name": "buscar",      "label": "Buscar",
    "field": "*",          "control": "text" },
  { "name": "estado",      "label": "Estado",
    "field": "estado",     "control": "select",
    "options": ["activo","inactivo"] },
  { "name": "precio_max",  "label": "Precio hasta",
    "field": "precio",     "control": "number", "operator": "lte" },
  { "name": "fecha",       "label": "Fecha",
    "field": "created_at", "control": "daterange" }
]`,
      },
      {
        label: 'Buscar en todos los campos',
        description:
          'Usa "field": "*" con control "text". El backend busca en todos los valores del registro con ILIKE. Solo para módulos de tipo records.',
      },
      {
        label: 'Operadores numéricos',
        description:
          '"operator": "eq" (=) · "gte" (>=) · "lte" (<=). Para rangos usa dos filtros: uno con gte y otro con lte sobre el mismo field.',
      },
      {
        label: 'Filtro de rango de fechas',
        description:
          'Usa "control": "daterange" para mostrar un selector de rango. El backend genera WHERE campo BETWEEN desde AND hasta automáticamente.',
        code: `{ "name": "entrega", "label": "Fecha de entrega",
  "field": "fecha_entrega", "control": "daterange" }`,
      },
    ],
  },
];

// ─── Sub-componentes ───────────────────────────────────────────────────────────

function CodeBlock({ code }: { readonly code: string }) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  }

  return (
    <div className="relative mt-2 rounded-lg border border-border bg-muted/50">
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Copiar código"
      >
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
    </div>
  );
}

function HelpItem({ item }: { readonly item: HelpSection['content'][number] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-lg border border-border bg-background/60 transition-colors hover:border-primary/30">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={() => {
          setOpen((v) => !v);
        }}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground">{item.label}</span>
        <span
          className="shrink-0 text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <p className="text-sm text-muted-foreground">{item.description}</p>
          {item.code !== undefined && <CodeBlock code={item.code} />}
        </div>
      )}
    </div>
  );
}

function SectionTab({
  section,
  active,
  onClick,
}: {
  readonly section: HelpSection;
  readonly active: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      ].join(' ')}
    >
      <Icon name={section.icon as IconKey} className="size-4 shrink-0" />
      {section.title}
    </button>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function HelpButton() {
  const [open, setOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(SECTIONS[0].id);

  const section = SECTIONS.find((s) => s.id === activeSection) ?? SECTIONS[0];

  return (
    <>
      {/* Botón flotante tipo signo de pregunta */}
      <button
        type="button"
        id="admin-help-button"
        onClick={() => {
          setOpen(true);
        }}
        aria-label="Abrir ayuda del panel"
        className={[
          'fixed bottom-6 right-6 z-40',
          'flex size-12 items-center justify-center',
          'rounded-full bg-primary text-primary-foreground shadow-lg',
          'ring-2 ring-primary/30',
          'transition-all duration-200 hover:scale-110 hover:shadow-xl hover:ring-4',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring',
        ].join(' ')}
      >
        {/* Ícono de interrogación (Phosphor Question) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72C154.42,136.31,168,121.17,168,108,168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
        </svg>
      </button>

      {/* Modal de ayuda con pestañas */}
      <Modal
        open={open}
        onOpenChange={setOpen}
        maxWidth="lg"
      >
        <div className="flex flex-col gap-3">
          {/* Cabecera con icono Phosphor */}
          <div className="pr-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Icon name="wrench" className="size-5 shrink-0 text-primary" />
              Guía del panel de administración
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cómo construir queries, crear módulos, configurar tablas y agregar filtros.
            </p>
          </div>

          {/* Pestañas de sección — siempre visibles, no hacen scroll */}
          <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-muted/40 p-2">
            {SECTIONS.map((s) => (
              <SectionTab
                key={s.id}
                section={s}
                active={s.id === activeSection}
                onClick={() => {
                  setActiveSection(s.id);
                }}
              />
            ))}
          </div>

          {/* Área scrollable solo para el acordeón */}
          <div
            className={[
              'flex flex-col gap-2 overflow-y-auto',
              'max-h-[52vh] pr-1',
              // Scrollbar delgado y discreto
              '[&::-webkit-scrollbar]:w-1.5',
              '[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border',
              '[&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/40',
            ].join(' ')}
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Icon name={section.icon as IconKey} className="size-3.5 shrink-0" />
              {section.title}
            </p>
            <div className="flex flex-col gap-2 pb-1">
              {section.content.map((item) => (
                <HelpItem key={item.label} item={item} />
              ))}
            </div>
          </div>

          {/* Pie con links directos — siempre visible */}
          <p className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
            Consola interactiva en{' '}
            <a
              href="/admin/sql"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() => {
                setOpen(false);
              }}
            >
              /admin/sql
            </a>{' '}
            · Constructor de módulos en{' '}
            <a
              href="/admin/modulos"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() => {
                setOpen(false);
              }}
            >
              /admin/modulos
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
}
