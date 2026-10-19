import { conMarca, PRIVACIDAD_URL, type SiteContent } from '../domain/sitio';
import type { CartConfigData } from './Cart.types';

export function cartView(site: SiteContent) {
  const data: CartConfigData & { aviso: string; privacidad: string } = {
    whatsapp: site.contacto.whatsapp,
    marca: site.marca.nombre,
    mensajePedido: site.contacto.mensajePedido,
    registrar: site.chat.registrar === 'si',
    modoPago: site.pagos?.modo ?? 'whatsapp',
    pasarela: site.pagos?.pasarela ?? 'mercadopago',
    llavePublica: site.pagos?.llavePublica ?? '',
    urlCheckout: site.pagos?.urlCheckout ?? '',
    textoBotonPasarela: site.pagos?.textoBotonPasarela || 'Pagar con PSE / Tarjeta / Nequi',
    textoBotonWhatsApp: site.pagos?.textoBotonWhatsApp || 'Pedir por WhatsApp',
    aviso: conMarca(site.legal.aceptacion, site),
    privacidad: PRIVACIDAD_URL,
  };

  const side = site.chat.posicion === 'izquierda' ? 'right' : 'left';

  return {
    data,
    json: JSON.stringify(data).replaceAll('<', '\\u003c'),
    side,
  };
}
