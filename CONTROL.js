var productos = [];
var carrito = [];
var vendido = 0.00;
var acum = 0;
var nuevoStock = 0;
var copiaCantidad = 0;
localStorage.setItem('finalizo_compra', 'no');
// Obtén el valor almacenado en localStorage
compra_actual = localStorage.getItem('finalizo_compra');


var historial = [];


localStorage.setItem('c', '1234');








document.getElementById('cargar-archivo').addEventListener('click', function () {
  var input = document.getElementById('archivo-xlsx');

  input.click(); // Simula el clic en el input para seleccionar un archivo
  refrescarPagina();

});

document.getElementById('archivo-xlsx').addEventListener('change', function (e) {
  var file = e.target.files[0]; // Obtiene el archivo seleccionado


  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      refrescarPagina();
      // Mostrar los datos en una tabla
      mostrarDatosEnTabla(jsonData);
      // Crear lista de productos para autocompletado

      crearListaAutocompletado(jsonData);
    };

    reader.readAsArrayBuffer(file);
  }
});

function mostrarDatosEnTabla(data) {

  var tabla = document.getElementById('tabla-datos');
  tabla.innerHTML = ''; // Limpiar contenido existente de la tabla

  var headerRow = tabla.createTHead().insertRow();
  for (var header of data[0]) {
    var headerCell = headerRow.insertCell();
    headerCell.textContent = header;
  }

  for (var i = 1; i < data.length; i++) {
    var row = tabla.insertRow();
    for (var j = 0; j < data[i].length; j++) {
      var cell = row.insertCell();
      cell.textContent = data[i][j];
    }
  }
  // Guardar los datos en localStorage
  localStorage.setItem('datosExcel', JSON.stringify(data));
}

function crearListaAutocompletado(data) {

  var opcionesDatalist = document.getElementById('opciones-productos');
  data.slice(1).forEach(function (row) {
    var nombreProducto = row[0]; // Asumiendo que la columna 0 es el nombre del producto
    var precioProducto = row[1]; // Asumiendo que la columna 1 es el precio del producto
    var stockProducto = row[2]; // Asumiendo que la columna 2 es el stock del producto

    var option = document.createElement('option');
    option.value = nombreProducto;
    option.setAttribute('data-precio', precioProducto);
    option.setAttribute('data-stock', stockProducto); // Agregar stock como atributo
    opcionesDatalist.appendChild(option);
  });
}


