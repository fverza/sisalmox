const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const OPM = sequelize.define('OPM', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Código hierárquico da OPM, ex: 182000000'
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nome da OPM, ex: 17º BPM/I'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  opm_pai_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'opms',
      key: 'id'
    }
  }
}, {
  tableName: 'opms',
  timestamps: true,
  underscored: true
});

module.exports = OPM;
