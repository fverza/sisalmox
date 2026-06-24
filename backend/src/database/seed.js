const { sequelize, OPM, Secao, Usuario, Material, Patrimonio, Natureza } = require('../models');

async function seed() {
  try {
    console.log('Sincronizando banco de dados (force: true)...');
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado.');

    console.log('Criando Naturezas de Despesa...');
    const natConsumo = await Natureza.create({
      codigo: '339030',
      descricao: 'Material de Consumo'
    });

    const natPermanente = await Natureza.create({
      codigo: '449052',
      descricao: 'Equipamentos e Material Permanente'
    });

    console.log('Criando OPMs de referência...');
    const cpi5 = await OPM.create({
      codigo: '180000000',
      descricao: 'CPI-5 (Comando de Policiamento do Interior 5)',
      email: 'cpi5@policiamilitar.sp.gov.br'
    });

    const bpm17 = await OPM.create({
      codigo: '182000000',
      descricao: '17º BPM/I (17º Batalhão de Polícia Militar do Interior)',
      email: '17bpmi@policiamilitar.sp.gov.br',
      opm_pai_id: cpi5.id
    });

    const bpm52 = await OPM.create({
      codigo: '185000000',
      descricao: '52º BPM/I (52º Batalhão de Polícia Militar do Interior)',
      email: '52bpmi@policiamilitar.sp.gov.br',
      opm_pai_id: cpi5.id
    });

    console.log('Criando Seções...');
    const secArmamento = await Secao.create({
      nome: 'Armamento e Tiro (Material Bélico)',
      controla_estoque: true
    });

    const secTelematic = await Secao.create({
      nome: 'Telemática (TI e Informática)',
      controla_estoque: true
    });

    const secTelecom = await Secao.create({
      nome: 'Telecomunicações (Rádios e Antenas)',
      controla_estoque: true
    });

    const secAlmoxarifado = await Secao.create({
      nome: 'Almoxarifado Central (Consumíveis/Diversos)',
      controla_estoque: true
    });

    console.log('Criando usuários padrão...');
    await Usuario.create({
      nome: 'Capitão PM Administrador',
      re: '123456-7',
      login: 'admin',
      senha: 'admin123',
      opm_id: bpm17.id,
      secao_id: secAlmoxarifado.id,
      papel: 'admin'
    });

    await Usuario.create({
      nome: 'Sargento PM Operador',
      re: '987654-3',
      login: 'operador',
      senha: 'operador123',
      opm_id: bpm17.id,
      secao_id: secArmamento.id,
      papel: 'operador'
    });

    await Usuario.create({
      nome: 'Cabo PM Consulta',
      re: '111222-3',
      login: 'consulta',
      senha: 'consulta123',
      opm_id: bpm52.id,
      secao_id: secTelecom.id,
      papel: 'consulta'
    });

    console.log('Criando materiais de teste...');
    await Material.create({
      codigo_siafisico: '1234567',
      descricao: 'Pistola Glock G22 Gen5 .40 S&W',
      unidade_medida: 'UN'
    });

    await Material.create({
      codigo_siafisico: '7654321',
      descricao: 'Colete Balístico IIIA Masculino M',
      unidade_medida: 'UN'
    });

    await Material.create({
      codigo_siafisico: '9988771',
      descricao: 'Rádio Transceptor Portátil APX8000',
      unidade_medida: 'UN'
    });

    console.log('Criando patrimônios de teste...');
    await Patrimonio.create({
      numero_patrimonio: 'PMESP-551001',
      numero_serie: 'ADX9921',
      grupo: 'ARM',
      descricao: 'Pistola Glock G22 Gen5, calibre .40 S&W, com 3 carregadores',
      marca: 'Glock',
      modelo: 'G22 Gen5',
      valor_compra: 2500.00,
      re_detentor: '123456-7',
      opm_atual_id: bpm17.id,
      secao_atual_id: secArmamento.id
    });

    console.log('Banco de dados semeado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar o seed:', error);
    process.exit(1);
  }
}

seed();