// Autocompletado del precio al seleccionar el nombre del producto
document.getElementById('nombre').addEventListener('input', function () {
  var inputNombre = this.value.toLowerCase();
  var options = document.getElementById('opciones-productos').getElementsByTagName('option');

  for (var i = 0; i < options.length; i++) {
    if (options[i].value.toLowerCase() === inputNombre) {
      var precio = options[i].getAttribute('data-precio');
      var stock = options[i].getAttribute('data-stock'); // Obtener el stock

      document.getElementById('precio').value = precio;
      document.getElementById('stock').value = stock; // Mostrar el stock
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
  if (localStorage.getItem('datosExcel')) {
    var datosGuardados = JSON.parse(localStorage.getItem('datosExcel'));
    // Mostrar los datos guardados en la tabla y crear lista de autocompletado
    mostrarDatosEnTabla(datosGuardados);
    crearListaAutocompletado(datosGuardados);
  }
  if (localStorage.getItem('historial')) {
    historial = JSON.parse(localStorage.getItem('historial'));
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
    deleteButton.innerHTML = 'Eliminar';
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
      vendidoActualElement.textContent = 'Compra actual: $' + acum;


      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));


      productos.splice(index, 1);
      localStorage.setItem('productos', JSON.stringify(productos));
      displayProductsInTable()


    }
    console.log(productos.length)
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
      actualizarCompraActual();
    }
    else {
      productos.splice(index, 1);
      localStorage.setItem('productos', JSON.stringify(productos));

      displayProductsInTable();

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


  // Encontrar la fila correspondiente en la tabla de datos desde XLSX
  var tabla = document.getElementById('tabla-datos');
  var filas = tabla.rows;

  for (var i = 0; i < filas.length; i++) {
    var nombreProductoTabla = filas[i].cells[0].innerText; // Suponiendo que la primera celda es el nombre del producto

    // Buscar la fila correspondiente al producto comprado
    if (nombreProductoTabla.toLowerCase() === nombre.toLowerCase()) {
      // Actualizar el stock en la tabla de datos desde XLSX
      filas[i].cells[2].innerText = nuevoStock; // Suponiendo que la tercera celda es el stock

      break; // Salir del bucle después de actualizar el stock
    }
  }
  var datosGuardados = JSON.parse(localStorage.getItem('datosExcel'));
  for (var i = 1; i < datosGuardados.length; i++) {
    if (datosGuardados[i][0].toLowerCase() === nombre.toLowerCase()) {
      datosGuardados[i][2] = nuevoStock.toString(); // Actualizar el stock en los datos guardados
      localStorage.setItem('datosExcel', JSON.stringify(datosGuardados)); // Guardar datos actualizados en localStorage
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




// Obtener datos del localStorage




// Obtener referencia a la tabla
const historialTable = document.getElementById('historial-table');



// Función para cargar datos del historial desde localStorage al cargar la página

// Llamar a la función para cargar datos del historial desde localStorage al cargar la página
//   cargarHistorialDesdeLocalStorage();


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











document.getElementById('exportar-xlsx').addEventListener('click', function () {
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(historial);
  XLSX.utils.book_append_sheet(wb, ws, 'Productos');

  var now = new Date();
  var datePart = now.toISOString().slice(0, 10).replace(/-/g, '-');
  var timePart = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  var fileName = 'productos_' + datePart + '_' + timePart + '.xlsx';

  XLSX.writeFile(wb, fileName);
});

document.getElementById('exportar-stock-xlsx').addEventListener('click', function () {
  var datos = JSON.parse(localStorage.getItem('datosExcel'));
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(wb, ws, 'Productos-stock');

  var now = new Date();
  var datePart = now.toISOString().slice(0, 10).replace(/-/g, '-');
  var timePart = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  var fileName = 'productos-stock-editar_' + datePart + '_' + timePart + '.xlsx';

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
    console.log('No finalizo');
    vendido = localStorage.getItem('valor_compra_actual');
    acum = parseFloat(acum) + parseFloat(vendido);
    localStorage.setItem('valor_compra_actual', JSON.stringify(acum));
    var vendidoActualElement = document.getElementById('vendido-actual');
    vendidoActualElement.textContent = 'Compra actual: $' + acum;
  } else {
    console.log('Si finalizo');
    vendido = 0;
    var vendidoActualElement = document.getElementById('vendido-actual');
    vendidoActualElement.textContent = 'Compra actual: $' + vendido.toFixed(2);
    vendido = localStorage.setItem('valor_compra_actual', '0');
  }
}














document.addEventListener('DOMContentLoaded', function () {
  // Obtener referencia al botón y al modal
  var btnMostrarModal = document.getElementById('btnMostrarModal');
  var modal = document.getElementById('modal');

  // Evento al hacer clic en el botón para mostrar el modal
  btnMostrarModal.addEventListener('click', function () {
    modal.style.display = 'block'; // Mostrar el modal
  });

  // Evento para cerrar el modal al hacer clic en el botón de cerrar (×)
  var closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', function () {
    refrescarPagina();

    modal.style.display = 'none'; // Ocultar el modal al hacer clic en el botón de cerrar
  });

  // Cierra el modal si se hace clic fuera del área del modal
  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
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












function editarDatosEnTabla(row, newData) {
  for (var j = 0; j < newData.length; j++) {
    row.cells[j].innerText = newData[j];
  }
}

// Función para eliminar la fila correspondiente en la tabla y el localStorage
function eliminarFilaDatosXLSX(rowIndex) {
  var tabla = document.getElementById('tabla-datos');
  var filas = tabla.rows;

  var data = JSON.parse(localStorage.getItem('datosExcel'));

  var nombreProducto = filas[rowIndex].cells[0].innerText.toLowerCase();

  // Eliminar la fila correspondiente en el localStorage
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toLowerCase() === nombreProducto) {
      data.splice(i, 1);
      break;
    }
  }
  localStorage.setItem('datosExcel', JSON.stringify(data));

  // Eliminar la fila en la tabla
  tabla.deleteRow(rowIndex);
}

// Evento para editar y eliminar datos al hacer clic en la tabla "Datos desde Xlsx"
function editarDatoEnTabla(cell, newData) {
  cell.innerText = newData;
}

document.getElementById('tabla-datos').addEventListener('click', function (e) {
  var contrasenaAlmacenada = localStorage.getItem('c'); // Reemplaza 'contrasena' con la clave real

  var contrasenaIngresada = prompt('Ingresa la contraseña para editar los datos desde XLSX:');

  var target = e.target;
  if (contrasenaIngresada === contrasenaAlmacenada) {
    if (target.tagName === 'TD') {

      var cell = target;

      var newData = prompt('Editar dato:', cell.innerText);

      if (newData !== null) {
        if (confirm(`¿Estás seguro de editar "?`)) {

          editarDatoEnTabla(cell, newData);

          // Obtener la fila y actualizar el localStorage con el dato editado
          var row = cell.parentElement;
          var storedData = JSON.parse(localStorage.getItem('datosExcel'));
          var rowIndex = row.rowIndex;
          var columnIndex = cell.cellIndex;
          if (columnIndex === 1 || columnIndex === 2) { // Si la celda es de Precio o Stock
            if (!esNumero(newData)) {
              alert('Por favor, ingresa un valor numérico para Precio o Stock.');
              return;
            }
          }
          cell.textContent = newData;

          // Obtener la fila y actualizar el localStorage con el dato editado
          var storedData = JSON.parse(localStorage.getItem('datosExcel'));
          storedData[rowIndex][columnIndex] = newData;

          localStorage.setItem('datosExcel', JSON.stringify(storedData));
        }
      }

    } else if (target.tagName === 'BUTTON') {
      var confirmacion = confirm('¿Estás seguro de que deseas eliminar esta fila?');
      if (confirmacion) {
        var rowIndex = target.parentElement.rowIndex;
        eliminarFilaDatosXLSX(rowIndex);
        refrescarPagina();
      }
    }

  } else {
    // La contraseña es incorrecta, mostrar un mensaje de error
    alert('Contraseña incorrecta. No tienes permiso para editar los datos.');
  }
});




//Refrescar la pagina

function refrescarPagina() {
  location.reload();
}


function esNumero(valor) {
  return !isNaN(parseFloat(valor)) && isFinite(valor);
}















