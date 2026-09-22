# Catálogo de Productos

Este proyecto es una aplicación web de una sola página (SPA) desarrollada para consumir la API pública de DummyJSON y mostrar un catálogo de productos. El objetivo principal es demostrar el manejo fundamental de peticiones asíncronas, manipulación del DOM y diseño responsivo utilizando tecnologías web base.

##Cómo ejecutar el proyecto

Dado que el proyecto está construido puramente con lenguajes base, no requiere instalación de dependencias, entornos de ejecución (como Node.js) ni servidores locales.

1. Clona este repositorio o descomprime el archivo ZIP.
2. Navega hasta la carpeta del proyecto.
3. Abre el archivo `index.html` directamente en cualquier navegador web moderno (Google Chrome, Firefox, Safari, Edge).

## Decisiones Técnicas

El desarrollo se guio por los requerimientos del enunciado, priorizando un código limpio, funcional y sin dependencias externas.

* **Tecnologías Base:** Se utilizó estrictamente HTML5, CSS3 y JavaScript puro, cumpliendo con la restricción de no emplear frameworks como React, Vue o Bootstrap.
* **Consumo de API y Manejo de Memoria:** La aplicación realiza una única petición `fetch` al endpoint de DummyJSON para obtener los 100 productos solicitados. Estos datos se almacenan en una variable global en memoria. Esto permite que el filtrado y el ordenamiento sean instantáneos y no saturen el servidor con peticiones HTTP innecesarias por cada pulsación de tecla.
* **Manejo de Estados:** Se implementó un control de UI dinámico gestionando las clases CSS (`oculto`) para mostrar indicadores de carga al iniciar la petición, y mensajes de error estilizados en caso de que la API falle (bloque `try/catch`).
* **Buscador en Tiempo Real:** El filtro escucha el evento `input` y procesa la búsqueda convirtiendo los textos a minúsculas, lo que garantiza coincidencias exactas sin importar cómo escriba el usuario. Además, se añadió un botón dinámico para "Eliminar filtro" que mejora la experiencia de usuario (UX).
* **Formateo de Moneda (CLP):** Para cumplir con el formato de precio solicitado (ej: $1.299), se utilizó la API nativa `Intl.NumberFormat`. Como los datos originales de la API están en un formato numérico bajo, se multiplicó el valor por 980 para simular una conversión realista a Pesos Chilenos (CLP) visualmente.
* **Ordenamiento de Columnas (Requisito Opcional):** Se añadió lógica de ordenamiento dinámico al hacer clic en los encabezados de la tabla (`Título`, `Categoría`, `Precio`, `Stock`). El algoritmo detecta si el dato es texto o número y ordena de forma ascendente o descendente, actualizando visualmente la dirección con flechas (↑/↓).
* **Diseño Responsivo (Requisito Opcional):** En lugar de depender de media queries complejas, se optó por un enfoque robusto mediante un contenedor con `overflow-x: auto` y `max-height: 500px`. Esto garantiza que la tabla no rompa la interfaz en dispositivos móviles (creando un scroll horizontal interno) y mantiene el catálogo compacto en pantallas grandes con un scroll vertical.
