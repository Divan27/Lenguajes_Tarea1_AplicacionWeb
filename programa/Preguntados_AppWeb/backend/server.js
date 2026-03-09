// importar librerias necesarias
const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()

app.use(cors())

app.use(express.json())

const puerto = 3001



// obtener preguntas para el juego
app.get("/preguntas", (req, res) => {

    const archivo = fs.readFileSync("preguntas.json")

    const datos = JSON.parse(archivo)

    const todas = datos.preguntas

    const mezcladas = todas.sort(() => Math.random() - 0.5)

    const seleccion = mezcladas.slice(0, 10)

    res.json(seleccion)

})



// guardar resultado de una partida
app.post("/guardarResultado", (req, res) => {

    const nombre = req.body.nombre
    const aciertos = req.body.aciertos

    let estado = "Perdio"

    if (aciertos >= 6) {
        estado = "Gano"
    }

    const archivo = fs.readFileSync("resultados.json")

    const datos = JSON.parse(archivo)

    datos.resultados.push({
        nombre: nombre,
        aciertos: aciertos,
        estado: estado
    })

    fs.writeFileSync("resultados.json", JSON.stringify(datos, null, 2))

    res.json({ mensaje: "Resultado guardado" })

})



// obtener historial de partidas
app.get("/historial", (req, res) => {

    const archivo = fs.readFileSync("resultados.json")

    const datos = JSON.parse(archivo)

    res.json(datos.resultados)

})



// iniciar servidor
app.listen(puerto, () => {

    console.log("Ejecutando en puerto " + puerto)

})