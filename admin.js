// Admin: login, CRUD products
const authSection = document.getElementById('authSection');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authMsg = document.getElementById('authMsg');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value;
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) {
    authMsg.textContent = 'Login failed: ' + e.message;
  }
});

logoutBtn.addEventListener('click', ()=> auth.signOut());

auth.onAuthStateChanged(user => {
  if(user){
    authSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loadProductsList();
  } else {
    authSection.classList.remove('hidden');
    dashboard.classList.add('hidden');
    logoutBtn.classList.add('hidden');
  }
});

// product form
const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('pId').value || null;
  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value) || 0;
  const stock = parseInt(document.getElementById('stock').value) || 0;
  const category = document.getElementById('category').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const file = document.getElementById('imageFile').files[0];

  const payload = { name, price, stock, category, desc, active: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };

  try {
    if(file) {
      const ref = storage.ref().child(`product-images/${Date.now()}_${file.name}`);
      const snap = await ref.put(file);
      const url = await snap.ref.getDownloadURL();
      payload.imageUrl = url;
    }
    if(id){
      await db.collection('products').doc(id).update(payload);
      alert('Product updated');
    } else {
      payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      const doc = await db.collection('products').add(payload);
      alert('Product added');
    }
    productForm.reset();
    loadProductsList();
  } catch (e) {
    alert('Error: ' + e.message);
  }
});

const productListEl = document.getElementById('productList');
async function loadProductsList(){
  productListEl.innerHTML = '<li>Loading...</li>';
  const snap = await db.collection('products').orderBy('createdAt','desc').get();
  productListEl.innerHTML = snap.docs.map(d => {
    const p = { id: d.id, ...d.data() };
    return `<li>
      <strong>${p.name}</strong> — ${p.price.toFixed(2)} — stock: ${p.stock || 0}
      <div>
        <button onclick="populateEdit('${p.id}')">Edit</button>
        <button onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
      </li>`;
  }).join('');
}

window.populateEdit = async function(id){
  const doc = await db.collection('products').doc(id).get();
  const p = doc.data();
  document.getElementById('pId').value = id;
  document.getElementById('name').value = p.name || '';
  document.getElementById('price').value = p.price || 0;
  document.getElementById('stock').value = p.stock || 0;
  document.getElementById('category').value = p.category || '';
  document.getElementById('desc').value = p.desc || '';
};

window.deleteProduct = async function(id){
  if(!confirm('Delete this product?')) return;
  await db.collection('products').doc(id).delete();
  loadProductsList();
};
