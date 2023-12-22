
const formularioProducto = document.getElementById("formulario-producto");
const cuerpoTablaProductos = document.querySelector("tabla-datos");
const botonBuscar = document.getElementById("boton-buscar");
const botonVaciar = document.getElementById("boton-vaciar");
const botonMostrarTodos = document.getElementById("boton-mostrar-todos");
const botonIncrementarPrecio = document.getElementById("boton-incrementar-precio");
const botonIncrementarPorcentajePrecio = document.getElementById("boton-incrementar-porcentaje-precio");
const botonRedondearPrecios = document.getElementById("boton-redondear-precios");
const botonExportarExcel = document.getElementById("exportar-stock-xlsx");








botonExportarExcel.addEventListener("click", function () {
    exportarAExcel();
});

function exportarAExcel() {
    
    const filas = cuerpoTablaProductos.querySelectorAll("tr");
    const datos = [];

    filas.forEach((fila) => {
        const celdas = fila.querySelectorAll("td");
        const nombre = celdas[0].textContent;
        const precio = celdas[1].textContent;
        const stock = celdas[2].textContent;
        const categoria = celdas[3].textContent;
        datos.push([nombre, precio, stock, categoria]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Nombre", "Precio", "Stock", "Categoría"], ...datos]);
    XLSX.utils.book_append_sheet(wb, ws, "productosC");

    // Guardar el archivo
    XLSX.writeFile(wb, 'productos.xlsx');
}


formularioProducto.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value); // Cambio de "cantidad" a "stock"
    const categoria = document.getElementById("categoria").value;
   

    const producto = {
        nombre,
        precio,
        stock, 
        categoria
    };

    const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
    productosExistentes.push(producto);
    localStorage.setItem("productosC", JSON.stringify(productosExistentes));

    agregarProductoATabla(producto);



    formularioProducto.reset();
});

botonVaciar.addEventListener("click", function () {
    const confirmacion = confirm("¿Estás seguro de que deseas vaciar todos los productos?");
    if (confirmacion) {
        vaciarTodosLosProductos();
        
        refrescarPagina();
    }
});

botonMostrarTodos.addEventListener("click", function () {
   
    refrescarPagina();
});

botonIncrementarPrecio.addEventListener("click", function () {
    incrementarPrecioDeTodosLosProductos();
});

botonIncrementarPorcentajePrecio.addEventListener("click", function () {
    incrementarPrecioPorcentajeDeTodosLosProductos();
});

botonRedondearPrecios.addEventListener("click", function () {
    redondearPreciosDeTodosLosProductos();
});

window.addEventListener("load", function () {
    mostrarTodosLosProductos();
});



function agregarProductoATabla(producto) {
    const tablaProductos = document.getElementById("tabla-datos");

    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>${producto.stock}</td>
        <td>${producto.categoria}</td>
        <td>
            <button class="boton-editar">Editar</button>
            <button class="boton-eliminar">Eliminar</button>
        </td>
    `;

    const botonEditar = fila.querySelector(".boton-editar");
    const botonEliminar = fila.querySelector(".boton-eliminar");

    botonEditar.addEventListener("click", function () {
        editarProducto(producto, fila);
    });

    botonEliminar.addEventListener("click", function () {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmacion) {
            fila.remove();
            eliminarProducto(producto);
        }
    });

    tablaProductos.appendChild(fila);
}



function editarProducto(producto, fila) {
    const nuevoPrecio = parseFloat(prompt("Editar Precio:", producto.precio));
    const nuevoStock = parseInt(prompt("Editar Stock:", producto.stock)); // Cambio de "cantidad" a "stock"
    const nuevaCategoria = prompt("Editar Categoría:", producto.categoria);

    if ( !isNaN(nuevoPrecio) && !isNaN(nuevoStock) && nuevaCategoria !== null) {
        producto.precio = nuevoPrecio;
        producto.stock = nuevoStock; // Cambio de "cantidad" a "stock"
        producto.categoria = nuevaCategoria;

        // Actualizar los campos de la fila con los nuevos valores
        fila.querySelector("td:nth-child(2)").textContent = nuevoPrecio;
        fila.querySelector("td:nth-child(3)").textContent = nuevoStock; // Cambio de "cantidad" a "stock"
        fila.querySelector("td:nth-child(4)").textContent = nuevaCategoria;

        const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
        productosExistentes.forEach((p, index) => {
            console.log(p.nombre);
            console.log(producto.nombre);
            if (p.nombre === producto.nombre) {
              // Si se encuentra un producto con el mismo nombre, se actualiza en el array existente
              productosExistentes[index] = producto;
            }
          });
          
           
        localStorage.setItem("productosC", JSON.stringify( productosExistentes));
    
    }
}

function eliminarProducto(producto) {
    const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
    const productosActualizados = productosExistentes.filter((p) => p.nombre !== producto.nombre);
    localStorage.setItem("productosC", JSON.stringify(productosActualizados));
}

  






function vaciarTodosLosProductos() {
    localStorage.removeItem("productosC");
}

function mostrarTodosLosProductos() {

    const productosAlmacenados = JSON.parse(localStorage.getItem("productosC")) || [];

    for (const producto of productosAlmacenados) {
        agregarProductoATabla(producto);
      
    }
    
}

function incrementarPrecioDeTodosLosProductos() {
    const cantidadAumento = parseFloat(prompt("Ingrese el aumento de precio (sin decimales):"));
    if (!isNaN(cantidadAumento)) {
        const productosAlmacenados = JSON.parse(localStorage.getItem("productosC")) || [];
        const productosActualizados = productosAlmacenados.map((producto) => {
            producto.precio += cantidadAumento;
            return producto;
        });
        localStorage.setItem("productosC", JSON.stringify(productosActualizados));
        mostrarTodosLosProductos();
        refrescarPagina();
    } else {
        alert("Ingrese un número válido para el aumento de precio.");
    }
}

function incrementarPrecioPorcentajeDeTodosLosProductos() {
    const porcentajeAumento = parseFloat(prompt("Ingrese el aumento de precio en porcentaje:"));
    if (!isNaN(porcentajeAumento)) {
        const productosAlmacenados = JSON.parse(localStorage.getItem("productosC")) || [];
        const productosActualizados = productosAlmacenados.map((producto) => {
            producto.precio += (producto.precio * porcentajeAumento) / 100;
            return producto;
        });
        localStorage.setItem("productosC", JSON.stringify(productosActualizados));
        mostrarTodosLosProductos();
        refrescarPagina();
    } else {
        alert("Ingrese un número válido para el aumento de precio en porcentaje.");
    }
}

function redondearPreciosDeTodosLosProductos() {
    const productosAlmacenados = JSON.parse(localStorage.getItem("productosC")) || [];
    const productosRedondeados = productosAlmacenados.map((producto) => {
        producto.precio = Math.round(producto.precio);
        return producto;
    });
    localStorage.setItem("productosC", JSON.stringify(productosRedondeados));
    mostrarTodosLosProductos();
    refrescarPagina();
}





//Refrescar la pagina

function refrescarPagina() {
    location.reload();
}
