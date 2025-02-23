// Base URL de la API DummyJSON
const API_BASE = 'https://dummyjson.com';

// Elementos del DOM
const categorySelect = document.getElementById('categorySelect');
const productSelect = document.getElementById('productSelect');
const showProductBtn = document.getElementById('showProductBtn');
const resultDiv = document.getElementById('result');

// Función para cargar las categorías
async function loadCategories() {
  try {
    resultDiv.innerHTML = '<p class="loading">Cargando categorías...</p>';
    const response = await fetch(`${API_BASE}/products/categories`);
    const data = await response.json();
    
    console.log("Categorías recibidas:", data);
    categorySelect.innerHTML = '<option value="">-- Elige una categoría --</option>';
    data.forEach(item => {
      const option = document.createElement('option');
      let valor = '';
      let texto = '';
      
      if (typeof item === 'object' && item !== null) {
        if (item.category) {
          valor = item.category;
          texto = item.category;
        } else if (item.name) {
          valor = item.name;
          texto = item.name;
        } else { 
          valor = JSON.stringify(item);
          texto = JSON.stringify(item);
        }
      } else {
        valor = item;
        texto = item;
      }
      
      option.value = valor;
      option.textContent = texto;
      categorySelect.appendChild(option);
    });
    resultDiv.innerHTML = '';
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = '<p>Error al cargar las categorías.</p>';
  }
}

// Función para cargar los productos de la categoría seleccionada
async function loadProducts(category) {
  try {
    resultDiv.innerHTML = '<p class="loading">Cargando productos...</p>';
    const url = `${API_BASE}/products/category/${encodeURIComponent(category)}`;
    console.log("Solicitando productos a:", url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status}`);
    }
    const data = await response.json();
    console.log('Productos obtenidos:', data);
    
    productSelect.innerHTML = '<option value="">-- Elige un producto --</option>';
    if (data.products && data.products.length > 0) {
      data.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.title;
        productSelect.appendChild(option);
      });
      productSelect.disabled = false;
      showProductBtn.disabled = true;
      resultDiv.innerHTML = '';
    } else {
      productSelect.innerHTML = '<option value="">No hay productos en esta categoría</option>';
      productSelect.disabled = true;
      showProductBtn.disabled = true;
      resultDiv.innerHTML = '<p>No se encontraron productos para esta categoría.</p>';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = '<p>Error al cargar los productos.</p>';
  }
}

// Función para cargar el detalle de un producto
async function loadProductDetail(productId) {
  try {
    resultDiv.innerHTML = '<p class="loading">Cargando detalle del producto...</p>';
    const response = await fetch(`${API_BASE}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status}`);
    }
    const product = await response.json();
    displayProductDetail(product);
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = '<p>Error al cargar el detalle del producto.</p>';
  }
}

// Función para mostrar el detalle del producto en el DOM
function displayProductDetail(product) {
  let html = `<div class="product-detail">
                <h2>${product.title}</h2>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Descripción:</strong> ${product.description}</p>
                <p><strong>Categoría:</strong> ${product.category}</p>`;
  if (product.images && product.images.length > 0) {
    html += `<img src="${product.images[0]}" alt="${product.title}">`;
  }
  html += `</div>`;
  resultDiv.innerHTML = html;
}

// Eventos
categorySelect.addEventListener('change', (e) => {
  const category = e.target.value;
  if (category) {
    loadProducts(category);
  } else {
    productSelect.innerHTML = '<option value="">-- Elige un producto --</option>';
    productSelect.disabled = true;
    showProductBtn.disabled = true;
  }
});

productSelect.addEventListener('change', (e) => {
  const productId = e.target.value;
  showProductBtn.disabled = !productId;
});

document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const productId = productSelect.value;
  if (productId) {
    loadProductDetail(productId);
  }
});

loadCategories();
