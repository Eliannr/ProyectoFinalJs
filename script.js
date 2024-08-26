const url = "data.json";
let carrito = JSON.parse(localStorage.getItem("carrito")) || []; 
fetch(url)
  .then((res) => res.json())
  .then((data) => mostrarProductos(data));

const contenedorProd = document.querySelector("#container");
const carritoContainer = document.querySelector("#carrito");
const finalizarCompraBtn = document.querySelector("#finalizar-compra");


function mostrarProductos(productos) {
  productos.forEach((prod) => {
    let card = document.createElement("div");

    card.innerHTML = `
        <h2>${prod.nombre}</h2>
        <img src="${prod.img}">
        <p>Precio: $${prod.precio}</p>
        <p>Proteína: ${prod.proteina}g</p>
        <button class="btn-comprar" id="${prod.id}">Comprar</button>
    `;

    contenedorProd.appendChild(card);
  });

  const botonesComprar = document.querySelectorAll(".btn-comprar");
  botonesComprar.forEach((btn) => {
    btn.addEventListener("click", (e) => agregarAlCarrito(e, productos));
  });

 
  actualizarCarrito();
}


function agregarAlCarrito(e, prods) {
  const idProducto = parseInt(e.target.id);
  const prodElegido = prods.find((el) => el.id === idProducto);

  if (prodElegido) {
    carrito.push(prodElegido);
    actualizarCarrito();
    guardarCarritoEnLocalStorage();

    Swal.fire({
      title: 'Producto Agregado',
      text: `Has agregado ${prodElegido.nombre} al carrito.`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }
}


function actualizarCarrito() {
  carritoContainer.innerHTML = "";

  carrito.forEach((prod, index) => {
    let itemCarrito = document.createElement("div");
    itemCarrito.innerHTML = `
      <span>${prod.nombre}</span>
      <span>$${prod.precio}</span>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    carritoContainer.appendChild(itemCarrito);
  });
}


function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
  guardarCarritoEnLocalStorage();
}

finalizarCompraBtn.addEventListener("click", () => {
  if (carrito.length > 0) {
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);

    Swal.fire({
      title: 'Compra Finalizada',
      text: `Total a pagar: $${total}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      carrito = [];
      actualizarCarrito();
      guardarCarritoEnLocalStorage();
    });
  } else {
    Swal.fire({
      title: 'Carrito Vacío',
      text: 'No tienes productos en el carrito.',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
});
