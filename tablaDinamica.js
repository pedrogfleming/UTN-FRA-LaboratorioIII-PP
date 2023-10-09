function crearCabecera(propiedades) {
    const cabecera = document.createElement("thead");
    let tr = document.createElement("tr");
    propiedades.forEach((p) => {
        if (p === "id") {
            return;
        }
        const th = document.createElement("th");
        th.textContent = p; //agarro el nombre de las propiedades del objeto y se los asigno
        th.id = p;
        th.addEventListener('click', () => {
            const eventRefrescar = new CustomEvent('ordenarTabla', { detail: th.id });
            document.dispatchEvent(eventRefrescar);
        });
        tr.appendChild(th);
    })
    tr.classList.add("cabecera");
    cabecera.appendChild(tr);
    return cabecera;
}

function crearCuerpo(data, cabecera) {
    const cuerpo = document.createElement("tbody");

    data.forEach(obj => {
        const fila = document.createElement("tr");

        cabecera.forEach(c => {
            const celda = document.createElement("td");
            if (c === "id") {
                fila.setAttribute("id", obj[c]);
            } else {
                celda.textContent = obj[c];
                celda.id = c;
                fila.appendChild(celda);
            }
        });

        cuerpo.appendChild(fila);
    });

    return cuerpo;
}



export function crearTabla(cabecera, data) {
    if (!Array.isArray(data)) {
        return null;
    }

    const tabla = document.createElement("table");
    tabla.setAttribute('id', 'tabla');
    tabla.appendChild(crearCabecera(cabecera));
    tabla.appendChild(crearCuerpo(data, cabecera));

    return tabla;
}