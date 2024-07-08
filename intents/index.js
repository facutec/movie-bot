/* Exports de INTENTS*/

const handleCarteleraIntent = require('./handleCarteleraIntent');
const handleHorarioIntent = require('./handleHorarioIntent');
const handleReservaIntent = require('./handleReservaIntent');
const handleHelpIntent = require('./handleHelpIntent');
const handleDespedidaIntent = require('./handleDespedidaIntent');
const handlePrecioCommand = require('./handlePrecioCommand');

module.exports = {
  handleCarteleraIntent,
  handleHorarioIntent,
  handleReservaIntent,
  handleHelpIntent,
  handleDespedidaIntent,
  handlePrecioCommand
};
