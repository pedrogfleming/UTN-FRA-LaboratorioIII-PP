export class Vehiculo {
    constructor(id, modelo, velMax, anoFab) {
        this.id = id;
        this.modelo = modelo;
        this.velMax = velMax;
        this.anoFab = anoFab;
    }
    toString() {
        return `${this.id} ${this.modelo} ${this.velMax} ${this.modelo} ${this.anoFab}`;
    }
    toJson() {
        return JSON.stringify(this);
    }
}
export class Aereo extends Vehiculo {
    constructor(id, modelo, velMax, anoFab, altMax, autonomia) {
        super(id, modelo, velMax, anoFab);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }
}

export class Terrestre extends Vehiculo {
    constructor(id, modelo, velMax, anoFab, cantPue, cantRue) {
        super(id, modelo, velMax, anoFab);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }
}

export function toObjs(jsonArray) {
    let vehiculos = jsonArray.map((item) => {
        if (item.hasOwnProperty("autonomia") && item.hasOwnProperty("altMax")) {
            return new Aereo(item.id, item.modelo, item.velMax, item.anoFab, item.altMax, item.autonomia);
        } else if (item.hasOwnProperty("cantPue") && item.hasOwnProperty("cantRue")) {
            return new Terrestre(item.id, item.modelo, item.velMax, item.anoFab, item.cantPue, item.cantRue);
        } else {
            return new Vehiculo(item.id, item.modelo, item.velMax, item.anoFab);
        }
    });
    return vehiculos;
}

function Ordenar(arr, criterio) {
    arr.sort((a, b) => a[criterio] > b[criterio]);
}