//variables para consumo de productos
let todosLosProductos = [];
let productosMostrados = [];
let ordenActual = {
    campo: 'title',
    direccion: 'asc'
};
const URL_API = 'https://dummyjson.com/products?limit=100';

//variables DOM
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const contenedorTabla = document.getElementById('contenedor-tabla');
const buscador = document.getElementById('buscador');
const contadorTexto = document.getElementById('contador');
const estadoCarga = document.getElementById('estado-carga');
const estadoError = document.getElementById('estado-error');
const botonLimpiarFiltro = document.getElementById('limpiar-filtro');

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

//funcion para comparar productos por campo
function compararProductos(a, b, campo) {
    const valorA = a[campo];
    const valorB = b[campo];
    
    // Comparación para campos numéricos
    if (campo === 'price' || campo === 'stock') {
        return Number(valorA) - Number(valorB);
    }
    // Comparación para campos de texto (case insensitive)
    return String(valorA).localeCompare(String(valorB), 'es', { sensitivity: 'base' });
}

// Mapeo de nombres de columnas para mostrar en la tabla
const titulosColumnas = {
    title: 'Título',
    category: 'Categoría',
    price: 'Precio',
    stock: 'Stock'
};

//funcion para actualizar el indicador de orden en los encabezados de la tabla
function actualizarIndicadorOrden() {
    document.querySelectorAll('.ordenable').forEach(th => {
        const campo = th.dataset.columna;
        const textoBase = titulosColumnas[campo] || campo;
        const esActiva = ordenActual.campo === campo;

        th.textContent = esActiva
            ? `${textoBase} ${ordenActual.direccion === 'asc' ? '↑' : '↓'}`
            : textoBase;

        th.classList.toggle('activo', esActiva);
    });
}
//funcion para ordenar productos por campo
function ordenarProductos(campo) {
    const direccion = (
        ordenActual.campo === campo && ordenActual.direccion === 'asc'
    ) ? 'desc' : 'asc';

    ordenActual = { campo, direccion };

    // Ordenar el arreglo de productos mostrados
    productosMostrados = [...productosMostrados].sort((a, b) => {
        const resultado = compararProductos(a, b, campo);
        return direccion === 'asc' ? resultado : -resultado;
    });

    actualizarIndicadorOrden();
    renderizarTabla(productosMostrados);
}

//funcion para actualizar el boton de limpiar filtro
function actualizarBotonLimpiar() {
    if (!buscador || !botonLimpiarFiltro) return;
    const hayFiltro = buscador.value.trim() !== '';
    botonLimpiarFiltro.classList.toggle('oculto', !hayFiltro);
}

//funcion para renderizar la tabla donde le entregamos un arreglo de productos y la renderiza en el DOM
function renderizarTabla(productos) {
    productosMostrados = productos;

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

//funcion para filtrar productos por nombre
if (buscador) {
    buscador.addEventListener('input', (evento) => {
        const textoBusqueda = evento.target.value.trim().toLowerCase();

        actualizarBotonLimpiar();

        const productosFiltrados = todosLosProductos.filter(producto =>
            producto.title.toLowerCase().includes(textoBusqueda)
        );

        renderizarTabla(productosFiltrados);
    });
}

//funcion para limpiar el filtro de busqueda
if (botonLimpiarFiltro && buscador) {
    botonLimpiarFiltro.addEventListener('click', () => {
        buscador.value = '';
        actualizarBotonLimpiar();
        renderizarTabla(todosLosProductos);
        ordenActual = { campo: 'title', direccion: 'asc' };
        actualizarIndicadorOrden();
    });
}

//funcion para ordenar los productos al hacer click en el encabezado de la tabla
document.querySelectorAll('.ordenable').forEach(th => {
    th.addEventListener('click', () => {
        const campo = th.dataset.columna;
        ordenarProductos(campo);
    });
});

// Inicializar el indicador de orden al cargar la página
actualizarIndicadorOrden();

// Inicializar la carga de datos cuando el HTML esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', obtenerProductos);
} else {
    obtenerProductos();
}
