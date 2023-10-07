import { Vehiculo, Aereo, Terrestre, toObjs } from "./vehiculo.js"
import Arr_Update from "./arrayHelpers.js"

function agregarCampos(innerText, value, soloLectura) {
    const nuevoLabel = document.createElement('label');
    const nuevoInput = document.createElement("input");
    nuevoLabel.innerText = innerText;
    nuevoLabel.id = innerText;
    nuevoInput.value = value;
    nuevoInput.readOnly = soloLectura;
    nuevoInput.id = innerText;
    return { nuevoLabel, nuevoInput };
}

function removerCampos(){
    const formulario = document.getElementById("formDatos"); 
    const elementosAEliminar = ["cantPue", "cantRue", "altMax", "autonomia"];

    // Filtra los hijos del formulario que no deben ser eliminados
    const hijosFiltrados = Array.from(formulario.children).filter((hijo) => {
        return !elementosAEliminar.includes(hijo.id);
    });

    // Reemplaza los hijos del formulario con los hijos filtrados
    while (formulario.firstChild) {
        formulario.removeChild(formulario.firstChild);
    }

    hijosFiltrados.forEach((hijo) => {
        formulario.appendChild(hijo);
    });
}

export function crearFormUpdate(formulario, obj) {
    formulario.innerText = "Formulario Modificacion";
    let elementos = [];
    let opciones = ["Terrestre", "Aereo"];
    const selectorTipo = document.createElement("select");
    selectorTipo.disabled = true;

    for (var i = 0; i < opciones.length; i++) {
        var option = document.createElement("option");
        option.value = opciones[i];
        option.text = opciones[i];        
        selectorTipo.appendChild(option);
    }
    if(obj instanceof Terrestre) selectorTipo.selectedIndex = 0;
    else if(obj instanceof Aereo) selectorTipo.selectedIndex = 1;
    
    elementos.push(selectorTipo);
    if (obj === null) {
        obj = new Vehiculo("", "", "", "");
    }

    const props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if(p == "id"){
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonGuardar = document.createElement('button');
    botonGuardar.innerText = "Guardar";
    elementos.push(botonGuardar);

    const botonEliminar = document.createElement('button');
    botonEliminar.innerText = "Eliminar";
    elementos.push(botonEliminar);

    botonEliminar.addEventListener('click', () =>{
        let LS_Vehiculos = toObjs(localStorage.getObj("vehiculos"));

        LS_Vehiculos = LS_Vehiculos.filter((elemento) => elemento.id !== obj.id);

        localStorage.removeItem("vehiculos");
        localStorage.setObj("vehiculos", LS_Vehiculos);

        const eventRefrescar = new CustomEvent('refrescarTablaVehiculos', { detail: LS_Vehiculos });
        document.dispatchEvent(eventRefrescar);
    })


    botonGuardar.addEventListener('click', () => {
        let inputs = [];
        props.forEach(p => {
            let input = document.getElementById(p);
            inputs[p] = input.value;
        });

        let objModificado = null;

        if(!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        if (obj instanceof Terrestre) {
            objModificado = new Terrestre(obj.id, inputs["modelo"], inputs["velMax"], inputs["anoFab"], inputs["cantPue"], inputs["cantRue"]);
        }
        else if (obj instanceof Aereo) {
            objModificado = new Aereo(obj.id, inputs["modelo"], inputs["velMax"], inputs["anoFab"], inputs["altMax"], inputs["autonomia"]);
        }
        if (objModificado) {
            let LS_Vehiculos = toObjs(localStorage.getObj("vehiculos"));
            Arr_Update(LS_Vehiculos, obj, objModificado);
            localStorage.removeItem("vehiculos");
            localStorage.setObj("vehiculos", LS_Vehiculos);

            const event = new CustomEvent('refrescarTablaVehiculos', { detail: LS_Vehiculos });
            document.dispatchEvent(event);
        }
    });

    elementos.forEach((e) => formulario.appendChild(e));
}

export function crearFormAlta(formulario){
    formulario.innerText = "Formulario Alta";
    let obj = new Vehiculo("", "", "", "");
    let elementos = [];
    let opciones = ["Terrestre", "Aereo"];
    const selectorTipo = document.createElement("select");    

    for (var i = 0; i < opciones.length; i++) {
        var option = document.createElement("option");
        option.value = opciones[i];
        option.text = opciones[i];        
        selectorTipo.appendChild(option);


        
        elementos.push(selectorTipo);
    }
    selectorTipo.addEventListener("change", (event) => {
        botonGuardar.disabled = false;
        let nuevosFormFields = [];

        
        const elementosAEliminar = ["cantPue", "cantRue", "altMax", "autonomia"];
        removerCampos(elementosAEliminar);

        if(selectorTipo.selectedOptions[0].value == "Terrestre"){                
            if(!formulario["cantPue"]){
                let ret = agregarCampos("cantPue","",false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            if(!formulario["cantRue"]){
                let ret = agregarCampos("cantRue","",false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
        }
        else if(selectorTipo.selectedOptions[0].value == "Aereo"){
            if(!formulario["altMax"]){
                let ret = agregarCampos("altMax","",false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            if(!formulario["autonomia"]){
                let ret = agregarCampos("autonomia","",false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
        }
        nuevosFormFields.forEach((e) => formulario.appendChild(e));


        // for (let i = 0; i < formulario.length; i++) {
        //     const elemento = formulario[i];
        //     if (elemento.id) {
        //         console.log("ID del elemento:", elemento.id);
        //     }
        // }
    })

    const props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if(p == "id"){
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonGuardar = document.createElement('button');
    botonGuardar.innerText = "Guardar";
    botonGuardar.disabled = true;
    elementos.push(botonGuardar);

    botonGuardar.addEventListener('click', () => {
        let inputs = [];
        props.forEach(p => {
            let input = document.getElementById(p);
            inputs[p] = input.value;
        });
        if(!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        let nuevoId = localStorage.getObj('nextId') || 20000;
        if(selectorTipo.selectedIndex == 0){
            obj = new Terrestre(nuevoId, inputs["modelo"], inputs["velMax"], inputs["anoFab"], inputs["cantPue"], inputs["cantRue"]);
        }
        else if(selectorTipo.selectedIndex == 1){
            obj = new Aereo(nuevoId, inputs["modelo"], inputs["velMax"], inputs["anoFab"], inputs["altMax"], inputs["autonomia"]);
        }
        if (obj) {
            let LS_Vehiculos = toObjs(localStorage.getObj("vehiculos"));
            LS_Vehiculos.push(obj);
            localStorage.removeItem("vehiculos");
            localStorage.setObj("vehiculos", LS_Vehiculos);
            let siguienteId = obj.id;
            siguienteId++;
            localStorage.setItem('nextId', siguienteId);

            const event = new CustomEvent('refrescarTablaVehiculos', { detail: LS_Vehiculos });
            document.dispatchEvent(event);
        }
    });

    elementos.forEach((e) => formulario.appendChild(e));
}

function validarInputs(inputs, objType){
    let datosInvalidos = []
    datosInvalidos["modelo"] = inputs["modelo"] !== undefined && '';
    datosInvalidos["velMax"] = inputs["velMax"] > 0;
    datosInvalidos["anoFab"] = inputs["anoFab"] > 1885;
    if(objType === "Terrestre"){
        datosInvalidos["cantPue"] = inputs["cantPue"] > -1;
        datosInvalidos["cantRue"] = inputs["cantRue"] > 0;
    }
    else if(objType === "Aereo"){
        datosInvalidos["altMax"] = inputs["altMax"] > 0;
        datosInvalidos["autonomia"] = inputs["autonomia"] > 0;
    }
    return !Object.values(datosInvalidos).some(value => value === false);
}