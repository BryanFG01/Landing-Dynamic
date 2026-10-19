import { unitPriceOf } from '../domain/chat';
import { plantillaEnUso } from '../domain/plantillas';
import { links, rich, type BloqueProductos, type SiteContent } from '../domain/sitio';

export function dishesView(bloque: BloqueProductos, site: SiteContent) {
  const plantilla = plantillaEnUso(site);
  const isShop = plantilla === 'shop';
  const siteLinks = links(site);

  const items = bloque.items.map((producto, i) => {
    const id = producto.id ?? `prod-${i}`;
    const unitPrice = unitPriceOf(producto.precio);
    return {
      id,
      index: i,
      nombre: producto.nombre,
      detalle: producto.detalle,
      precio: producto.precio,
      unitPrice,
      foto: producto.foto,
      agotado: Boolean(producto.agotado),
    };
  });

  return {
    bloque,
    site,
    items,
    isShop,
    pedirLink: siteLinks.pedir,
    notaHtml: bloque.nota ? rich(bloque.nota) : '',
  };
}
