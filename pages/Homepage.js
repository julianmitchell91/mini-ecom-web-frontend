const products = [
  { id: 1, name: 'T-shirt', price: 20.00, inventory: 5, image: null },
  { id: 2, name: 'Coffee Mug', price: 12.00, inventory: 2, image: null },
  { id: 3, name: 'Sticker', price: 2.00, inventory: 0, image: null }
];

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, msgData);
  const bytes = new Uint8Array(signature);

  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

function currency(n) {
  return `$${n.toFixed(2)}`;
}

function createCard(p, onPurchase) {
  const container = document.createElement('div');
  container.className = 'bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm';

  const body = document.createElement('div');
  body.className = 'mb-4';

  body.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-lg font-semibold text-gray-900">${p.name}</h4>
        <div class="text-sm text-gray-500 mt-1">${currency(p.price)}</div>
      </div>
      <div class="text-xs text-gray-500">ID: ${p.id}</div>
    </div>
    <p class="mt-3 text-sm text-gray-600">Inventory: <span id="inventory-${p.id}">${p.inventory}</span></p>
  `;

  const actions = document.createElement('div');
  actions.className = 'flex items-center justify-between';

  const buyBtn = document.createElement('button');
  buyBtn.className = 'px-4 py-2 rounded bg-brand text-white hover:bg-teal-600 disabled:opacity-60';
  buyBtn.textContent = 'Buy 1';
  buyBtn.disabled = p.inventory <= 0;

  const details = document.createElement('div');
  details.className = 'text-xs text-gray-500';
  details.textContent = p.inventory > 0 ? 'In stock' : 'Out of stock';

  buyBtn.addEventListener('click', async () => {
    buyBtn.disabled = true;
    await onPurchase(p, buyBtn, details);
  });

  actions.appendChild(details);
  actions.appendChild(buyBtn);

  container.appendChild(body);
  container.appendChild(actions);

  return container;
}

export default function initHomepage(rootEl) {
  // clear root
  rootEl.innerHTML = '';

  // Activity panel
  const activitySection = document.createElement('section');
  activitySection.className = 'mb-8';
  activitySection.innerHTML = `
    <h3 class="text-lg font-medium mb-2">Activity</h3>
    <div id="activity" class="min-h-[56px] bg-white border border-gray-200 rounded p-3 text-sm text-gray-700">
      Actions and results will appear here.
    </div>
  `;

  // Products grid
  const productsSection = document.createElement('section');
  productsSection.innerHTML = `<h2 class="text-xl font-medium mb-4">Products</h2>`;
  const productsGrid = document.createElement('div');
  productsGrid.id = 'products';
  productsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-4';
  productsSection.appendChild(productsGrid);

  rootEl.appendChild(productsSection);
  rootEl.appendChild(activitySection);

  const activityEl = document.getElementById('activity');

  function info(msg) {
    activityEl.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  }

  async function handlePurchase(product, buyBtn, detailsEl) {
    info(`Preparing purchase for product ${product.id}...`);
    const payload = JSON.stringify({ productId: product.id, qty: 1 });

    // Demo secret to match backend tests (dev only)
    const secret = 'dev-secret';
    let token;
    try {
      token = await hmacHex(secret, payload);
    } catch (err) {
      info('Failed to compute token: ' + err.message);
      buyBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, qty: 1, paymentToken: token })
      });

      const data = await res.json();

      if (res.status === 201) {
        info(`Order created (id=${data.order.id}) for product ${product.id}`);
        product.inventory -= 1;

        const invEl = document.getElementById(`inv-${product.id}`);
        if (invEl) invEl.textContent = product.inventory;

        if (product.inventory <= 0) {
          buyBtn.disabled = true;
          detailsEl.textContent = 'Out of stock';
        } else {
          buyBtn.disabled = false;
        }
      } else {
        info(`Purchase failed: ${JSON.stringify(data)}`);
        buyBtn.disabled = product.inventory <= 0;
      }
    } catch (err) {
      info('Network error: ' + err.message);
      buyBtn.disabled = product.inventory <= 0;
    }
  }

  // initial render
  function render() {
    productsGrid.innerHTML = '';
    products.forEach(p => {
      const card = createCard(p, handlePurchase);
      productsGrid.appendChild(card);
    });
  }

  render();
}