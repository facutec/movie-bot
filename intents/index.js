/* Exports de INTENTS*/

const handleCarteleraIntent = require('./handleCarteleraIntent');
const handleHorarioIntent = require('./handleHorarioIntent');
const handleReservaIntent = require('./handleReservaIntent');
const handleHelpIntent = require('./handleHelpIntent');
const handleDespedidaIntent = require('./handleDespedidaIntent');
const handlePrecioCommand = require('./handlePrecioCommand');
const handlePromocionesIntent = require('./handlePromos');
const handleReservasActivas = require('./handleReservasActivas');
const handleBuscarHorarios = require('./handleBuscarHorarios');
const {handleMoreActions, handleReservaActions, handleSalirButton} = require('./handleMoreAction');

module.exports = {
  handleCarteleraIntent,
  handleHorarioIntent,
  handleReservaIntent,
  handleHelpIntent,
  handleDespedidaIntent,
  handlePrecioCommand,
  handlePromocionesIntent,
  handleReservasActivas,
  handleBuscarHorarios,
  handleMoreActions,
  handleReservaActions,
  handleSalirButton
};
