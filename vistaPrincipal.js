import { crearTabla } from "./tablaDinamica.js";
import { crearFormUpdate, crearFormAlta, crearSelector } from "./formHelper.js";
import { toObjs } from "./vehiculo.js"
import { Arr_GetAllUniqueProps} from "./arrayHelpers.js"

let divTabla;
let formDatos;
let complementosTabla;

let vistaData = document.getElementById("dataOut");
let filtroSeleccionado = 0;

export function inicializarManejadores() {
    const LS_vehiculos = localStorage.getObj("vehiculos");
    divTabla = document.getElementById('divTabla');
    formDatos = document.getElementById('formDatos');
    
    complementosTabla = document.getElementById('complements');
    actualizarTabla(LS_vehiculos);
    const filas = document.querySelectorAll('tr');
    manejadorEventoFilas(filas);

    document.addEventListener('refrescarTablaVehiculos', (event) => {
        const LS_vehiculos = localStorage.getObj("vehiculos");
        vaciarElemento(formDatos);
        actualizarTabla(LS_vehiculos);
        const filas = document.querySelectorAll('tr');
        manejadorEventoFilas(filas);
        vistaData.style.display = "block";
    });

    document.addEventListener('ordenarTabla', (event) => {
        if (event && event.detail) {
            const LS_vehiculos = localStorage.getObj("vehiculos");
            LS_vehiculos.sort((a, b) => {
                if (a === undefined && b === undefined) return 0; // son iguales
                if (a === undefined) return -1; // a va al principio
                if (b === undefined) return 1; // b va al final
    
                if (a[event.detail] < b[event.detail]) {
                    return -1; // a debe ir antes que b
                } else if (a[event.detail] > b[event.detail]) {
                    return 1; // a debe ir después de b
                } else {
                    return 0; // son iguales
                }
            });
            actualizarTabla(LS_vehiculos);
        }
    });
}

export function actualizarTabla(vehiculos) {
    vaciarElemento(divTabla);
    vaciarElemento(complementosTabla);

    let opciones = ["Todos", "Terrestre", "Aereo"];
    const selectorTipo = crearSelector(opciones);
    selectorTipo.selectedIndex = filtroSeleccionado;
    selectorTipo.addEventListener("change", () =>{
        let LS_vehiculos = toObjs(localStorage.getObj("vehiculos"));
        if (selectorTipo.selectedOptions[0].value == "Terrestre"){
            LS_vehiculos = LS_vehiculos.filter(obj => obj.constructor.name == "Terrestre" );
            // Terrestre
            filtroSeleccionado = 1;
        }
        else if(selectorTipo.selectedOptions[0].value == "Aereo"){
            LS_vehiculos = LS_vehiculos.filter(obj => obj.constructor.name == "Aereo" );
            // Aereo
            filtroSeleccionado  = 2;
        }
        else{
            // Todos
            filtroSeleccionado  = 0;
        }
        actualizarTabla(LS_vehiculos);
        const filas = document.querySelectorAll('tr');
        manejadorEventoFilas(filas);
    });
    
    complementosTabla.appendChild(selectorTipo);
    crearCheckboxs();
    crearCalculadoraPromedio();
    let props = Arr_GetAllUniqueProps(vehiculos);

    divTabla.appendChild(crearTabla(props, vehiculos));

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
        //Evitamos asignar el evento al header
        if(fila.classList.value != "cabecera"){
            fila.addEventListener('click', () => {
                let idFila = fila.id;
                let obj = LS_vehiculos.find((vehiculo) => vehiculo.id == idFila);
                vaciarElemento(formDatos);
                vistaData.style.display = "none";
                crearFormUpdate(formDatos, obj);
            });
        }
    });
}

export function vaciarElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function crearCheckboxs() {
    let LS_vehiculos = localStorage.getObj("vehiculos");
    // let auxProps = Object.getOwnPropertyNames(LS_vehiculos[0]);
    let auxProps = Arr_GetAllUniqueProps(LS_vehiculos);
    auxProps.forEach((p) => {
        if(p === "id") return;
        let chbox = document.createElement("input");
        let lbchbox = document.createElement("label");

        chbox.type = "checkbox";
        chbox.name = p;
        chbox.id = p;
        chbox.checked = true;
        lbchbox.innerHTML = p;

        chbox.addEventListener("change", (event) => {
            // const celdas = document.getElementsByTagName('td')[p];
            const celdas = document.getElementsByTagName('td');
            const headers = document.getElementsByTagName('th');
            for (let i = 0; i < headers.length; i++) {
                if(headers[i].id === event.currentTarget.id){
                    headers[i].style.display = event.currentTarget.checked ?  "table-cell": "none";
                }
            }
            for (let i = 0; i < celdas.length; i++) {
                if(celdas[i].id === event.currentTarget.id){
                    celdas[i].style.display = event.currentTarget.checked ? "table-cell": "none";
                }
            }
        });

        complementosTabla.appendChild(chbox);
        complementosTabla.appendChild(lbchbox);
    });
}

function crearCalculadoraPromedio(){
    let elementos = [];
    const inputPromedio = document.createElement("input");
    const botonCalcular = document.createElement("button");
    const labelCalcular = document.createElement("label");

    labelCalcular.innerText = "Promedio Velocidad Maxima";
    botonCalcular.innerText = "calcular";

    botonCalcular.addEventListener("click", () =>{
        let LS_vehiculos = toObjs(localStorage.getObj("vehiculos"));
        let promedio = LS_vehiculos.reduce((acc, obj) => acc + obj.velMax, 0) / LS_vehiculos.length;
        inputPromedio.value = promedio.toFixed(2);
    });
    elementos.push(inputPromedio);
    elementos.push(botonCalcular);
    elementos.push(labelCalcular);
    elementos.forEach(e => complementosTabla.appendChild(e));
}