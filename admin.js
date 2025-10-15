import { app, db, auth, storage } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");
const loginBtn = document.getElementById("loginBtn");
const addBtn = document.getElementById("addBtn");
const productList = document.getElementById("product-list");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    adminSection.style.display = "block";
    loadProducts();
  } else {
    loginSection.style.display = "block";
    adminSection.style.display = "none";
  }
});

addBtn.addEventListener("click", async () => {
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const imageFile = document.getElementById("product-image").files[0];

  const imageRef = ref(storage, `product-images/${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, "products"), { name, price, image: imageUrl });
  loadProducts();
});

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";
  querySnapshot.forEach((docItem) => {
    const product = docItem.data();
    productList.innerHTML += `
      <div class="product">
        <img src="${product.image}" width="80">
        <p>${product.name} - Rs. ${product.price}</p>
      </div>
    `;
  });
}
