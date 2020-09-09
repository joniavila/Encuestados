/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntasBorradas = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.votoSumado = new Evento(this);
};

Modelo.prototype = {

  Iniciar: function(){
    var preguntas = localStorage.getItem("preguntas");
    var preguntasObjeto = JSON.parse(preguntas);
    if (preguntasObjeto !== null) this.preguntas = preguntasObjeto 
  },

  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    if(this.preguntas.length == 0){
      return 0;
    }else{
      return this.preguntas.length;
    }
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    id++;
    this.preguntas.push(nuevaPregunta);
    
    this.guardar(this.preguntas);
    this.preguntaAgregada.notificar();
  },

  //se guardan las preguntas
  guardar: function(preguntas){
    localStorage.setItem("preguntas",JSON.stringify(preguntas))
  },

  borrarPregunta: function(id){
    this.preguntas.forEach(element => {
    if(element.id == id){
        this.preguntas.splice(element,1)
        localStorage.setItem("preguntas",JSON.stringify(this.preguntas))
        this.preguntaEliminada.notificar();
      }
    }); 
  },

  borrarTodo: function(){
    this.preguntas = [];
    localStorage.clear();
    this.preguntasBorradas.notificar();

  },

  editarPregunta: function(id, pregunta){
    this.preguntas.forEach(element => {
      if(element.id == id){
         element.textoPregunta = pregunta;
         this.preguntaEditada.notificar();
        }
      }); 
  },

  agregarVoto:function(nombrePregunta,respuestaSeleccionada){
    this.preguntas.forEach(element =>{
      if(element.textoPregunta == nombrePregunta){
          element.cantidadPorRespuesta.forEach(elemento =>{
            if(elemento.textoRespuesta == respuestaSeleccionada)elemento.cantidad++
            this.votoSumado.notificar();
          })
      }
    })
    localStorage.setItem("preguntas",JSON.stringify(this.preguntas))
  }


};
