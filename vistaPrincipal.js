import { crearTabla, agregarManejadorTR } from "./tablaDinamica.js";
import { crearFormUpdate,  crearFormAlta} from "./formHelper.js";
import { toObjs } from "./vehiculo.js"

let divTabla;
let formDatos;
let complementosTabla;

let vistaData = document.getElementById("dataOut");

export function inicializarManejadores() {
    const LS_vehiculos = localStorage.getObj("vehiculos");
    divTabla = document.getElementById('divTabla');
    formDatos = document.getElementById('formDatos');
    complementosTabla = document.getElementById('complements');
    actualizarTabla(LS_vehiculos);
    const filas = document.querySelectorAll('tr');
    manejadorEventoFilas(filas);

    document.addEventListener('refrescarTablaVehiculos', (event) => {
        const LS_vehiculos = event.detail;
        vaciarElemento(formDatos);
        actualizarTabla(LS_vehiculos);
        const filas = document.querySelectorAll('tr');
        manejadorEventoFilas(filas);
        vistaData.style.display = "block";
    });
}

export function actualizarTabla(vehiculos) {
    vaciarElemento(divTabla);
    crearCheckboxs();
    divTabla.appendChild(crearTabla(vehiculos));

    const botonAgregar = document.createElement('button');
    botonAgregar.innerHTML = "Agregar";
    botonAgregar.addEventListener('click', () => {
        vistaData.style.display = "none";
        crearFormAlta(formDatos);
    });
    divTabla.appendChild(botonAgregar);
}

function manejadorEventoFilas(filas) {
    const LS_vehiculos = toObjs(localStorage.getObj("vehiculos"));
    filas.forEach((fila) => {
        fila.addEventListener('click', () => {
            let idFila = fila.id;
            console.log(idFila);
            let obj = LS_vehiculos.find((vehiculo) => vehiculo.id == idFila);
            vaciarElemento(formDatos);
            vistaData.style.display = "none";
            crearFormUpdate(formDatos,obj);
        });
    })
}

export function vaciarElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function crearCheckboxs(){

    let LS_vehiculos = localStorage.getObj("vehiculos");
    let auxProps = Object.getOwnPropertyNames(LS_vehiculos[0]);
    let checks = [];
    auxProps.forEach((p) => {
        let chbox = document.createElement("input");
        let lbchbox = document.createElement("label");

        chbox.type = "checkbox";
        chbox.name = p;
        chbox.id = p;
        
        lbchbox.innerHTML = p;


        chbox.addEventListener("checked", (e) => {
            console.log(e.checked);
        })

        complementosTabla.appendChild(chbox);
        complementosTabla.appendChild(lbchbox);
    });
}

