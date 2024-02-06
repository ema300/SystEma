var productos = [];
var carrito = [];
var vendido = 0.00;
var acum = 0;
var nuevoStock = 0;
var copiaCantidad = 0;
var pro = [];
var vendidoActualElement;

var Apagar=0;

// inicio Variables Modal

var cuerpoTablaProductos = document.querySelector("tabla-stock");
var botonVaciar = document.getElementById("boton-vaciar");
var botonMostrarTodos = document.getElementById("boton-mostrar-todos");
var botonIncrementarPrecio = document.getElementById("boton-incrementar-precio");
var botonIncrementarPorcentajePrecio = document.getElementById("boton-incrementar-porcentaje-precio");
var botonRedondearPrecios = document.getElementById("boton-redondear-precios");
var botonExportar = document.getElementById('exportar-stock-xlsx');

// fin variables modal




localStorage.setItem('finalizo_compra', 'no');
// Obtén el valor almacenado en localStorage
compra_actual = localStorage.getItem('finalizo_compra');


var historial = [];











function crearListaAutocompletado(data) {
  var opcionesDatalist = document.getElementById('opciones-productos');

  data.forEach(function (producto) {
    var nombreProducto = producto.nombre;
    var precioProducto = producto.precio;
    var stockProducto = producto.stock;

    var option = document.createElement('option');
    option.value = nombreProducto;
    option.setAttribute('data-precio', precioProducto);
    option.setAttribute('data-stock', stockProducto);
    opcionesDatalist.appendChild(option);
  });
}



// Autocompletado del precio al seleccionar el nombre del producto
document.getElementById('nombre').addEventListener('input', function () {
  var inputNombre = this.value.toLowerCase();
  var options = document.getElementById('opciones-productos').getElementsByTagName('option');

  for (var i = 0; i < options.length; i++) {
    var nombreProducto = options[i].value.toLowerCase();

    if (nombreProducto === inputNombre) {
      var precio = options[i].getAttribute('data-precio');
      var stock = options[i].getAttribute('data-stock');

      if (isNaN(precio)) {
        precio = 0;
      }
      if (isNaN(stock)) {
        stock = Infinity;
      }
      document.getElementById('precio').value = precio;
      document.getElementById('stock').value = stock;
      break;
    }
  }
});






































window.addEventListener('load', function () {
  if (localStorage.getItem('productos')) {
    productos = JSON.parse(localStorage.getItem('productos'));
    carrito = JSON.parse(localStorage.getItem('carrito'));

    displayProductsInTable();
    //   actualizarTotalPrecio(); // Actualizar el total de precios
    actualizarCompraActual();
  }

  if (localStorage.getItem('historial')) {
    historial = JSON.parse(localStorage.getItem('historial'));
  }

  if (localStorage.getItem('productosC')) {
    pro = JSON.parse(localStorage.getItem("productosC")) || [];
    mostrarTodosLosProductos();
    crearListaAutocompletado(pro);
  }

  llenarDesplegableCategorias();

});


function displayProductsInTable(productsToDisplay = productos) {
  const tabla = document.getElementById('tabla-productos');
  tabla.innerHTML = ""; // Limpiar el contenido existente de la tabla
  const headerRow = tabla.insertRow();
  for (var key in productsToDisplay[0]) {
    var headerCell = headerRow.insertCell();
    headerCell.innerHTML = key;
  }

  productsToDisplay.forEach(function (product, index) {
    var row = tabla.insertRow();
    for (var key in product) {
      var cell = row.insertCell();
      cell.innerHTML = product[key];
    }

    // Agregar un botón de eliminar a cada fila
    var deleteCell = row.insertCell();
    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'x';
    deleteButton.id = 'eliminar'; // Asigna el ID 'btn-eliminar' al botón

    deleteButton.addEventListener('click', function () {
      eliminarProduc(index);
    });
    deleteCell.appendChild(deleteButton);
  });
}











function obtenerFechaYHoraActuales() {
  var now = new Date();
  var fecha = now.toISOString().slice(0, 10);
  var hora = now.toTimeString().slice(0, 8);
  return { fecha, hora };
}


function eliminarProduc(index) {

  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {

    if (compra_actual === 'no' && carrito[index].Total === productos[index].Total) {

      vendido = localStorage.getItem('valor_compra_actual');
      acum = Math.max(parseFloat(vendido), carrito[index].Total) - Math.min(parseFloat(vendido), carrito[index].Total);

      localStorage.setItem('valor_compra_actual', JSON.stringify(acum));

      vendidoActualElement = document.getElementById('vendido-actual');
      vendidoActualElement.textContent = 'Total: $' + acum;


      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));


      productos.splice(index, 1);
      localStorage.setItem('productos', JSON.stringify(productos));
      displayProductsInTable();
      actualizarTotalPrecio(); // Actualizar el total de precios después de eliminar

      // refrescarPagina();

    }
    if (productos.length === 0) {
      localStorage.removeItem('productos');
      localStorage.removeItem('carrito');
      productos = [];
      Carrito = [];
      localStorage.removeItem('Ident');

      localStorage.setItem('finalizo_compra', 'si');
      compra_actual = localStorage.getItem('finalizo_compra');
      vendido = localStorage.setItem('valor_compra_actual', '0.00');
      localStorage.removeItem('valor_compra_actual');
      vendido = 0;

      acum = 0;

      displayProductsInTable();
      actualizarTotalPrecio();
      actualizarCompraActual();
    }



  }
}











