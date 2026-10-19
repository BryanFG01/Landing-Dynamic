import { formatPesos } from '../domain/chat';
import type { CartConfigData } from '../components/Cart.types';

export interface CartItem {
  id: string;
  nombre: string;
  precio: string;
  unitPrice: number | null;
  foto?: string;
  qty: number;
}

const STORAGE_KEY = 'landing_shop_cart_items';
const CUSTOMER_KEY = 'landing_shop_customer';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function loadCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    return raw ? (JSON.parse(raw) as { nombre?: string; direccion?: string; nota?: string }) : {};
  } catch {
    return {};
  }
}

function saveCustomer(customer: { nombre?: string; direccion?: string; nota?: string }) {
  try {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  } catch {}
}

export function initCart() {
  const root = document.querySelector<HTMLElement>('[data-cart-root]');
  if (!root) return;

  const configJson = root.querySelector('[data-cart-config]')?.textContent ?? '{}';
  const config = JSON.parse(configJson) as CartConfigData;

  const launcher = root.querySelector<HTMLButtonElement>('[data-cart-launcher]');
  const badge = root.querySelector<HTMLElement>('[data-cart-badge]');
  const countEl = root.querySelector<HTMLElement>('[data-cart-count]');
  const totalEl = root.querySelector<HTMLElement>('[data-cart-total]');
  const backdrop = root.querySelector<HTMLElement>('[data-cart-backdrop]');
  const drawer = root.querySelector<HTMLElement>('[data-cart-drawer]');
  const itemsContainer = root.querySelector<HTMLElement>('[data-cart-items]');
  const drawerTotalEl = root.querySelector<HTMLElement>('[data-cart-drawer-total]');
  const drawerCountEl = root.querySelector<HTMLElement>('[data-cart-drawer-count]');
  const checkoutBtn = root.querySelector<HTMLButtonElement>('[data-cart-checkout]');
  const gatewayBtn = root.querySelector<HTMLButtonElement>('[data-cart-gateway]');

  const inputNombre = root.querySelector<HTMLInputElement>('[data-cart-input-nombre]');
  const inputDireccion = root.querySelector<HTMLInputElement>('[data-cart-input-direccion]');
  const inputNota = root.querySelector<HTMLInputElement>('[data-cart-input-nota]');

  // Cargar datos previos de cliente si existen
  const savedCustomer = loadCustomer();
  if (inputNombre && savedCustomer.nombre) inputNombre.value = savedCustomer.nombre;
  if (inputDireccion && savedCustomer.direccion) inputDireccion.value = savedCustomer.direccion;
  if (inputNota && savedCustomer.nota) inputNota.value = savedCustomer.nota;

  let items = loadCart();

  function calcTotals() {
    let count = 0;
    let total = 0;
    let byWeight = false;

    for (const item of items) {
      count += item.qty;
      if (item.unitPrice !== null) {
        total += item.qty * item.unitPrice;
      } else {
        byWeight = true;
      }
    }

    const formattedTotal = total > 0 ? (byWeight ? `~${formatPesos(total)}` : formatPesos(total)) : (byWeight ? 'Por peso' : '$0');

    return { count, total, byWeight, formattedTotal };
  }

  function render() {
    const { count, total, byWeight, formattedTotal } = calcTotals();

    // Actualizar lanzador flotante
    if (launcher) {
      launcher.dataset.empty = count === 0 ? 'true' : 'false';
    }
    if (countEl) countEl.textContent = String(count);
    if (totalEl) totalEl.textContent = formattedTotal;

    // Actualizar contadores del header (si existen)
    document.querySelectorAll<HTMLElement>('[data-header-cart-count]').forEach((el) => {
      el.textContent = String(count);
      el.dataset.empty = count === 0 ? 'true' : 'false';
    });

    if (drawerCountEl) drawerCountEl.textContent = `(${count})`;
    if (drawerTotalEl) drawerTotalEl.textContent = formattedTotal;

    if (checkoutBtn) {
      checkoutBtn.disabled = count === 0;
    }

    // Renderizar lista en drawer
    if (itemsContainer) {
      if (items.length === 0) {
        itemsContainer.innerHTML = `
          <div class="cart-empty">
            <svg class="cart-empty-icon" viewBox="0 0 256 256" fill="currentColor">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z" opacity="0.4"/>
            </svg>
            <p class="font-medium text-sm text-neutral-600">Tu carrito está vacío</p>
            <p class="text-xs text-neutral-400">Elige tus productos favoritos y agrégalos aquí para armar tu pedido.</p>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = '';
        for (const item of items) {
          const itemEl = document.createElement('div');
          itemEl.className = 'cart-item';

          const imgSrc = item.foto || '';
          const imgMarkup = imgSrc
            ? `<img src="${imgSrc}" alt="${item.nombre}" class="cart-item-img" />`
            : `<div class="cart-item-img flex items-center justify-center text-neutral-400 text-xs">Sin foto</div>`;

          const subtotal = item.unitPrice !== null ? formatPesos(item.unitPrice * item.qty) : item.precio;

          itemEl.innerHTML = `
            ${imgMarkup}
            <div class="cart-item-info">
              <span class="cart-item-name" title="${item.nombre}">${item.nombre}</span>
              <span class="cart-item-price">${subtotal}</span>
            </div>
            <div class="cart-item-actions">
              <div class="cart-stepper">
                <button type="button" class="cart-stepper-btn" data-step="-1" data-id="${item.id}" aria-label="Disminuir cantidad">−</button>
                <span class="cart-stepper-qty">${item.qty}</span>
                <button type="button" class="cart-stepper-btn" data-step="1" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
              </div>
              <button type="button" class="cart-item-remove" data-remove="${item.id}" title="Eliminar producto">
                <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                </svg>
              </button>
            </div>
          `;

          itemsContainer.appendChild(itemEl);
        }
      }
    }
  }

  function openDrawer() {
    if (backdrop) backdrop.dataset.open = 'true';
    if (drawer) drawer.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (backdrop) backdrop.dataset.open = 'false';
    if (drawer) drawer.dataset.open = 'false';
    document.body.style.overflow = '';
  }

  function animateBadge() {
    if (badge) {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
  }

  function addItem(product: { id: string; nombre: string; precio: string; unitPrice: number | null; foto?: string }) {
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(20, existing.qty + 1);
    } else {
      items.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        unitPrice: product.unitPrice,
        foto: product.foto,
        qty: 1,
      });
    }
    saveCart(items);
    render();
    animateBadge();
    openDrawer();
  }

  function updateQty(id: string, delta: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      items = items.filter((i) => i.id !== id);
    } else {
      item.qty = Math.min(20, item.qty);
    }
    saveCart(items);
    render();
    animateBadge();
  }

  function removeItem(id: string) {
    items = items.filter((i) => i.id !== id);
    saveCart(items);
    render();
    animateBadge();
  }

  // Eventos globales del carrito
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Click en "Añadir al carrito" desde cualquier producto
    const addBtn = target.closest<HTMLElement>('[data-cart-add]');
    if (addBtn) {
      e.preventDefault();
      const id = addBtn.dataset.productId || 'p';
      const nombre = addBtn.dataset.productName || 'Producto';
      const precio = addBtn.dataset.productPrice || '';
      const unitPriceRaw = addBtn.dataset.productUnitPrice;
      const unitPrice = unitPriceRaw && unitPriceRaw !== 'null' ? Number(unitPriceRaw) : null;
      const foto = addBtn.dataset.productImage || '';

      addItem({ id, nombre, precio, unitPrice, foto });

      // Feedback en botón
      const label = addBtn.querySelector('[data-cart-btn-label]');
      if (label) {
        const originalText = label.textContent;
        label.textContent = '¡Añadido! ✓';
        setTimeout(() => {
          label.textContent = originalText;
        }, 1200);
      }
      return;
    }

    // Abrir carrito
    if (target.closest('[data-cart-open]')) {
      e.preventDefault();
      openDrawer();
      return;
    }

    // Cerrar carrito
    if (target.closest('[data-cart-close]') || target.matches('[data-cart-backdrop]')) {
      e.preventDefault();
      closeDrawer();
      return;
    }

    // Stepper dentro del drawer (+ / -)
    const stepBtn = target.closest<HTMLButtonElement>('[data-step]');
    if (stepBtn) {
      const id = stepBtn.dataset.id;
      const step = Number(stepBtn.dataset.step);
      if (id && step) updateQty(id, step);
      return;
    }

    // Eliminar producto del drawer
    const removeBtn = target.closest<HTMLButtonElement>('[data-remove]');
    if (removeBtn) {
      const id = removeBtn.dataset.remove;
      if (id) removeItem(id);
      return;
    }
  });

  // Guardar inputs del cliente al cambiar
  const saveInputs = () => {
    saveCustomer({
      nombre: inputNombre?.value.trim() || '',
      direccion: inputDireccion?.value.trim() || '',
      nota: inputNota?.value.trim() || '',
    });
  };
  inputNombre?.addEventListener('input', saveInputs);
  inputDireccion?.addEventListener('input', saveInputs);
  inputNota?.addEventListener('input', saveInputs);

  // Cerrar con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.dataset.open === 'true') {
      closeDrawer();
    }
  });

  // Enviar pedido por WhatsApp
  checkoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const nombre = inputNombre?.value.trim() || '';
    const direccion = inputDireccion?.value.trim() || '';
    const nota = inputNota?.value.trim() || '';

    saveInputs();

    // Construir líneas del pedido
    const { formattedTotal } = calcTotals();
    const productLines = items.map((i) => {
      const lineSubtotal = i.unitPrice !== null ? formatPesos(i.unitPrice * i.qty) : i.precio;
      return `• ${i.qty} × ${i.nombre} (${lineSubtotal})`;
    });

    const lines = [
      `¡Hola! Quiero hacer un pedido en ${config.marca || 'la tienda'}:`,
      '',
      ...productLines,
      `Total: ${formattedTotal}`,
    ];

    if (nombre) lines.push('', `👤 Nombre: ${nombre}`);
    if (direccion) lines.push(`📍 Dirección / Barrio: ${direccion}`);
    if (nota) lines.push(`📝 Nota: ${nota}`);

    const message = lines.join('\n');
    const whatsappUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

    // Registrar en el panel si está activo (keepalive)
    if (config.registrar) {
      try {
        fetch('/api/pedido', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            items: items.map((i) => ({ id: i.id, qty: i.qty })),
            nombre: nombre || 'Cliente Web',
            telefono: config.whatsapp,
            direccion: direccion || 'Por confirmar',
            entrega: 'Lo antes posible',
            nota,
            website: '',
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    }

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });

  // Pagar con Pasarela de Pago (Mercado Pago / Wompi)
  gatewayBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    saveInputs();
    const { total } = calcTotals();
    const pasarelaNombre = config.pasarela === 'wompi' ? 'Wompi Bancolombia' : 'Mercado Pago';

    if (config.urlCheckout) {
      window.open(config.urlCheckout, '_blank', 'noopener,noreferrer');
      return;
    }

    alert(
      `Iniciando pago seguro con ${pasarelaNombre} por valor de ${formatPesos(total)}.\n\n` +
      `Para pagos en producción con PSE, Nequi y tarjetas de crédito, ingresa a tu panel de administración:\n` +
      `"Sitio web → Pasarela y pagos" para colocar tu Llave Pública o tu Enlace de Checkout.`
    );
  });

  // Primer render al cargar
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCart);
} else {
  initCart();
}
