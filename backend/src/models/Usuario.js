const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  re: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Registro Estatístico do Policial Militar'
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  opm_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'opms',
      key: 'id'
    }
  },
  secao_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'secoes',
      key: 'id'
    }
  },
  papel: {
    type: DataTypes.ENUM('admin', 'operador', 'consulta'),
    allowNull: false,
    defaultValue: 'consulta'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeSave: async (usuario) => {
      if (usuario.changed('senha')) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    }
  }
});

Usuario.prototype.verificarSenha = async function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = Usuario;
