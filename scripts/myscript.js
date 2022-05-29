const d = document,
  tempListado = d.querySelector("#template-listado-datos").content,
  tempDatos = d.querySelector("#template-body-datos").content,
  tempItem = d.querySelector("#template-item").content,
  tempForm = d.querySelector("#template-formulario").content,
  select = d.querySelector("#ciclos"),
  listado = d.querySelector("main");
let metodo = "";
let id = "";
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
  console.log(alumnos)
  if (alumnos.length > 0) {
    alumnos.forEach(el => {
      let item = tempItem.cloneNode(true)
      let nombre = item.querySelector("p");
      let acciones = item.querySelectorAll("i")
      acciones.forEach(enlace => enlace.dataset.alumno = el.id)
      nombre.innerHTML = el.nombre;
      // console.log(nombre)
      fragmento.appendChild(item)
    })
    let datos = tempDatos.cloneNode(true)
    datos.querySelector("#td-body").appendChild(fragmento);
    let lista = tempListado.cloneNode(true)
    lista.querySelector("#listado-datos").appendChild(datos);
    listado.appendChild(lista);
  } else if (select.value != 0) {
    let lista = tempListado.cloneNode(true);
    lista.querySelector("h2").innerHTML = "No hay ningún proyecto";
    let datos = tempDatos.cloneNode(true)
    lista.querySelector("#listado-datos").appendChild(datos);
    listado.appendChild(lista);
    d.querySelectorAll('#tabla-datos p').forEach(el => {
      el.innerHTML = "";
    });
  }
  d.querySelector('#btn-proyecto').href = '#';
  //d.querySelector('#btn-proyecto').setAttribute('onclick', "cargarFormulario()")
  d.querySelector('#btn-proyecto').addEventListener('click', e => {
    e.preventDefault();
    cargarFormulario()
    d.querySelector('#btn-enviar').value = "AÑADIR";
    d.querySelector("span").innerHTML = "Añadir"
    metodo = "POST"
    id = "";
  })
  d.querySelectorAll('i.fa-undo-alt').forEach(el => {
    metodo = "PUT"
    el.addEventListener('click', e => {
      e.preventDefault()
      id = e.target.dataset.alumno;
      ajax({
        url: `http://localhost:3000/alumnos/${e.target.dataset.alumno}`,
        method: "GET",
        succes: (opciones) => {
          cargarFormulario(opciones)
        },
        error: (er) => procesarError(er),
      })

    })

  })
  d.querySelectorAll('i.fa-trash').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()
      id = e.target.dataset.alumno
      enviarDatos("DELETE", id)
    })
  })

}
// añade, actualiza o borra segun el metodo que sele pase
function enviarDatos(metodo, ids, data = "") {
  let formulario = d.querySelector("#form-acciones")
  console.log(metodo);
  if (metodo == "POST" || metodo == "PUT") {
    data = cargarDatos()
  }
  console.log('data:', metodo, id)
  ajax({
    url: (id) ? `http://localhost:3000/alumnos/${ids}` : `http://localhost:3000/alumnos`,
    method: metodo,
    succes: (opciones) => {
      console.log("datos", opciones)
      getDatos();
      if (metodo != "DELETE") {
        activarDesactivar();
      }
    },
    error: (er) => procesarError(er),
    datos: data
  })
}

function cargarFormulario(datos = null) {
  siExisteBorrar('#acciones');
  let formu = tempForm.cloneNode(true);
  if (datos) {
    formu.querySelector("#nombre").value = datos.nombre
    formu.querySelector("#nif").value = datos.nif
    formu.querySelector("#proyecto").value = datos.proyecto
    formu.querySelector("#fecha").value = datos.fecha
    formu.querySelector("#hora").value = datos.hora
  }
  listado.appendChild(formu);
  activarDesactivar()
  // eventos botones formulario
  d.querySelector('#btn-cancelar').addEventListener('click', cancelar)
  d.querySelector('#btn-enviar').addEventListener('click', e => {
    e.preventDefault()
    enviarDatos(metodo, id)
  })
}
// activa o desactiva el select, el boton añadir proyecto y los botones de elimnar o actualizar
function activarDesactivar() {
  (d.querySelector("#btn-proyecto.off")) ? select.disabled = false: select.disabled = true
  d.querySelector("#btn-proyecto").classList.toggle("off")
  d.querySelectorAll('i').forEach(el => {
    el.classList.toggle("off")
  })
}
// si existe el id que se le pasa lo borra
function siExisteBorrar(id) {
  if (d.querySelector(id)) {
    d.querySelector(id).remove()
  }
}
// cierra el formulario
function cancelar() {
  siExisteBorrar('#acciones');
  activarDesactivar();
}
// recoge los datos del formulario
function cargarDatos() {
  let formulario = d.querySelector("#form-acciones")
  let datos = {
    nombre: formulario.nombre.value,
    nif: formulario.nif.value,
    proyecto: formulario.proyecto.value,
    ciclo: select.value,
    fecha: formulario.fecha.value,
    hora: formulario.hora.value
  }
  return datos;
}
// obtener datos de la BBDD
function getDatos() {
  ajax({
    url: `http://localhost:3000/alumnos?ciclo=${select.value}`,
    method: "GET",
    succes: (opciones) => {
      renderAlumnos(opciones)
    },
    error: (er) => procesarError(er),
  })
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
select.addEventListener('change', getDatos)