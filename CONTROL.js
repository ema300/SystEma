var productos = [];
var carrito = [];
var vendido = 0.00;
var acum = 0;
var nuevoStock = 0;
var copiaCantidad = 0;
var pro = [];


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
        stock = 0;
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



});
function displayProductsInTable(productsToDisplay = productos) {
  var tabla = document.getElementById('tabla-productos');
  tabla.innerHTML = ""; // Limpiar el contenido existente de la tabla
  var headerRow = tabla.insertRow();
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
      eliminarProducto(index);
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


function eliminarProducto(index) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {






    if (compra_actual === 'no' && carrito[index].Total === productos[index].Total) {
      vendido = localStorage.getItem('valor_compra_actual');

      acum = Math.max(parseFloat(vendido), carrito[index].Total) - Math.min(parseFloat(vendido), carrito[index].Total);
      localStorage.setItem('valor_compra_actual', JSON.stringify(acum));
      var vendidoActualElement = document.getElementById('vendido-actual');
      vendidoActualElement.textContent = 'Total: $' + acum;


      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));


      productos.splice(index, 1);
      localStorage.setItem('productos', JSON.stringify(productos));
      displayProductsInTable();
      actualizarTotalPrecio(); // Actualizar el total de precios después de eliminar
      actualizarCompraActual();

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
        pro[j].stock -= productos[i].Cantidad;
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



  compra_actual = localStorage.getItem('finalizo_compra');
  vendido = localStorage.setItem('valor_compra_actual', '0.00');
  refrescarPagina();
}



document.getElementById('borrar-compra').addEventListener('click', function () {
  var confirmacion = confirm('¿Estás seguro de que deseas cancelar la compra?');
  if (confirmacion) {

    borrar_compra();
    displayProductsInTable();
    actualizarCompraActual();


  }
});


















function finalizar_compra() {
  var confirmacion = confirm('¿Estás seguro de que deseas finalizar la compra?');
  if (confirmacion) {






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
    refrescarPagina();
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
    var vendidoActualElement = document.getElementById('vendido-actual');
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
  const precio = parseFloat(document.getElementById('preci').value);
  const stock = parseInt(document.getElementById('st').value);
  const categoria = document.getElementById('categoria').value;


  if (nombre.length < 1) {
    alert('Complete el nombre del producto');
    return;
  }
  if (categoria.length < 1) {
    alert('complete la categoria del producto');
    return;
  }



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
  agregarProductoATabla(producto);

  mostrarPorUnSegundo("Se agrego correctamente");



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





function agregarProductoATabla(producto) {
  const tablaProductos = document.getElementById("tabla-stock");

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









// Agregar un event listener de clic al botón de búsqueda
document.getElementById('boton-buscar').addEventListener('click', function () {
  const buscando = document.getElementById('buscando').value.trim().toLowerCase();
  const Table = document.getElementById('tabla-stock');
  for (var i = 1; i < Table.rows.length; i++) {
    var found = false;
    var row = Table.rows[i];

    for (var j = 0; j < row.cells.length; j++) {
      var cellText = row.cells[j].textContent.toLowerCase();

      // Verificar si el término de búsqueda es un número
      if (isNumeric(buscando) && isNumeric(cellText)) {
        if (parseFloat(cellText) <= parseFloat(buscando)) {
          found = true;
          break;
        }
      } else if (cellText.includes(buscando)) {
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

function isNumeric(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
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