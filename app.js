//variables para consumo de productos
let todosLosProductos = [];
const URL = 'https://dummyjson.com/products';

//variables DOM
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const contenedorTabla = document.getElementById('contenedor-tabla');
const buscador = document.getElementById('buscador');
const contadorTexto = document.getElementById('contador');

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