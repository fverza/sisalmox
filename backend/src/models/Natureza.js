const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Natureza = sequelize.define('Natureza', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Código da natureza de despesa, ex: 339030 (Consumo) ou 449052 (Permanente)'
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Descrição da natureza, ex: Material de Consumo'
  }
}, {
  tableName: 'naturezas',
  timestamps: true,
  underscored: true
});

module.exports = Natureza;