document.getElementById('guardar').addEventListener('click', function () {


  var nombre = document.getElementById('nombre').value;
  var precio = parseFloat(document.getElementById('precio').value);
  var cantidad = parseFloat(document.getElementById('cantidad').value);
  var stock = parseFloat(document.getElementById('stock').value); // Obtener el stock actual



  // Restar la cantidad comprada al stock
  nuevoStock = stock - cantidad;
  copiaCantidad = copiaCantidad + cantidad;

  if (nuevoStock < 0) {
    alert('La cantidad seleccionada excede el stock disponible');
    return;
  }
  if (cantidad === 0) {
    alert('La cantidad no puede ser 0');
    
  }
  if (precio === 0) {
    alert("El precio no puede ser cero. Por favor, ingrese un valor válido.");
    return;
  }

  // Restringir el stock mínimo a 0
  nuevoStock = Math.max(nuevoStock, 0);

  // Actualizar el valor del campo de stock en el formulario
  document.getElementById('stock').value = nuevoStock;

  localStorage.setItem('finalizo_compra', 'no');
  // Obtén el valor almacenado en localStorage
  compra_actual = localStorage.getItem('finalizo_compra');
  //para el ID
  if (localStorage.getItem('Ident') === null) {
    localStorage.setItem('Ident', '0');
  }
  var id_anterior = localStorage.getItem('Ident');

  // Obtén el valor almacenado en localStorage
  var id = parseInt(id_anterior) + 1;

  localStorage.setItem('Ident', id.toString());

  if (nombre.trim() === '' || isNaN(precio) || isNaN(cantidad) || precio < 0 || cantidad < 0) {

    alert('Por favor, complete todos los campos correctamente y asegúrese de que el precio y la cantidad no sean negativos.');
    refrescarPagina();
    return;
  }

  var { fecha, hora } = obtenerFechaYHoraActuales();

  var total = (precio * cantidad).toFixed(2);
  vendido = total;
  localStorage.setItem('valor_compra_actual', vendido);
  // Obtén el valor almacenado en localStorage

  productos.push({
    "ID": id,
    "Producto": nombre,
    "Precio": precio,
    "Cantidad": cantidad,
    "Total": total,
    "Fecha": fecha,
    "Hora": hora
  });


  carrito = productos.slice();

  localStorage.setItem('productos', JSON.stringify(productos));
  localStorage.setItem('carrito', JSON.stringify(carrito));
  displayProductsInTable();

  document.getElementById('nombre').value = "";
  document.getElementById('precio').value = "";
  document.getElementById('cantidad').value = "";
  document.getElementById('stock').value = "";
  // Además, puedes actualizar la lista de autocompletado con el nuevo stock
  var options = document.getElementById('opciones-productos').getElementsByTagName('option');
  for (var i = 0; i < options.length; i++) {
    if (options[i].value.toLowerCase() === nombre.toLowerCase()) {
      options[i].setAttribute('data-stock', nuevoStock); // Actualizar el stock en la lista de autocompletado
      break;
    }
  }





  var comprasAnteriores = JSON.parse(localStorage.getItem('comprasAnteriores')) || {};
  if (!comprasAnteriores[nombre]) {
    comprasAnteriores[nombre] = 0;
  }
  comprasAnteriores[nombre] += cantidad;
  localStorage.setItem('comprasAnteriores', JSON.stringify(comprasAnteriores));
  actualizarCompraActual();



  // Actualizar la lista de autocompletado con el nuevo stock después de cada compra
  var options = document.getElementById('opciones-productos').getElementsByTagName('option');
  for (var i = 0; i < options.length; i++) {
    if (options[i].value.toLowerCase() === nombre.toLowerCase()) {
      options[i].setAttribute('data-stock', nuevoStock); // Actualizar el stock en la lista de autocompletado
      break;
    }
  }


});


function actualizarStock() {
  for (let i = 0; i < productos.length; i++) {

    for (let j = 0; j < pro.length; j++) {

      if (productos[i].Producto === pro[j].nombre) {
        if (isNaN(productos[i].Producto)) {
          productos[i].Producto=Infinity;
        }
        else{
          pro[j].stock = pro[j].stock - productos[i].Cantidad;

        }
      }
    }
  }


  localStorage.setItem('productosC', JSON.stringify(pro));

}

// Obtener datos del localStorage




// Obtener referencia a la tabla
const historialTable = document.getElementById('historial-table');





// Función para limpiar el historial y el localStorage
function limpiarHistorial() {
  var contrasenaAlmacenada = localStorage.getItem('c'); // Reemplaza 'contrasena' con la clave real

  var contrasenaIngresada = prompt('Ingresa la contraseña para vaciar el historial');

  if (contrasenaIngresada === contrasenaAlmacenada) {
    var historialTable = document.getElementById('historial-table');
    // Eliminar todas las filas excepto la primera (encabezado)
    while (historialTable.rows.length > 1) {
      historialTable.deleteRow(1);
    }


    localStorage.removeItem('Ident');
    localStorage.removeItem('contador');
    localStorage.removeItem('pagos');

    // Limpiar localStorage
    localStorage.removeItem('historial');
    reiniciarTotal();
  }
  else {
    // La contraseña es incorrecta, mostrar un mensaje de error
    alert('Contraseña incorrecta. No tienes permiso para vaciar el historial.');
  }


}





