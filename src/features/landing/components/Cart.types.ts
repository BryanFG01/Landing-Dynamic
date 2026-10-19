import type { SiteContent } from '../domain/sitio';

export interface Props {
  site: SiteContent;
}

export interface CartConfigData {
  whatsapp: string;
  marca: string;
  mensajePedido: string;
  registrar: boolean;
  modoPago?: 'whatsapp' | 'pasarela' | 'ambos';
  pasarela?: 'mercadopago' | 'wompi';
  llavePublica?: string;
  urlCheckout?: string;
  textoBotonPasarela?: string;
  textoBotonWhatsApp?: string;
}
