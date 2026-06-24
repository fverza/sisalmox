const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Patrimonio = sequelize.define('Patrimonio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numero_patrimonio: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Tombo / Número de patrimônio estadual'
  },
  numero_serie: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Número de série do fabricante'
  },
  grupo: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Grupo de material, ex: ARM (Armamento), TEL (Telecom), INF (Informática), DIV (Diversos)'
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  valor_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  re_detentor: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'RE do PM com a carga individual'
  },
  opm_atual_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'opms',
      key: 'id'
    }
  },
  secao_atual_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'secoes',
      key: 'id'
    }
  }
}, {
  tableName: 'patrimonios',
  timestamps: true,
  underscored: true
});

module.exports = Patrimonio;
