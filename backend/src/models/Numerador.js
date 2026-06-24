const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Numerador = sequelize.define('Numerador', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo_documento: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ex: FMM, MSG'
  },
  opm_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'opms',
      key: 'id'
    }
  },
  ultimo_numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'numeradores',
  timestamps: true,
  underscored: true
});

module.exports = Numerador;
