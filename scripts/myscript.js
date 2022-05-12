const d = document,
  tempListado = d.querySelector("#template-listado-datos"),
  tempDatos = d.querySelector("#template-body-datos"),
  tempItem = d.querySelector("#template-item"),
  tempForm = d.querySelector("#template-formulario"),
  select = d.querySelector("#ciclos");
let ciclos = [];

//FUNCIONES
function ajax(options) {
  let {
    url,
    method,
    succes,
    error,
    data
  } = options;
  const opciones = {
    method: method || "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }
  fetch(url, opciones)
    .then(respuesta => {
      return (respuesta.ok) ? respuesta.json() : Promise.reject(respuesta)
    })
    .then(texto => succes(texto))
    .catch(er => error(er))
}

function cargarCiclos() {
  console.log(ciclos)
  let options =`<option value="">Elige un Ciclo</option>`
  ciclos.forEach(el => {
    options+=`<option value="">${el.ciclo}</option>`
  });
  select.innerHTML =options;
}
function procesarError(error) {
  console.log("Error!");
  let msg = error.status.text || "Ocurrio un error"
  console.log(`Error ${error.status}: ${msg}`) 
}

// EVENTOS

// AL CARGAR LA PAGINA
document.addEventListener("DOMContentLoaded", e => {
  ajax({
    url: "http://localhost:3000/ciclos",
    method: "GET",
    succes: (opciones) => {
      ciclos = opciones;
      cargarCiclos()
    },
    error: (er) => procesarError(er),
  })
})
