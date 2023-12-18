
const formularioProducto = document.getElementById("formulario-producto");
const cuerpoTablaProductos = document.querySelector("#tabla-productos tbody");
const entradaBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("boton-buscar");
const filtroCategoria = document.getElementById("filtro-categoria");
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
botonBuscar.addEventListener("click", function () {
    const textoBusqueda = entradaBusqueda.value.toLowerCase();
    filtrarProductos(textoBusqueda);
});

filtroCategoria.addEventListener("change", function () {
    const categoriaSeleccionada = filtroCategoria.value;
    filtrarProductosPorCategoria(categoriaSeleccionada);
});

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

    // Agregar la categoría al filtro
    agregarCategoriaAlDropdown(categoria);

    formularioProducto.reset();
});

botonVaciar.addEventListener("click", function () {
    const confirmacion = confirm("¿Estás seguro de que deseas vaciar todos los productos?");
    if (confirmacion) {
        vaciarTodosLosProductos();
        limpiarFiltroCategoria();
        refrescarPagina();
    }
});

botonMostrarTodos.addEventListener("click", function () {
    mostrarTodosLosProductos();
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

    // Inserta la nueva fila al principio de la tabla
    if (cuerpoTablaProductos.firstChild) {
        cuerpoTablaProductos.insertBefore(fila, cuerpoTablaProductos.firstChild);
    } else {
        cuerpoTablaProductos.appendChild(fila);
    }
}
function filtrarProductos(textoBusqueda) {
    const filas = cuerpoTablaProductos.querySelectorAll("tr");
    filas.forEach((fila) => {
        const celdaNombre = fila.querySelector("td:first-child");
        const celdaStock = fila.querySelector("td:nth-child(3)"); // Cambio de "cantidad" a "stock"
        const nombre = celdaNombre.textContent.toLowerCase();
        const stock = celdaStock.textContent.toLowerCase(); // Cambio de "cantidad" a "stock"

        if (nombre.includes(textoBusqueda) || stock <= textoBusqueda) { // Cambio de "cantidad" a "stock"
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

function filtrarProductosPorCategoria(categoria) {
    const filas = cuerpoTablaProductos.querySelectorAll("tr");
    filas.forEach((fila) => {
        const celdaCategoria = fila.querySelector("td:nth-child(4)");
        const categoriaProducto = celdaCategoria.textContent;

        if (categoria === "" || categoriaProducto === categoria) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

function editarProducto(producto, fila) {
    const nuevoNombre = prompt("Editar Nombre:", producto.nombre);
    const nuevoPrecio = parseFloat(prompt("Editar Precio:", producto.precio));
    const nuevoStock = parseInt(prompt("Editar Stock:", producto.stock)); // Cambio de "cantidad" a "stock"
    const nuevaCategoria = prompt("Editar Categoría:", producto.categoria);

    if (nuevoNombre !== null && !isNaN(nuevoPrecio) && !isNaN(nuevoStock) && nuevaCategoria !== null) {
        producto.nombre = nuevoNombre;
        producto.precio = nuevoPrecio;
        producto.stock = nuevoStock; // Cambio de "cantidad" a "stock"
        producto.categoria = nuevaCategoria;

        // Actualizar los campos de la fila con los nuevos valores
        fila.querySelector("td:nth-child(1)").textContent = nuevoNombre;
        fila.querySelector("td:nth-child(2)").textContent = nuevoPrecio;
        fila.querySelector("td:nth-child(3)").textContent = nuevoStock; // Cambio de "cantidad" a "stock"
        fila.querySelector("td:nth-child(4)").textContent = nuevaCategoria;

        actualizarProducto(producto);
    }
}

function eliminarProducto(producto) {
    const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
    const productosActualizados = productosExistentes.filter((p) => p.nombre !== producto.nombre);
    localStorage.setItem("productosC", JSON.stringify(productosActualizados));
}

function actualizarProducto(producto) {
    const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
    const productosActualizados = productosExistentes.map((p) => {
        if (p.nombre === producto.nombre) {
            return producto;
        }
        return p;
    });
    localStorage.setItem("productosC", JSON.stringify(productosActualizados));
}

function vaciarTodosLosProductos() {
    localStorage.removeItem("productosC");
    cuerpoTablaProductos.innerHTML = "";
}

function mostrarTodosLosProductos() {
    cuerpoTablaProductos.innerHTML = ""; // Limpia la tabla

    const productosAlmacenados = JSON.parse(localStorage.getItem("productosC")) || [];

    for (const producto of productosAlmacenados) {
        agregarProductoATabla(producto);
        // Agregar la categoría al filtro
        agregarCategoriaAlDropdown(producto.categoria);
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
}

function agregarCategoriaAlDropdown(categoria) {
    const dropdownCategoria = document.getElementById("filtro-categoria");
    if (dropdownCategoria) {
        const opcion = document.createElement("option");
        opcion.text = categoria;
        opcion.value = categoria;
        dropdownCategoria.appendChild(opcion);
    }
}

function limpiarFiltroCategoria() {
    const dropdownCategoria = document.getElementById("filtro-categoria");
    if (dropdownCategoria) {
        dropdownCategoria.selectedIndex = 0; // Establece la opción predeterminada
    }
}


//Refrescar la pagina

function refrescarPagina() {
    location.reload();
}