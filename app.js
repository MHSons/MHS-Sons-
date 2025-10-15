// Public store: load products from Firestore and display
const productsEl = document.getElementById('products');
const searchInput = document.getElementById('searchInput');

// CART util
const CART_KEY = 'sm_cart_v1';
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }catch(e){ return {}; } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartUI(); }
function updateCartUI(){
  const cart = loadCart();
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent = count;
  const total = Object.entries(cart).reduce((sum,[id,qty])=>{
    // we don't have product prices locally here; store price when adding
    return sum + (qty.price || 0) * (qty.qty || qty);
  }, 0);
  // total calculation handled differently below
}

// render products
function renderProducts(items){
  const q = (searchInput.value || '').toLowerCase().trim();
  productsEl.innerHTML = items.filter(p => {
    if(!p.name) return false;
    return p.name.toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q);
  }).map(p => `
    <article class="product">
      <img src="${p.imageUrl || 'https://via.placeholder.com/400x300?text='+encodeURIComponent(p.name)}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${p.price.toFixed(2)}</div>
      <p>${p.desc || ''}</p>
      <div>
        <button onclick="addToCart('${p.id}', ${p.price})">Add to cart</button>
      </div>
    </article>
  `).join('');
}

// load from firestore
let unsub = null;
function startListening(){
  unsub = db.collection('products').where('active','==',true).orderBy('createdAt','desc')
    .onSnapshot(snap=>{
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      window.__PRODUCTS = items; // for debugging
      renderProducts(items);
    }, err => {
      console.error('Products listen error', err);
      productsEl.innerHTML = '<p class="muted">Could not load products.</p>';
    });
}

function addToCart(id, price){
  const cart = loadCart();
  // store as { qty: n, price }
  if(!cart[id]) cart[id] = { qty: 0, price };
  cart[id].qty++;
  saveCart(cart);
  alert('Added to cart');
}

// cart modal
const cartModal = document.getElementById('cartModal');
document.getElementById('openCartBtn').addEventListener('click', ()=> {
  renderCartItems();
  cartModal.classList.remove('hidden');
});
document.getElementById('closeCartBtn').addEventListener('click', ()=>cartModal.classList.add('hidden'));
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  alert('Demo checkout — integrate a payment provider or order backend.');
});

function renderCartItems(){
  const itemsEl = document.getElementById('cartItems');
  const cart = loadCart();
  const ids = Object.keys(cart);
  if(ids.length === 0){ itemsEl.innerHTML = '<li>Your cart is empty</li>'; document.getElementById('cartTotal').textContent = '0.00'; return; }
  let total = 0;
  itemsEl.innerHTML = ids.map(id=>{
    const c = cart[id];
    const line = c.qty * c.price;
    total += line;
    return `<li><strong>${(window.__PRODUCTS||[]).find(x=>x.id===id)?.name || id}</strong> — ${c.qty} × ${c.price.toFixed(2)} = ${line.toFixed(2)}
      <div><button onclick="changeQty('${id}', ${c.qty-1})">-</button> <button onclick="changeQty('${id}', ${c.qty+1})">+</button> <button onclick="removeItem('${id}')">Remove</button></div>
    </li>`;
  }).join('');
  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function changeQty(id,newQty){
  const cart = loadCart();
  if(newQty <= 0) delete cart[id]; else cart[id].qty = newQty;
  saveCart(cart);
  renderCartItems();
}
function removeItem(id){ const cart = loadCart(); delete cart[id]; saveCart(cart); renderCartItems(); }

searchInput.addEventListener('input', ()=> {
  if(window.__PRODUCTS) renderProducts(window.__PRODUCTS);
});

// init
startListening();
updateCartUI();