function reiniciarTotal() {
  var totalPrecioElement = document.getElementById('total-precio');
  totalPrecioElement.textContent = 'Total: $0.00';

  // Limpiar también el total almacenado en localStorage
  localStorage.removeItem('total');
}

localStorage.setItem('c', '1778');


document.getElementById('exportar-xlsx').addEventListener('click', function () {
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(historial);
  XLSX.utils.book_append_sheet(wb, ws, 'Productos');

  var now = new Date();
  var datePart = now.toISOString().slice(0, 10).replace(/-/g, '-');
  var timePart = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  var fileName = 'Historial_' + datePart + '_' + timePart + '.xlsx';

  XLSX.writeFile(wb, fileName);
});

















function borrar_compra() {
  localStorage.removeItem('productos');
  localStorage.removeItem('carrito');
  productos = [];
  Carrito = [];

  //localStorage.setItem('finalizo_compra', 'si');
  compra_actual = localStorage.getItem('finalizo_compra');
  vendido = localStorage.setItem('valor_compra_actual', '0.00');
  localStorage.removeItem('valor_compra_actual');
  vendido = 0;
  acum = 0;
  vaciarVariablesCompra()

  refrescarPagina();
}


function cancelar_compra() {
  
  var confirmacion = confirm('¿Estás seguro de que deseas cancelar la compra?');
  if (confirmacion) {

    borrar_compra();
    displayProductsInTable();
    actualizarCompraActual();

  }
  
};


















function finalizar_compra() {
  var confirmacion = confirm('¿Estás seguro de que deseas finalizar la compra?');
  if (confirmacion) {


     pagos();



    localStorage.setItem('finalizo_compra', 'si');
    //    alert("finalizo la compra")
    actualizarStock();


    // Obtener la fecha y hora actuales
    var { fecha, hora } = obtenerFechaYHoraActuales();

    // Agregar los productos comprados al historial con fecha y hora

    productos.forEach(producto => {
      historial.push({
        "ID": producto.ID,
        "Producto": producto.Producto,
        "Precio": producto.Precio,
        "Cantidad": producto.Cantidad,
        "Total": producto.Total,
        "Fecha": fecha,
        "Hora": hora
      });
    });

    // Actualizar el historial en el localStorage
    localStorage.setItem('historial', JSON.stringify(historial));

    // Limpiar la tabla de historial
    var historialTable = document.getElementById('historial-table');
    historialTable.innerHTML = ''; // Vaciar el contenido actual de la tabla

    // Volver a llenar la tabla con los datos del historial actualizado
    historial.forEach(producto => {
      var row = historialTable.insertRow();
      Object.values(producto).forEach(value => {
        var cell = row.insertCell();
        cell.textContent = value;
      });
    });


    borrar_compra();
    displayProductsInTable();

    actualizarCompraActual();
    actualizarTotalPrecio();
    //refrescarPagina();
  }
}


// Función para buscar en la tabla de historial
document.getElementById('search-button').addEventListener('click', function () {
  var searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
  var historialTable = document.getElementById('historial-table');


  for (var i = 1; i < historialTable.rows.length; i++) {
    var found = false;
    var row = historialTable.rows[i];

    for (var j = 0; j < row.cells.length; j++) {
      var cellText = row.cells[j].textContent.toLowerCase();

      if (cellText.includes(searchTerm)) {
        found = true;
        break;
      }
    }

    if (found) {
      row.style.display = ''; // Mostrar la fila si se encontró el término de búsqueda
    } else {
      row.style.display = 'none'; // Ocultar la fila si no se encontró el término de búsqueda
    }
  }
});

// Restaurar la visualización de todas las filas al hacer clic en "Mostrar Todos"
document.getElementById('show-all-button').addEventListener('click', function () {
  var historialTable = document.getElementById('historial-table');

  for (var i = 1; i < historialTable.rows.length; i++) {
    historialTable.rows[i].style.display = ''; // Mostrar todas las filas
  }
});


function actualizarCompraActual() {
  if (compra_actual === 'no') {
    // alert('No finalizo');
    vendido = localStorage.getItem('valor_compra_actual');
    acum = parseFloat(acum) + parseFloat(vendido);
    localStorage.setItem('valor_compra_actual', JSON.stringify(acum));
    vendidoActualElement = document.getElementById('vendido-actual');
    vendidoActualElement.textContent = 'Total: $' + acum;
  } else {
    // alert('Si finalizo');
    vendido = 0;
    var vendidoActualElement = document.getElementById('vendido-actual');
    vendidoActualElement.textContent = 'Total: $' + vendido.toFixed(2);
    vendido = localStorage.setItem('valor_compra_actual', '0');
  }
}














