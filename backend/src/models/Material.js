const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  codigo_siafisico: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Código do catálogo estadual SIAFÍSICO'
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unidade_medida: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'UN'
  }
}, {
  tableName: 'materiais',
  timestamps: true,
  underscored: true
});

module.exports = Material;
