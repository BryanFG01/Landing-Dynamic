// Tipos del botón flotante de ayuda del panel de administración.

export interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: HelpItem[];
}

export interface HelpItem {
  label: string;
  description: string;
  code?: string;
}
