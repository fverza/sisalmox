const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const EstoqueSaldo = sequelize.define('EstoqueSaldo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  material_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materiais',
      key: 'id'
    }
  },
  natureza_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'naturezas',
      key: 'id'
    }
  },
  opm_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'opms',
      key: 'id'
    }
  },
  anomes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Ano e Mês do saldo, formato AAAAMM, ex: 202606'
  },
  valor_medio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Custo médio unitário do estoque naquele mês'
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Quantidade física atual do estoque'
  }
}, {
  tableName: 'valormediomensal', // Usamos o mesmo nome da tabela legada
  timestamps: true,
  underscored: true
});

module.exports = EstoqueSaldo;
