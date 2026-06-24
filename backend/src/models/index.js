const sequelize = require('../database/connection');
const OPM = require('./OPM');
const Secao = require('./Secao');
const Usuario = require('./Usuario');
const Material = require('./Material');
const Patrimonio = require('./Patrimonio');
const Numerador = require('./Numerador');
const Natureza = require('./Natureza');
const Entrada = require('./Entrada');
const EntradaItem = require('./EntradaItem');
const Saida = require('./Saida');
const SaidaItem = require('./SaidaItem');
const EstoqueSaldo = require('./EstoqueSaldo');

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

// 5. Entrada & EntradaItem Associations
Entrada.belongsTo(OPM, { foreignKey: 'opm_id', as: 'Opm' });
Entrada.belongsTo(Secao, { foreignKey: 'secao_id', as: 'Secao' });
Entrada.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });
OPM.hasMany(Entrada, { foreignKey: 'opm_id', as: 'Entradas' });
Secao.hasMany(Entrada, { foreignKey: 'secao_id', as: 'Entradas' });

Entrada.hasMany(EntradaItem, { foreignKey: 'entrada_id', as: 'Itens', onDelete: 'CASCADE' });
EntradaItem.belongsTo(Entrada, { foreignKey: 'entrada_id', as: 'Entrada' });
EntradaItem.belongsTo(Material, { foreignKey: 'material_id', as: 'Material' });
EntradaItem.belongsTo(Natureza, { foreignKey: 'natureza_id', as: 'Natureza' });

// 6. Saida & SaidaItem Associations
Saida.belongsTo(OPM, { foreignKey: 'opm_origem_id', as: 'OpmOrigem' });
Saida.belongsTo(Secao, { foreignKey: 'secao_origem_id', as: 'SecaoOrigem' });
Saida.belongsTo(OPM, { foreignKey: 'opm_destino_id', as: 'OpmDestino' });
Saida.belongsTo(Secao, { foreignKey: 'secao_destino_id', as: 'SecaoDestino' });
Saida.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });

Saida.hasMany(SaidaItem, { foreignKey: 'saida_id', as: 'Itens', onDelete: 'CASCADE' });
SaidaItem.belongsTo(Saida, { foreignKey: 'saida_id', as: 'Saida' });
SaidaItem.belongsTo(Material, { foreignKey: 'material_id', as: 'Material' });
SaidaItem.belongsTo(Natureza, { foreignKey: 'natureza_id', as: 'Natureza' });

// 7. EstoqueSaldo (valormediomensal) Associations
EstoqueSaldo.belongsTo(Material, { foreignKey: 'material_id', as: 'Material' });
EstoqueSaldo.belongsTo(Natureza, { foreignKey: 'natureza_id', as: 'Natureza' });
EstoqueSaldo.belongsTo(OPM, { foreignKey: 'opm_id', as: 'Opm' });
Material.hasMany(EstoqueSaldo, { foreignKey: 'material_id', as: 'Saldos' });
Natureza.hasMany(EstoqueSaldo, { foreignKey: 'natureza_id', as: 'Saldos' });
OPM.hasMany(EstoqueSaldo, { foreignKey: 'opm_id', as: 'Saldos' });

module.exports = {
  sequelize,
  OPM,
  Secao,
  Usuario,
  Material,
  Patrimonio,
  Numerador,
  Natureza,
  Entrada,
  EntradaItem,
  Saida,
  SaidaItem,
  EstoqueSaldo
};
