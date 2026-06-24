const sequelize = require('../database/connection');
const OPM = require('./OPM');
const Secao = require('./Secao');
const Usuario = require('./Usuario');
const Material = require('./Material');
const Patrimonio = require('./Patrimonio');
const Numerador = require('./Numerador');

// 1. OPM Self-association (Parent-Child relationship)
OPM.belongsTo(OPM, { as: 'OpmPai', foreignKey: 'opm_pai_id' });
OPM.hasMany(OPM, { as: 'SubOpms', foreignKey: 'opm_pai_id' });

// 2. Usuario Associations
Usuario.belongsTo(OPM, { foreignKey: 'opm_id', as: 'Opm' });
Usuario.belongsTo(Secao, { foreignKey: 'secao_id', as: 'Secao' });
OPM.hasMany(Usuario, { foreignKey: 'opm_id', as: 'Usuarios' });
Secao.hasMany(Usuario, { foreignKey: 'secao_id', as: 'Usuarios' });

// 3. Patrimonio Associations
Patrimonio.belongsTo(OPM, { foreignKey: 'opm_atual_id', as: 'OpmAtual' });
Patrimonio.belongsTo(Secao, { foreignKey: 'secao_atual_id', as: 'SecaoAtual' });
OPM.hasMany(Patrimonio, { foreignKey: 'opm_atual_id', as: 'Patrimonios' });
Secao.hasMany(Patrimonio, { foreignKey: 'secao_atual_id', as: 'Patrimonios' });

// 4. Numerador Associations
Numerador.belongsTo(OPM, { foreignKey: 'opm_id', as: 'Opm' });
OPM.hasMany(Numerador, { foreignKey: 'opm_id', as: 'Numeradores' });

module.exports = {
  sequelize,
  OPM,
  Secao,
  Usuario,
  Material,
  Patrimonio,
  Numerador
};