document.addEventListener('DOMContentLoaded', function () {
  var btnMostrarModal = document.getElementById('btnMostrarModal');
  var modal = document.getElementById('modal');
  var closeBtn = document.querySelector('.close');

  // Función para abrir el modal
  function abrirModal() {
    modal.style.display = 'block';
  }

  // Función para cerrar el modal
  function cerrarModal() {
    modal.style.display = 'none';
    refrescarPagina();
  }

  // Verificar si hay un estado guardado en el almacenamiento local
  var modalEstado = localStorage.getItem('modalEstado');

  // Si el estado es 'abierto', abrir el modal
  if (modalEstado === 'abierto') {
    abrirModal();
  }

  btnMostrarModal.addEventListener('click', function () {



    var contrasenaAlmacenada = localStorage.getItem('c'); // Reemplaza 'contrasena' con la clave real

    var contrasenaIngresada = prompt('Ingresa la contraseña para acceder');

    if (contrasenaIngresada === contrasenaAlmacenada) {
      abrirModal();
      // Guardar el estado en el almacenamiento local cuando se abre el modal
      localStorage.setItem('modalEstado', 'abierto');
    }
    else {
      // La contraseña es incorrecta, mostrar un mensaje de error
      alert('Contraseña incorrecta. No tienes permiso.');
    }









  });

  closeBtn.addEventListener('click', function () {
    cerrarModal();
    // Eliminar el estado del almacenamiento local al cerrar el modal
    localStorage.removeItem('modalEstado');
  });

  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      cerrarModal();
      localStorage.removeItem('modalEstado');
    }
  });
});











// Recuperar datos después de la carga de la página
window.addEventListener('DOMContentLoaded', function () {
  var historialTable = document.getElementById('historial-table');

  // Verificar si hay datos guardados en localStorage
  if (localStorage.getItem('historial')) {
    // Recuperar datos y asignarlos a la variable historial
    var historial = JSON.parse(localStorage.getItem('historial'));

    // Llenar la tabla con los datos recuperados
    historial.forEach(producto => {
      var row = historialTable.insertRow();
      Object.values(producto).forEach(value => {
        var cell = row.insertCell();
        cell.textContent = value;
      });
    });
  }
});




// Función para actualizar el total
function actualizarTotalPrecio() {
  // Calcula el total como lo haces normalmente
  var total = historial.reduce(function (acumulador, producto) {
    return acumulador + parseFloat(producto.Total);
  }, 0);

  // Muestra el total en la interfaz
  var totalPrecioElement = document.getElementById('total-precio');
  totalPrecioElement.textContent = 'Total: $' + total.toFixed(2);

  // Guarda el total en el localStorage
  localStorage.setItem('total', total.toFixed(2));
}

// Recuperar el total después de la carga de la página
window.addEventListener('DOMContentLoaded', function () {
  var totalPrecioElement = document.getElementById('total-precio');

  // Verificar si hay un total almacenado en el localStorage
  if (localStorage.getItem('total')) {
    // Recuperar el total del localStorage y mostrarlo en la interfaz
    var totalGuardado = parseFloat(localStorage.getItem('total'));
    totalPrecioElement.textContent = 'Total: $' + totalGuardado.toFixed(2);
  }
});
















//Refrescar la pagina

function refrescarPagina() {
  location.reload();
}


function esNumero(valor) {
  return !isNaN(parseFloat(valor)) && isFinite(valor);
}







































// codigo modal control de stock






const agregarBtn = document.getElementById('agregarBtn');

agregarBtn.addEventListener('click', function () {
  const nombre = document.getElementById('nombr').value;
  const precioInput = document.getElementById('preci').value;
  const stockInput = document.getElementById('st').value;
  const categoria = document.getElementById('categoria').value;

  // Validación de precio
  let precio;
  if (precioInput.trim() === '') {
    precio = 0;
  } 
  else if (isNaN(parseFloat(precioInput))) {
    alert('El precio debe ser un número');
    return;
  } 
  else {
    precio = parseFloat(precioInput);
  }

  // Validación de stock
  let stock;
  if (stockInput.trim() === '') {
    stock = Infinity;
  } 
  else if (isNaN(parseInt(stockInput))) {
    alert('El stock debe ser un número');
    return;
  } 
  else {
    stock = parseInt(stockInput);
  }

  if (nombre.length < 1) {
    alert('Complete el nombre del producto');
    return;
  }
  if (categoria.length < 1) {
    alert('Complete la categoría del producto');
    return;
  }

  guardarCategoria();

  for (let i = 0; i < pro.length; i++) {
    if (nombre === pro[i].nombre) {
      alert('Ya hay un producto con ese nombre');
      return;
    }
  }

  const producto = {
    nombre,
    precio,
    stock,
    categoria
  };

  const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
  productosExistentes.push(producto);
  localStorage.setItem("productosC", JSON.stringify(productosExistentes));
  pro = JSON.parse(localStorage.getItem("productosC")) || [];

  agregarProductoATabla(producto);

  mostrarPorUnSegundo("Se agregó correctamente");
  // Llamada inicial para llenar el desplegable al cargar la página
  llenarDesplegableCategorias();
});



