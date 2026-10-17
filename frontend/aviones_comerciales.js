//---------------------------------------//
//--|funcionalidad_aviones_comerciales|--//
//---------------------------------------//
const tarjetas = document.querySelectorAll('.tarjeta');
const botonesFiltro = document.querySelectorAll('.filtro');
const contador = document.getElementById('contador');
const textoVacio = document.getElementById('vacio');
const CLAVE = 'aviones_estado';
const estadoInicial = {
    favoritos: [],
    notas: {},
    filtro: 'todos'
};
let estado = leerEstado();
//--------------------------//
//--|leer_estado_guardado|--//
//--------------------------//
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) {
            return {
                ...estadoInicial,
                ...JSON.parse(guardado)
            };
        }
    } catch (error) {
        console.error('No se pudo leer el estado guardado.', error);
    }
    return {
        ...estadoInicial,
        favoritos: [],
        notas: {}
    };
}
function guardarEstado() {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (error) {
        console.error('No se pudo guardar el estado.', error);
    }
}
//-----------------------//
//--|alternar_favorito|--//
//-----------------------//
function alternarFavorito(id) {
    if (estado.favoritos.includes(id)) {
        estado.favoritos = estado.favoritos.filter(function(favorito) {
            return favorito !== id;
        });
    } else {
        estado.favoritos.push(id);
    }
    guardarEstado();
    actualizarPantalla();
}
//--------------------//
//--|cambiar_filtro|--//
//--------------------//
function cambiarFiltro(filtro) {
    estado.filtro = filtro;
    guardarEstado();
    actualizarPantalla();
}
function guardarNota(id, texto) {
    estado.notas[id] = texto;
    guardarEstado();
}
//-------------------------//
//--|actualizar_pantalla|--//
//-------------------------//
function actualizarPantalla() {
    tarjetas.forEach(function(tarjeta) {
        const id = tarjeta.dataset.id;
        const esFavorita = estado.favoritos.includes(id);
        const botonFavorito = tarjeta.querySelector('[data-fav]');
        tarjeta.classList.toggle('favorita', esFavorita);
        botonFavorito.textContent = esFavorita
            ? 'Quitar favorito'
            : 'Marcar favorito';
        tarjeta.hidden = estado.filtro === 'favoritos' && !esFavorita;
    });
    botonesFiltro.forEach(function(boton) {
        boton.classList.toggle(
            'activo',
            boton.dataset.filtro === estado.filtro
        );
    });
    contador.textContent = estado.favoritos.length;
    textoVacio.hidden = !(
        estado.filtro === 'favoritos' &&
        estado.favoritos.length === 0
    );
}
//----------------------------//
//--|cargar_notas_guardadas|--//
//----------------------------//
function cargarNotas() {
    tarjetas.forEach(function(tarjeta) {
        const id = tarjeta.dataset.id;
        const campoNota = tarjeta.querySelector('textarea');
        campoNota.value = estado.notas[id] || '';
    });
}
//------------------------------//
//--|eventos_de_la_aplicacion|--//
//------------------------------//
document.addEventListener('click', function(evento) {
    const botonFavorito = evento.target.closest('[data-fav]');
    const botonFiltro = evento.target.closest('[data-filtro]');
    if (botonFavorito) {
        const tarjeta = botonFavorito.closest('.tarjeta');
        alternarFavorito(tarjeta.dataset.id);
    }
    if (botonFiltro) {
        cambiarFiltro(botonFiltro.dataset.filtro);
    }
});
document.addEventListener('input', function(evento) {
    if (evento.target.matches('.tarjeta textarea')) {
        const tarjeta = evento.target.closest('.tarjeta');
        guardarNota(tarjeta.dataset.id, evento.target.value);
    }
});
//------------------------//
//--|iniciar_aplicacion|--//
//------------------------//
cargarNotas();
actualizarPantalla();