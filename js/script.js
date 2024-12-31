// Ruta al archivo JSON
const rutaJson = './productos.json';
// Contenedor de productos
const contenedorProductos = document.querySelector('.product-flex');

// Cargar productos desde el JSON
fetch(rutaJson)
    .then(response => response.json())
    .then(productos => {
        productos.forEach(producto => {
            const divProducto = document.createElement('div');
            divProducto.classList.add('product');

            divProducto.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio.toLocaleString()}</p>
                <label for="cantidad-${producto.id}">Cantidad:</label>
                <input 
                    id="cantidad-${producto.id}" 
                    type="number" 
                    min="1" 
                    value="1" 
                    style="width: 50px; margin-right: 10px;"/>
                <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio}, 'cantidad-${producto.id}')">
                    Agregar al Carrito
                </button>
            `;
            contenedorProductos.appendChild(divProducto);
        });
    })
    .catch(error => console.error('Error al cargar los productos:', error));


//Carrito de compras+++
function AgregarAlCarrito(nombre, precio){
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push({nombre, precio});
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`El producto "${nombre}" se agregó al carrito`)
    }

    //carrito.html+++
    document.addEventListener('DOMContentLoaded',mostrarCarrito);


// Agregar productos al carrito con cantidad
function AgregarAlCarrito(nombre, precio, inputIdCantidad) {
    const cantidad = parseInt(document.getElementById(inputIdCantidad).value, 10);

    // Validar cantidad
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, selecciona una cantidad válida.");
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya existe en el carrito
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += cantidad; // Incrementar la cantidad
    } else {
        carrito.push({ nombre, precio, cantidad }); // Agregar nuevo producto con la cantidad
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`Se agregó ${cantidad} unidad(es) de "${nombre}" al carrito.`);
    mostrarCarrito();
}

// Mostrar productos en el carrito
function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';

    carrito.forEach((producto, index) => {
        const cantidad = producto.cantidad || 1;
        const precio = producto.precio || 0;

        let li = document.createElement('li');
        li.textContent = `${producto.nombre} - $${precio.toFixed(2)} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`;

        // Botones para modificar cantidad
        let botonAumentar = document.createElement('button');
        botonAumentar.textContent = '+';
        botonAumentar.addEventListener('click', () => modificarCantidad(index, 1));

        let botonDisminuir = document.createElement('button');
        botonDisminuir.textContent = '-';
        botonDisminuir.addEventListener('click', () => modificarCantidad(index, -1));

        // Botón para borrar producto
        let botonBorrar = document.createElement('button');
        botonBorrar.textContent = 'Borrar';
        botonBorrar.addEventListener('click', () => borrarProducto(index));

        li.appendChild(botonAumentar);
        li.appendChild(botonDisminuir);
        li.appendChild(botonBorrar);

        listaCarrito.appendChild(li);
    });

    mostrarTotal(); // Actualizar el total
}

// Modificar cantidad de un producto
function modificarCantidad(index, cantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index]) {
        carrito[index].cantidad += cantidad;

        // Eliminar el producto si la cantidad es <= 0
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

// Borrar un producto del carrito
function borrarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Mostrar el total a pagar
function mostrarTotal() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = carrito.reduce((acc, producto) => {
        const cantidad = producto.cantidad || 1;
        const precio = producto.precio || 0;
        return acc + (precio * cantidad);
    }, 0);

    let totalContainer = document.getElementById('total-carrito');
    totalContainer.textContent = `Total a pagar: $${total.toFixed(2)}`;
}

// Completar la compra
function completarCompra() {
    alert("¡Compra completada con éxito! Gracias por su compra.");
    localStorage.removeItem('carrito'); // Vaciar el carrito
    mostrarCarrito(); // Actualizar la lista del carrito
}

// Mostrar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', mostrarCarrito);

// FORMULARIO Validación
document.querySelector('form').addEventListener('submit', function (event) {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
        alert('Por favor, completa todos los campos.');
        event.preventDefault(); // Evitar que se envíe el formulario
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Por favor, introduce un correo válido.');
        event.preventDefault();
    }
});

