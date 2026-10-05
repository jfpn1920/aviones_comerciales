// ===== REFERENCIAS A LOS ELEMENTOS DEL HTML =====
const tarjetas = document.querySelectorAll('.tarjeta');   // las tres tarjetas
const botonesFiltro = document.querySelectorAll('.filtro'); // botones Todos / Favoritos
const contador = document.getElementById('contador');     // número de favoritos
const textoVacio = document.getElementById('vacio');      // mensaje "sin favoritos"
// ===== CLAVE DE LOCALSTORAGE =====
const CLAVE = 'aviones_estado';
// ===== ESTADO POR DEFECTO =====
// favoritos: ids de las tarjetas marcadas | notas: texto por tarjeta | filtro: vista actual
const estadoInicial = { favoritos: [], notas: {}, filtro: 'todos' };
// ===== LEER EL ESTADO GUARDADO =====
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        // Si hay datos los convertimos de texto a objeto; si no, usamos el estado inicial
        return guardado ? { ...estadoInicial, ...JSON.parse(guardado) } : estadoInicial;
    } catch (error) {
      return estadoInicial; // si algo falla, empezamos desde cero
    }
}
// Al cargar la página recuperamos lo que ya estaba guardado
let estado = leerEstado();
// ===== GUARDAR EL ESTADO =====
// Guarda todo el estado como texto en localStorage
function guardarEstado() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// ===== MARCAR O DESMARCAR UN FAVORITO =====
function alternarFavorito(id) {
    if (estado.favoritos.includes(id)) {
        // Ya era favorito: lo quitamos de la lista
        estado.favoritos = estado.favoritos.filter(favorito => favorito !== id);
    } else {
        // No era favorito: lo agregamos
        estado.favoritos.push(id);
    }
    guardarEstado();
    actualizarPantalla();
}
// ===== CAMBIAR EL FILTRO (todos o favoritos) =====
function cambiarFiltro(filtro) {
    estado.filtro = filtro;
    guardarEstado();
    actualizarPantalla();
}
// ===== GUARDAR LA NOTA DE UNA TARJETA =====
function guardarNota(id, texto) {
    estado.notas[id] = texto;
    guardarEstado();
}
// ===== ACTUALIZAR TODO LO QUE SE VE EN PANTALLA =====
function actualizarPantalla() {
    let visibles = 0; // cuántas tarjetas se están mostrando
    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.id;                       // id de la tarjeta
        const esFavorita = estado.favoritos.includes(id);
        // Resalta la tarjeta y cambia el texto del botón
        tarjeta.classList.toggle('favorita', esFavorita);
        tarjeta.querySelector('[data-fav]').textContent =
            esFavorita ? 'Quitar de favoritos' : 'Marcar favorito';
        // Muestra u oculta la tarjeta según el filtro activo
        const mostrar = estado.filtro === 'todos' || esFavorita;
        tarjeta.hidden = !mostrar;
        if (mostrar) visibles++;
    });
    // Marca como activo el botón del filtro actual
    botonesFiltro.forEach(boton => {
        boton.classList.toggle('activo', boton.dataset.filtro === estado.filtro);
    });
    contador.textContent = estado.favoritos.length;  // actualiza el contador
    textoVacio.hidden = visibles > 0;                // mensaje si no hay tarjetas
}
// ===== RESTAURAR LAS NOTAS EN LOS CAMPOS DE TEXTO =====
function cargarNotas() {
    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.id;
        tarjeta.querySelector('textarea').value = estado.notas[id] || '';
    });
}
// ===== EVENTOS =====
// Un solo "click" en el documento detecta qué botón se pulsó
document.addEventListener('click', evento => {
    const botonFav = evento.target.closest('[data-fav]');
    const botonFiltro = evento.target.closest('[data-filtro]');
    if (botonFav) alternarFavorito(botonFav.closest('.tarjeta').dataset.id);
    if (botonFiltro) cambiarFiltro(botonFiltro.dataset.filtro);
});
// Cada vez que se escribe en una nota, se guarda al instante
document.addEventListener('input', evento => {
    if (evento.target.matches('textarea')) {
        guardarNota(evento.target.closest('.tarjeta').dataset.id, evento.target.value);
    }
});
// ===== INICIO: se ejecuta al cargar o refrescar la página =====
cargarNotas();       // recupera las notas escritas
actualizarPantalla(); // recupera favoritos y filtro