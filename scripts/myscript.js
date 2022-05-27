const d = document,
  tempListado = d.querySelector("#template-listado-datos").content,
  tempDatos = d.querySelector("#template-body-datos").content,
  tempItem = d.querySelector("#template-item").content,
  tempForm = d.querySelector("#template-formulario").content,
  select = d.querySelector("#ciclos"),
  listado = d.querySelector("main");

let btn;

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

function cargarCiclos(ciclos) {
  // console.log(ciclos)
  let options = `<option value="0">Elige un Ciclo</option>`
  ciclos.forEach(el => {
    options += `<option value="${el.id}">${el.ciclo}</option>`
  });
  select.innerHTML = options;
}

function renderAlumnos(alumnos) {
  // console.log(alumnos)
  siExisteBorrar('#listado-datos')
  siExisteBorrar('#acciones');
  const fragmento = document.createDocumentFragment()
  if (alumnos.length > 0) {
    alumnos.forEach(el => {
      let item = tempItem.cloneNode(true)
      let nombre = item.querySelector("p");
      nombre.innerHTML = el.nombre;
      // console.log(nombre)
      fragmento.appendChild(item)
    })
    let datos = tempDatos.cloneNode(true)
    datos.querySelector("#td-body").appendChild(fragmento);
    let lista = tempListado.cloneNode(true)
    lista.querySelector("#listado-datos").appendChild(datos);
    listado.appendChild(lista);
  } else {
    let lista = tempListado.cloneNode(true);
    lista.querySelector("h2").innerHTML = "NO HAY NINGÚN PROYECTO";
    let datos = tempDatos.cloneNode(true)
    lista.querySelector("#listado-datos").appendChild(datos);
    listado.appendChild(lista);
  }
  btn = d.querySelector('#btn-proyecto');
  btn.href = '#';
  btn.setAttribute('onclick', "cargarFormulario()")
}

function cargarFormulario() {
  siExisteBorrar('#acciones');
  let formu = tempForm.cloneNode(true);
  listado.appendChild(formu);
  activarDesactivar();
  d.querySelector('#btn-enviar').value = "AÑADIR";
  d.querySelector('#btn-cancelar').addEventListener('click', cancelar)
}
// activa o desactiva el select y el boton añadir proyecto
function activarDesactivar() {
  if (d.querySelector("#btn-proyecto.off")) {
    select.disabled = false
    d.querySelector("#btn-proyecto").classList.remove("off")
  } else {
    select.disabled = true
    d.querySelector("#btn-proyecto").classList.add("off")
  }

}
// si existe el id que se le pasa lo borra
function siExisteBorrar(id) {
  if (d.querySelector(id)) {
    d.querySelector(id).remove()
  }
}

function cancelar() {
  siExisteBorrar('#acciones');
  activarDesactivar();
}

// EVENTOS

// al cargar la pagina
d.addEventListener("DOMContentLoaded", e => {
  ajax({
    url: "http://localhost:3000/ciclos",
    method: "GET",
    succes: (opciones) => {
      cargarCiclos(opciones)
    },
    error: (er) => procesarError(er),
  })

})

// al escoger ciclo
d.addEventListener('change', e => {
  ajax({
    url: `http://localhost:3000/alumnos?ciclo=${select.value}`,
    method: "GET",
    succes: (opciones) => {
      renderAlumnos(opciones)
    },
    error: (er) => procesarError(er),
  })


})