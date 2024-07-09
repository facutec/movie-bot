// utils/obtenerMapaCine.js
class MapaCine {
    constructor(urlDireccion) {
      this.urlDireccion = urlDireccion;
    }
  
    obtenerUrlMapa() {
      return this.urlDireccion;
    }
  }
  
  module.exports = MapaCine;
  