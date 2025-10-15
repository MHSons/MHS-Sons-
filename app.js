import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const productList = document.getElementById("product-list");

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    productList.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>Price: ${product.price} PKR</p>
      </div>
    `;
  });
}

loadProducts();
