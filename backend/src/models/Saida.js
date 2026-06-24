const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Saida = sequelize.define('Saida', {
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
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ex: Consumo, Transferência, Baixa'
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número sequencial do recibo gerado por ano'
  },
  numrec: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Número legível de recibo, ex: CPI5-0015/Secao/26'
  },
  opm_origem_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'opms',
      key: 'id'
    }
  },
  secao_origem_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'secoes',
      key: 'id'
    }
  },
  opm_destino_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'opms',
      key: 'id'
    }
  },
  secao_destino_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'secoes',
      key: 'id'
    }
  },
  re_recebedor: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'RE do policial militar que recebeu o material'
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
  tableName: 'saidas',
  timestamps: true,
  underscored: true
});

module.exports = Saida;
