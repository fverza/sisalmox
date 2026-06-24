const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Secao = sequelize.define('Secao', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ex: Armamento, Telemática, Telecom, Almoxarifado'
  },
  controla_estoque: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Indica se a seção realiza controle físico de estoque'
  }
}, {
  tableName: 'secoes',
  timestamps: true,
  underscored: true
});

module.exports = Secao;
