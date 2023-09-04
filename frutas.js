const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { leerFrutas,guardarFrutas,  obtenerFrutaFind } = require('./src/frutas.manager')
const PORT = process.env.PORT || 3008;

let DB = [];


// Endpoint para la ruta raíz
app.get('/', (req, res) => {
    const welcomeMessage = '<h1>Bienvenido a MERCADO DE FRUTAS</h1>';
    res.send(welcomeMessage);
  });
  
//MIDDLEWARE 

dotenv.config();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    DB = leerFrutas();
    next();
})

// SERVIDOR WEB
// metodo get generico
app.get('/', (req,res)=>{
    res.send(DB)
})
// metodo get especifico
app.get('/:id',(req,res)=>{
    console.log("VALOR RECIBIDO:", req.params.id)
    console.log(typeof req.params.id)
    const id = parseInt(req.params.id)
    const fruta = obtenerFrutaFind(id)
    res.send(fruta);
})
// metodo post
app.post('/',(req,res)=>{
    const nuevaFruta = req.body;
    DB.push(nuevaFruta);
    guardarFrutas(DB)
    res.status(201).send("Fruta agregada!")
})
// metodfrutaDesactualiazda, fruta,o put
app.put('/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    const fruta = req.body;
    let frutaDesactualiazda = DB.find(fruta => fruta.id === id)
    if (frutaDesactualiazda) {
        DB[id-1] = fruta
        guardarFrutas(DB)
        res.status(200).send('Fruta actualizada!');
    } else {
        res.status(404).json({error: `Error en el índice`,
    descripcion: `No se pudo encontrar un producto con el valor indicado como índice: ${id}`})
    }
    //actualizarFruta(id,fruta);
})
// metodo delete
app.delete('/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    DB.splice(id - 1, 1);
    guardarFrutas(DB)
    res.status(200).send('Fruta eliminada!');
})

app.get('*', (req, res) => {
    res.status(404).send('Lo siento, la página que buscas no existe.'); 
});

// @ts-nocheck
const fs = require('fs');
/**
* My method description.  Like other pieces of your comment blocks, 
* this can span multiple lines.
*
* @method leerFrutas
* @return {frutas[]}
*/
// esta funcion me lee mis datos del frutas.json devuelve en un objeto del tipo json para usar 
function leerFrutas(){
    const datos = fs.readFileSync(__dirname + process.env.DATABASE_PATH, 'utf8' )
    const FRUTAS = JSON.parse(datos)
    return FRUTAS
}
/**
* My method description.  Like other pieces of your comment blocks, 
* this can span multiple lines.
*
// esta funcion escribe mi archivo frutas.json
* @method guardarFrutas
* @param {Object} frutas A frutas object
* @param {Number} frutas.id
* @param {String} frutas.nombre The name on the config object
* @param {Number} frutas.importe
* @param {Number} frutas.stock The name on the config object
*/
function guardarFrutas(frutas){
    const datos = JSON.stringify(frutas);
    fs.writeFileSync(__dirname + process.env.DATABASE_PATH ,datos)
}

// esta funcion me busca una fruta segun su id
function obtenerFrutaFind(id){
    const datos = fs.readFileSync(__dirname + process.env.DATABASE_PATH, 'utf8');
    const frutas = JSON.parse(datos);
    const fruta = frutas.find(f => f.id === id) || [{error: `Error en el índice`,
    descripcion: `No se pudo encontrar un producto con el valor indicado como índice: ${id}`}]
    return fruta
}

// function obtenerFrutaFilter(id){
//     DB = leerFrutas()
//     const fruta = DB.filter(f => f.id === id) 
//     if (fruta === []) {
//        return [{error: `Error en el índice`,
//     descripcion: `No se pudo encontrar un producto con el valor indicado como índice: ${id}`}]
//     }
//     return fruta
// }


// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});