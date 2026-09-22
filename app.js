//variables para consumo de productos
let todosLosProductos = [];
const URL_API = 'https://dummyjson.com/products?limit=100';

//variables DOM
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const contenedorTabla = document.getElementById('contenedor-tabla');
const buscador = document.getElementById('buscador');
const contadorTexto = document.getElementById('contador');
const estadoCarga = document.getElementById('estado-carga');
const estadoError = document.getElementById('estado-error');

//funcion para consumir la API
async function obtenerProductos() {
    try {
        //estados de carga
        estadoCarga.classList.remove('oculto');
        estadoError.classList.add('oculto');
        contenedorTabla.classList.add('oculto');

        //consumo de la API
        const respuesta = await fetch(URL_API);

        //validacion de la respuesta
        if (!respuesta.ok) {
            throw new Error(`Error de conexión (Código: ${respuesta.status})`);
        }

        //validacion de los datos
        const datos = await respuesta.json();

        if (!datos || !Array.isArray(datos.products)) {
            throw new Error('La API no devolvió un arreglo de productos válido.');
        }
    
        todosLosProductos = datos.products;

        //renderizado de la tabla
        estadoCarga.classList.add('oculto');
        contenedorTabla.classList.remove('oculto');
        renderizarTabla(todosLosProductos);

    } catch (error) {
        //manejo de errores
        estadoCarga.classList.add('oculto');
        estadoError.textContent = 'No se pudieron cargar los productos: ' + error.message;
        estadoError.classList.remove('oculto');
    }
}

obtenerProductos();

//funcion para renderizar la tabla donde le entregamos un arreglo de productos y la renderiza en el DOM
function renderizarTabla(productos) {
    // Limpiar el contenido actual de la tabla
    cuerpoTabla.innerHTML = '';

    // Actualizar el contador de resultados
    contadorTexto.textContent = `Mostrando ${productos.length} resultados`;

    // Si se busca algo y no hay resultados, mostrar un mensaje
    if (productos.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="5" class="text-centro">No se encontraron coincidencias.</td></tr>';
        return;
    }

    // Formatear moneda a CLP
    const formateadorMoneda = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    // Crear las filas dinámicamente
    productos.forEach(producto => {
        const precioCLP = producto.price * 980;
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td><img src="${producto.thumbnail}" alt="${producto.title}" class="img-miniatura"></td>
            <td>${producto.title}</td>
            <td>${producto.category}</td>
            <td>${formateadorMoneda.format(precioCLP)}</td>
            <td>${producto.stock}</td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}

//funcion para filtrar los productos por nombre
buscador.addEventListener('input', (evento) => {
    const textoBusqueda = evento.target.value.toLowerCase();
    
    const productosFiltrados = todosLosProductos.filter(producto => 
        producto.title.toLowerCase().includes(textoBusqueda)
    );

    // Renderizamos la tabla solo con los que coinciden
    renderizarTabla(productosFiltrados);
});

// Inicializar la carga de datos cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', obtenerProductos);