const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Entrada = sequelize.define('Entrada', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ex: NF (Nota Fiscal), TR (Transferência), DO (Doação)'
  },
  origem: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Fornecedor ou OPM de origem'
  },
  nota: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Número do documento fiscal / nota'
  },
  ne: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Nota de Empenho'
  },
  opm_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'opms',
      key: 'id'
    }
  },
  secao_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'secoes',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'entradas',
  timestamps: true,
  underscored: true
});

module.exports = Entrada;
