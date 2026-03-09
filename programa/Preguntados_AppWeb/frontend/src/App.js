// useState permite crear y manejar variables de estado dentro del componente.
import { useState } from "react"

// Componente principal de la aplicación
function App() {

  const [pantalla, setPantalla] = useState("inicio")

  const [nombre, setNombre] = useState("")

  const [preguntas, setPreguntas] = useState([])

  const [indice, setIndice] = useState(0)

  const [aciertos, setAciertos] = useState(0)

  const [respuesta, setRespuesta] = useState("")

  const [historial, setHistorial] = useState([])

  const [estado, setEstado] = useState("")



  // ===============================
  // FUNCION PARA INICIAR PARTIDA
  // ===============================
  const iniciarCuestionario = () => {

    fetch("http://localhost:3001/preguntas")

      .then(res => res.json())

      .then(data => {

        setPreguntas(data)

        setIndice(0)

        setAciertos(0)

        setPantalla("juego")

      })

  }



  // ===============================
  // FUNCION PARA VALIDAR RESPUESTA
  // ===============================
  const siguientePregunta = () => {

    const preguntaActual = preguntas[indice]

    if (respuesta === preguntaActual.correcta) {

      setAciertos(aciertos + 1)
    }

    setRespuesta("")

    if (respuesta === "") {

      alert("Seleccione una respuesta")
      return
    }

    if (indice + 1 < preguntas.length) {

      setIndice(indice + 1)

    } else {

      terminarJuego()

    }

  }



  // ===============================
  // FUNCION PARA TERMINAR PARTIDA
  // ===============================
  const terminarJuego = () => {

    let estadoJuego = "Perdio"

    if (aciertos >= 6) {
      estadoJuego = "Gano"
    }

    setEstado(estadoJuego)

    fetch("http://localhost:3001/guardarResultado", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        nombre: nombre,

        aciertos: aciertos

      })

    })

    setPantalla("resultado")

  }



  // ===============================
  // FUNCION PARA CARGAR HISTORIAL
  // ===============================
  const cargarHistorial = () => {

    fetch("http://localhost:3001/historial")

      .then(res => res.json())

      .then(data => {

        setHistorial(data)

        setPantalla("historial")

      })

  }



  // ===============================
  // PANTALLA DE INICIO
  // ===============================
  if (pantalla === "inicio") {

    return (

      <div className="contenedor">

        {/* Título principal */}
        <h1>Preguntas de cultura general</h1>

        {/* Solicita nombre del jugador */}
        <h2>Nombre del jugador</h2>

        {/* Campo de texto para ingresar el nombre */}
        <input
          value={nombre}

          // Cada vez que el usuario escribe se actualiza el estado nombre
          onChange={(e) => setNombre(e.target.value)}
        />

        <br />

        {/* Botón que inicia el cuestionario */}
        <button onClick={iniciarCuestionario}>
          Iniciar cuestionario
        </button>

        {/* Botón para ver historial */}
        <button onClick={cargarHistorial}>
          Historial
        </button>

      </div>

    )

  }


  // ===============================
  // PANTALLA DE JUEGO
  // ===============================
  if (pantalla === "juego") {

    const preguntaActual = preguntas[indice]

    return (

      <div className="contenedor">

        {/* Muestra el nombre del jugador */}
        <h2>Jugador: {nombre}</h2>

        {/* Muestra la pregunta */}
        <h3>{preguntaActual.pregunta}</h3>

        {/* Lista desplegable con las opciones */}
        <select

          // Guarda la opción seleccionada
          value={respuesta}

          // Actualiza el estado respuesta
          onChange={(e) => setRespuesta(e.target.value)}
        >

          {/* Opción por defecto */}
          <option value="">Seleccione una respuesta</option>

          {/* Recorre las opciones de la pregunta */}
          {preguntaActual.opciones.map((opcion, i) => (

            <option key={i} value={opcion}>
              {opcion}
            </option>

          ))}

        </select>

        <br /><br />

        {/* Botón para avanzar a la siguiente pregunta */}
        <button className="verde" onClick={siguientePregunta}>
          Siguiente
        </button>

        {/* Botón para salir del juego */}
        <button className="rojo" onClick={() => setPantalla("inicio")}>
          Salir
        </button>

        {/* Indicador de progreso */}
        <p>Pregunta {indice + 1} de 10</p>

      </div>

    )

  }



  // ===============================
  // PANTALLA RESULTADO FINAL
  // ===============================
  if (pantalla === "resultado") {

    return (

      <div className="contenedor">

        {/* Título */}
        <h2>Resultado de la partida</h2>

        {/* Información del jugador */}
        <p>Jugador: {nombre}</p>

        {/* Cantidad de aciertos */}
        <p>Aciertos: {aciertos}</p>

        {/* Estado final */}
        <p>Estado: {estado}</p>

        {/* Botón para volver al inicio */}
        <button onClick={() => setPantalla("inicio")}>
          Volver al inicio
        </button>

      </div>

    )

  }



  // ===============================
  // PANTALLA HISTORIAL
  // ===============================
  if (pantalla === "historial") {

    return (

      <div className="contenedor">

        {/* Título */}
        <h2>Historial de partidas</h2>

        {/* Recorre todas las partidas del historial */}
        {historial.map((p, i) => (

          <p className="historial-item" key={i}>

            {/* Muestra datos de cada partida */}
            {p.nombre} - {p.aciertos} aciertos - {p.estado}

          </p>

        ))}

        {/* Botón para regresar al inicio */}
        <button onClick={() => setPantalla("inicio")}>
          Volver
        </button>

      </div>

    )

  }

}

// Exporta el componente para que React pueda usarlo
export default App