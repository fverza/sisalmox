const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const EntradaItem = sequelize.define('EntradaItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  entrada_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'entradas',
      key: 'id'
    }
  },
  material_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materiais',
      key: 'id'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  valor_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  natureza_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'naturezas',
      key: 'id'
    }
  }
}, {
  tableName: 'entradas_itens',
  timestamps: true,
  underscored: true
});

module.exports = EntradaItem;
