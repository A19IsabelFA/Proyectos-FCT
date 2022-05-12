const d = document,
  tempListado = d.querySelector("#template-listado-datos"),
  tempDatos = d.querySelector("#template-body-datos"),
  tempItem = d.querySelector("#template-item"),
  tempForm = d.querySelector("#template-formulario"),
  select = d.querySelector("#ciclos");
let ciclos = [];
let alumnos = [];

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

function procesarError(error) {
  console.log("Error!");
  let msg = error.status.text || "Ocurrio un error"
  console.log(`Error ${error.status}: ${msg}`)
}

function cargarCiclos() {
  //console.log(ciclos)
  let valor = 1;
  let options = `<option value="0">Elige un Ciclo</option>`
  ciclos.forEach(el => {
    options += `<option value="${valor++}">${el.ciclo}</option>`
  });
  select.innerHTML = options;
}

function cargarAlumnos() {
  console.log(alumnos)
  let proyectos = []
  alumnos.forEach(el => {
    if (el.ciclo == select.value) {
      proyectos.push(el)
    }
  })
  renderAlumnos(proyectos)
}

function renderAlumnos(alum) {
  const fragmento = document.createDocumentFragment()
  if (alun.length > 0) {
    alum.forEach(el => {
      console.log(el.nombre)
      p = tempDatos.cloneNode(true)
      nombre= p.querySelectorAll(p)[0];
      it= p.querySelectorAll(p)[1];
      nombre.innerHTML=el.nombre;
    })
  } else {
    fragmento.innerHTML = "No exixten proyectos en este ciclo"
    tempListado.appendChild(fragmento)
  }
}

// EVENTOS

// al cargar la pagina
d.addEventListener("DOMContentLoaded", e => {
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

// al escoger ciclo
d.addEventListener('change', e => {
  ajax({
    url: "http://localhost:3000/alumnos",
    method: "GET",
    succes: (opciones) => {
      alumnos = opciones;
      cargarAlumnos()
    },
    error: (er) => procesarError(er),
  })
})