const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const SaidaItem = sequelize.define('SaidaItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  saida_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'saidas',
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
    defaultValue: 0.00,
    comment: 'Custo médio do item no momento da saída'
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
  tableName: 'saidas_itens',
  timestamps: true,
  underscored: true
});

module.exports = SaidaItem;