botonVaciar.addEventListener("click", function () {
  const confirmacion = confirm("¿Estás seguro de que deseas vaciar todos los productos?");
  if (confirmacion) {
    vaciarTodosLosProductos();
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



function agregarProductoATabla(producto) {
  const tablaProductos = document.getElementById("tabla-stock");

  const fila = document.createElement("tr");
  fila.innerHTML = `
        <td><input type="checkbox" class="checkbox-producto"></td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>${producto.stock}</td>
        <td>${producto.categoria}</td>
        <td>
            <button class="boton-editar">Editar</button>
            <button class="boton-eliminar">Eliminar</button>
        </td>
    `;

  const checkboxProducto = fila.querySelector(".checkbox-producto");
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

  if (!isNaN(nuevoPrecio) && !isNaN(nuevoStock) && nuevaCategoria !== null) {
    producto.precio = nuevoPrecio;
    producto.stock = nuevoStock; // Cambio de "cantidad" a "stock"
    producto.categoria = nuevaCategoria;

    // Actualizar los campos de la fila con los nuevos valores
    fila.querySelector("td:nth-child(2)").textContent = nuevoPrecio;
    fila.querySelector("td:nth-child(3)").textContent = nuevoStock; // Cambio de "cantidad" a "stock"
    fila.querySelector("td:nth-child(4)").textContent = nuevaCategoria;

    const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
    productosExistentes.forEach((p, index) => {


      if (p.nombre === producto.nombre) {
        // Si se encuentra un producto con el mismo nombre, se actualiza en el array existente
        productosExistentes[index] = producto;
      }
    });


    localStorage.setItem("productosC", JSON.stringify(productosExistentes));

  }
}

function eliminarProducto(producto) {
  const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
  const productosActualizados = productosExistentes.filter((p) => p.nombre !== producto.nombre);

  if (productosActualizados.length == 0) {

    vaciarTodosLosProductos();
    refrescarPagina();
  }
  else {
    localStorage.setItem("productosC", JSON.stringify(productosActualizados));

  }
}








function vaciarTodosLosProductos() {
  localStorage.removeItem("productosC");
  localStorage.removeItem('categorias');

}

function mostrarTodosLosProductos() {

  const productosAlmacenados = JSON.parse(localStorage.getItem("productosC")) || [];

  for (const producto of productosAlmacenados) {
    agregarProductoATabla(producto);

  }

}

function guardarCategoria() {
  // Obtener la categoría ingresada
  const nuevaCategoria = document.getElementById('categoria').value;
  // Verificar si la categoría ya existe en localStorage
  const categoriasGuardadas = JSON.parse(localStorage.getItem('categorias')) || [];
  if (categoriasGuardadas.includes(nuevaCategoria)) {
    console.log('Categoría existente', nuevaCategoria);
    // Si la categoría ya existe, mostrar un mensaje o realizar la acción correspondiente
    return;
  }

  // Agregar la nueva categoría a la lista
  categoriasGuardadas.push(nuevaCategoria);

  // Guardar la lista actualizada en localStorage
  localStorage.setItem('categorias', JSON.stringify(categoriasGuardadas));

  // Otra acción que desees realizar después de guardar la categoría
  console.log('Categoría guardada exitosamente:', nuevaCategoria);
}

function llenarDesplegableCategorias() {
  const selectCategoria = document.getElementById('selectCategory');
  const categoriasGuardadas = JSON.parse(localStorage.getItem('categorias')) || [];

  // Limpiar opciones existentes
  selectCategoria.innerHTML = '';

  // Llenar el desplegable con las categorías almacenadas
  categoriasGuardadas.forEach(function (categoria) {
    var option = document.createElement('option');
    option.value = categoria;
    option.text = categoria;
    selectCategoria.appendChild(option);
  });

  // Agregar evento al cambio de la categoría seleccionada
  selectCategoria.addEventListener('change', function () {
    // Obtener el valor seleccionado
    const selectedCategory = selectCategoria.value;

    // Actualizar el campo de búsqueda con la categoría seleccionada
    document.getElementById('buscando').value = selectedCategory;
  });
}





// Función para llenar dinámicamente el desplegable con las categorías almacenadas


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


function incrementarPrecios() {
  const tipoIncremento = document.getElementById("tipoIncremento").value;
  const valorIncremento = document.getElementById("valorIncremento").value.trim();

  // Verificar que haya al menos un producto marcado
  const productosMarcados = document.querySelectorAll(".checkbox-producto:checked");
  if (productosMarcados.length === 0) {
    alert("¡No se seleccionó ningún producto!");
    return;
  }

  // Verificar que el valor de incremento sea válido
  const incremento = parseFloat(valorIncremento.replace(/,/g, ''));

  if (!isNaN(incremento)) {
    // Obtener los productos marcados por el checkbox
    productosMarcados.forEach(checkbox => {
      // Obtener la fila correspondiente al checkbox marcado
      const fila = checkbox.closest("tr");

      // Obtener el precio actual del producto en la fila
      const precioActual = parseFloat(fila.querySelector("td:nth-child(3)").textContent);

      // Incrementar por precio o por porcentaje según la opción seleccionada
      let nuevoPrecio;
      if (tipoIncremento === "precio") {
        nuevoPrecio = precioActual + incremento;
      } else if (tipoIncremento === "porcentaje") {
        nuevoPrecio = precioActual * (1 + incremento / 100);
      }

      // Actualizar el precio y la fila
      fila.querySelector("td:nth-child(3)").textContent = nuevoPrecio;

      // Actualizar el objeto producto si es necesario (puedes ajustar esto según tus necesidades)
      const nombreProducto = fila.querySelector("td:nth-child(2)").textContent;
      const producto = { /* Obtener el producto correspondiente al nombre */ };

      // Actualizar productos en el almacenamiento local
      const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
      const index = productosExistentes.findIndex(p => p.nombre === nombreProducto);

      if (index !== -1) {
        productosExistentes[index].precio = nuevoPrecio;
        // Puedes realizar otras actualizaciones necesarias aquí
      }

      localStorage.setItem("productosC", JSON.stringify(productosExistentes));
    });
  } else {
    alert("Ingrese un valor numérico válido para el incremento.");
  }
}




//Refrescar la pagina

function refrescarPagina() {
  location.reload();
}






// Función para exportar la tabla a un archivo XLSX
function exportarTablaXLSX() {
  const filas = document.querySelectorAll('#tabla-stock tr');

  // Crear un libro de trabajo
  const workbook = XLSX.utils.book_new();
  const wsData = [];

  filas.forEach((fila) => {
    const rowData = [];
    const celdas = fila.querySelectorAll('td:not(:last-child)');

    celdas.forEach((celda) => {
      rowData.push(celda.textContent);
    });

    wsData.push(rowData);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Nombre del archivo basado en la fecha y hora actual
  const now = new Date();
  const fecha = `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
  const hora = `${now.getHours()}-${now.getMinutes()}`;
  const nombreArchivo = `"stock"${fecha}-${hora}.xlsx`;

  // Guardar el archivo XLSX
  XLSX.writeFile(workbook, nombreArchivo);
}

// Obtener el botón de exportar

// Agregar un evento de clic al botón para exportar la tabla
botonExportar.addEventListener('click', function () {
  exportarTablaXLSX();
});






function cargarArchivo() {
  const input = document.getElementById('inputArchivoXLSX');
  const confirmacion = confirm("Se vaciara la lista y se cargara la lista con productos del archivo ingresado");
  if (confirmacion) {
    vaciarTodosLosProductos();
    refrescarPagina();
    // Verificar si se seleccionó un archivo
    if (!input.files || input.files.length === 0) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    const archivo = input.files[0];
    const lector = new FileReader();

    lector.onload = function (evento) {
      const contenidoArchivo = evento.target.result;
      const workbook = XLSX.read(contenidoArchivo, { type: 'binary' });
      const nombrePrimeraHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombrePrimeraHoja];

      const datos = XLSX.utils.sheet_to_json(hoja, { header: 1 });

      // Empezar desde 1 para omitir el encabezado
      for (let i = 0; i < datos.length; i++) {
        const [nombre, precio, stock, categoria] = datos[i];
        const producto = { nombre, precio, stock, categoria };
        const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];
        productosExistentes.push(producto);
        localStorage.setItem("productosC", JSON.stringify(productosExistentes));
        agregarProductoATabla(producto);
      }
    };

    lector.readAsBinaryString(archivo);

  }

}




document.getElementById('boton-buscar').addEventListener('click', function () {
  const filtro = document.getElementById('filtro').value;
  const buscando = document.getElementById('buscando').value.trim().toLowerCase();

  // Obtener productos del localStorage
  const productosExistentes = JSON.parse(localStorage.getItem("productosC")) || [];

  // Limpiar la tabla antes de mostrar los resultados filtrados
  limpiarTabla();

  // Mostrar solo los productos que cumplen con las condiciones de búsqueda
  productosExistentes.forEach(producto => {
    if (cumpleCondiciones(producto, filtro, buscando)) {
      agregarProductoATabla(producto);
    }
  });
});

function cumpleCondiciones(producto, filtro, buscando) {
  const nombre = producto.nombre.toLowerCase();
  const categoria = producto.categoria.toLowerCase();

  switch (filtro) {
    case 'nombre':
      return nombre.includes(buscando);
    case 'precio':
      return !isNaN(producto.precio) && producto.precio <= parseFloat(buscando);
    case 'stock':
      return !isNaN(producto.stock) && producto.stock <= parseFloat(buscando);
    case 'categoria':
      return categoria.includes(buscando);
    default:
      return false;
  }
}
function agregarProductoATabla(producto) {
  const tablaProductos = document.getElementById("tabla-stock");

  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td><input type="checkbox" class="checkbox-producto"></td>
    <td>${producto.nombre}</td>
    <td>${producto.precio}</td>
    <td>${producto.stock}</td>
    <td>${producto.categoria}</td>
    <td>
        <button class="boton-editar">Editar</button>
        <button class="boton-eliminar">Eliminar</button>
    </td>
  `;

  const checkboxProducto = fila.querySelector(".checkbox-producto");
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



function limpiarTabla() {
  // Limpiar la tabla (eliminar todas las filas excepto la primera, que son los encabezados)
  const table = document.getElementById('tabla-stock');
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}


// Restaurar la visualización de todas las filas al hacer clic en "Mostrar Todos"
document.getElementById('boton-mostrar-todos').addEventListener('click', function () {
  refrescarPagina();

});


function mostrarPorUnSegundo(texto) {
  var miParrafo = document.getElementById('miParrafo');
  miParrafo.innerText = texto; // Establecer el texto proporcionado
  miParrafo.style.display = 'block'; // Mostrar el párrafo

  setTimeout(function () {
    miParrafo.style.display = 'none'; // Ocultar el párrafo después de 1 segundo
  }, 1000);
}







// Función para calcular el adicional
function calcularAdicional() {
  var precioProductos = parseFloat(localStorage.getItem('valor_compra_actual'));
  var porcentaje = parseFloat(document.getElementById('porcentaje').value);
  var adicional = (precioProductos * porcentaje) / 100;
  var totalConAdicional = precioProductos + adicional;
  if (!isNaN(adicional)) {
  // Mostrar el total con adicional en el elemento correspondiente
  document.getElementById('totalConAdicional').innerText = 'Total con Adicional: $' + totalConAdicional.toFixed(2);

  // Actualizar el total a pagar en el elemento total_pagar
  document.getElementById('total_pagar').innerText = 'Total Final: $' + totalConAdicional.toFixed(2) ;
  }
  else{
    return;
  }
}

// Función para calcular el descuento
function calcularDescuento() {
  calcularAdicional()
  var precioProductos = parseFloat(localStorage.getItem('valor_compra_actual'));

  //var precioConAdicional = parseFloat(document.getElementById('totalConAdicional').innerText.replace('Total con Adicional: $', ''));
  var precioConAdicional = parseFloat(document.getElementById('totalConAdicional').innerText.replace('Total con Adicional: $', ''));

  var descuento = parseFloat(document.getElementById('descuento').value);
  // Verificar si el descuento es un número válido
  if (!isNaN(descuento) ) {
    // Si el descuento es un número válido, realizar el descuento
    if (!isNaN(precioConAdicional)) {
      var montoConDescuento = precioConAdicional - (precioConAdicional * descuento) / 100;
      Apagar=montoConDescuento ;
    }
    else{
      var montoConDescuento = precioProductos - (precioProductos * descuento) / 100;
      Apagar=montoConDescuento ;
    }

    // Mostrar el total con descuento en el elemento correspondiente
    document.getElementById('totalConDescuento').innerText = 'Total con Descuento: $' + montoConDescuento.toFixed(2);

    // Actualizar el total a pagar en el elemento total_pagar
    document.getElementById('total_pagar').innerText = 'Total Final: $' + montoConDescuento.toFixed(2);
  } else {
    // Si el descuento no es un número válido, no hacer nada
    return;
  }
}



var montoRestante;
// Resto de la función calcularVuelto
function calcularVuelto() {
  
  var montoPagado = parseFloat(document.getElementById('montoPagado').value);

  // Calcular el vuelto o monto restante a pagar
  var precioFinal = parseFloat(document.getElementById('totalConDescuento').innerText.replace('Total con Descuento: $', '')) || parseFloat(document.getElementById('totalConAdicional').innerText.replace('Total con Adicional: $', '')) || parseFloat(localStorage.getItem('valor_compra_actual'));
  
  // Restar el monto pagado al precio final
  montoRestante = precioFinal - montoPagado;

  // Mostrar el resultado basado en el valor calculado
  if (montoRestante >= 0) {
    // Si el monto restante es positivo, mostrar que falta pagar
    document.getElementById('resultado').innerText = 'Falta pagar: $' + montoRestante.toFixed(2);
       // Crea un nuevo elemento <button> pagar lo que falta
       var botonPagar = document.createElement('button');
       botonPagar.id = 'Boton_falta_pagar';
       botonPagar.innerText = 'Pagar Faltante';

       botonPagar.onclick = function() {
        pagos()
        mostrarModalPagoFaltaPagar()

    };
       resultado.appendChild(botonPagar);

   
  } else {
    // Si el monto restante es negativo, mostrar el cambio
    if (isNaN(montoRestante)) {
      document.getElementById('resultado').innerText = 'El vuelto es: $' + 0;

    }
    else {
      document.getElementById('resultado').innerText = 'El vuelto es: $' + (montoRestante * (-1)).toFixed(2);

    }
  }
}





function formatNumber(value) {
  // Verificar si el valor es NaN
  if (isNaN(value)) {
    return "0.00"; // Devolver "0.00" si el valor es NaN
  } else {
    // Formatear el número a dos decimales
    return value.toFixed(2);
  }
}

function vaciarVariablesCompra() {
  // También puedes reiniciar el contenido de los elementos HTML a su estado inicial si es necesario
  document.getElementById('totalConAdicional').innerText = '';
  document.getElementById('totalConDescuento').innerText = '';
  document.getElementById('total_pagar').innerText = '';
  document.getElementById('montoPagado').value = '';
  document.getElementById('resultado').innerText = '';
}







  // Obtén referencias a los elementos relevantes
  var btnMostrarModalPago = document.getElementById('btnMostrarModalPago');
  var modalPago = document.getElementById('modalPago');
  var closeModalButtonPago = document.querySelector('.closePago');

// Agrega un evento de clic al botón para mostrar el modal
btnMostrarModalPago.addEventListener('click', mostrarModalPago);

  // Agrega un evento de clic al botón para mostrar el modal
  btnMostrarModalPago.addEventListener('click', function() {
    modalPago.style.display = 'block';
  });

  // Agrega un evento de clic al botón de cierre para ocultar el modal
  closeModalButtonPago.addEventListener('click', function() {
    modalPago.style.display = 'none';
  });

  // Cierra el modal si el usuario hace clic fuera de él
  window.addEventListener('click', function(event) {
    if (event.target === modalPago) {
      modalPago.style.display = 'none';
    }
  });

  function mostrarModalPago() {
    Apagar = parseFloat(localStorage.getItem('valor_compra_actual'));

    if (!isNaN( Apagar)) {
      // Obtén el precio de los productos desde localStorage
  
  
    // Asigna el precio al elemento total_pagar
    document.getElementById('total_pagar').innerText = 'Total a Pagar: $' +  Apagar.toFixed(2);
  
    // Muestra el modal
    modalPago.style.display = 'block';
    }
    
    
  }

  function mostrarModalPagoFaltaPagar() {
    // Obtén el precio de los productos desde localStorage
  Apagar = montoRestante;
  
    // Asigna el precio al elemento total_pagar
    document.getElementById('total_pagar').innerText = 'Total Faltante a Pagar: $' + Apagar.toFixed(2);
   
  document.getElementById('totalConAdicional').innerText = '';
  document.getElementById('totalConDescuento').innerText = '';
  document.getElementById('montoPagado').value = '';
  document.getElementById('resultado').innerText = '';
    
  }








// Función para limpiar los campos
function limpiarCampos() {
  // Limpiar campos relacionados con el adicional
  document.getElementById('porcentaje').value = '';
  document.getElementById('totalConAdicional').innerText = '';

  // Limpiar campos relacionados con el descuento
  document.getElementById('descuento').value = '';
  document.getElementById('totalConDescuento').innerText = '';

  // Limpiar campos relacionados con el vuelto
  document.getElementById('montoPagado').value = '';
}





















function generarIdUnico() {
  // Definir o recuperar el contador desde localStorage
  var contador = parseInt(localStorage.getItem('contador')) || 0;

  // Incrementar el contador
  contador++;

  // Guardar el nuevo valor del contador en localStorage
  localStorage.setItem('contador', contador);

  // Crear el ID concatenando el contador con algún valor adicional
  return  contador;
}


function pagos() {
  // Suponiendo que Apagar es una variable que contiene el monto total a pagar
  var totalPagar = Apagar.toFixed(2);


  // Obtener el elemento select con el id "formaPago"
  var formaPagoElement = document.getElementById("formaPago");

  // Obtener el valor seleccionado por defecto
  var formaPagoSeleccionada = formaPagoElement.value;

  // Obtener la fecha y hora actual
  var fechaHora = new Date().toLocaleString();

  // Crear un objeto con los datos
  var detallesPago = {
    Id: generarIdUnico(),
    Pago: totalPagar,
    FormaPago: formaPagoSeleccionada,
    Fecha_Hora: fechaHora
  };

  // Obtener los detalles de pago existentes de localStorage
  var pagosExist = JSON.parse(localStorage.getItem('pagos')) || [];

  // Agregar el nuevo detalle de pago al array existente
  pagosExist.push(detallesPago);

  // Guardar el array actualizado en localStorage
  localStorage.setItem('pagos', JSON.stringify(pagosExist));

  limpiarCampos();


}



function exportarExcelPagos() {
  // Obtener los detalles de pago de localStorage
  var pagosExist = JSON.parse(localStorage.getItem('pagos')) || [];

  // Crear una matriz de datos para el archivo Excel
  var data = [['ID', 'Pago', 'Medio', 'Fecha y Hora']];

  pagosExist.forEach(function(pago) {
    data.push([pago.Id, pago.Pago, pago.FormaPago, pago.Fecha_Hora]);
  });

  // Crear un libro de trabajo y una hoja de trabajo
  var workbook = XLSX.utils.book_new();
  var sheet = XLSX.utils.aoa_to_sheet(data);

  // Agregar la hoja de trabajo al libro de trabajo
  XLSX.utils.book_append_sheet(workbook, sheet, 'Detalles de Pago');



  var now = new Date();
  var datePart = now.toISOString().slice(0, 10).replace(/-/g, '-');
  var timePart = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  var fileName = 'pagos_del_dia_' + datePart + '_' + timePart + '.xlsx';

  // Guardar el archivo
  XLSX.writeFile(workbook, fileName);
}








































function abrirModalMiModalPagos() {
  var modal = document.getElementById("modalHistorialPagos");
  modal.style.display = "block";

  // Obtener detalles de pago de localStorage
  var pagosExist = JSON.parse(localStorage.getItem('pagos')) || [];

  // Generar HTML para la tabla
  var tablaHTML = "<tr><th>ID</th><th>Pago</th><th>Medios de Pago</th><th>Fecha y Hora</th></tr>";

  pagosExist.forEach(function(pago) {
    tablaHTML += `<tr><td>${pago.Id}</td><td>${pago.Pago}</td><td>${pago.FormaPago}</td><td>${pago.Fecha_Hora}</td></tr>`;
  });

  // Insertar el HTML en la tabla
  document.getElementById("tablaPagos").innerHTML = tablaHTML;
}

function cerrarModalHistorialPagos() {
  var modal = document.getElementById("modalHistorialPagos");
  modal.style.display = "none";
}


