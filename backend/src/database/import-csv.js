const fs = require('fs');
const path = require('path');
const { sequelize, OPM, Secao, Material, Patrimonio } = require('../models');

const csvPath = path.join(__dirname, '../../import.csv');

async function importCsv() {
  try {
    if (!fs.existsSync(csvPath)) {
      console.error(`Erro: Arquivo CSV não encontrado em: ${csvPath}`);
      console.log('Crie um arquivo "import.csv" na pasta raiz do backend.');
      process.exit(1);
    }

    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida.');

    const fileBuffer = fs.readFileSync(csvPath);
    
    // Auto-detect encoding (UTF-8 or Windows-1252/ANSI)
    let fileContent;
    try {
      const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
      fileContent = utf8Decoder.decode(fileBuffer);
      console.log('Codificação detectada: UTF-8');
    } catch (e) {
      const winDecoder = new TextDecoder('windows-1252');
      fileContent = winDecoder.decode(fileBuffer);
      console.log('Codificação detectada: Windows-1252 (ANSI Excel)');
    }

    const lines = fileContent.split(/\r?\n/);
    if (lines.length <= 1) {
      console.error('Erro: Arquivo CSV vazio ou sem dados.');
      process.exit(1);
    }

    // Auto-detect delimiter
    const headerLine = lines[0];
    const delimiter = headerLine.includes(';') ? ';' : ',';
    
    // Read and clean headers
    const headers = headerLine.split(delimiter).map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
    console.log('Colunas identificadas:', headers);

    // Mappings validation
    const requiredCol = 'patrimonio';
    if (!headers.includes(requiredCol)) {
      console.error(`Erro: Coluna obrigatória "${requiredCol}" não encontrada no CSV.`);
      process.exit(1);
    }

    let successCount = 0;
    let errorCount = 0;

    // Default Section for fallback
    const [defaultSecao] = await Secao.findOrCreate({
      where: { nome: 'Almoxarifado Geral' },
      defaults: { controla_estoque: true }
    });

    // Default OPM for fallback
    const [defaultOpm] = await OPM.findOrCreate({
      where: { codigo: '180000000' },
      defaults: { descricao: 'OPM Geral Importação' }
    });

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip blank lines

      const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] !== undefined ? values[index] : null;
      });

      const patNo = row.patrimonio;
      if (!patNo) {
        console.warn(`[Linha ${i + 1}] Ignorada: Número do patrimônio ausente.`);
        errorCount++;
        continue;
      }

      try {
        // Resolve OPM
        let opmId = defaultOpm.id;
        if (row.opmatual) {
          const [resolvedOpm] = await OPM.findOrCreate({
            where: { codigo: row.opmatual },
            defaults: { descricao: `OPM ${row.opmatual}` }
          });
          opmId = resolvedOpm.id;
        }

        // Resolve Section (Localizacao)
        let secaoId = defaultSecao.id;
        if (row.localizacao) {
          const [resolvedSecao] = await Secao.findOrCreate({
            where: { nome: row.localizacao },
            defaults: { controla_estoque: true }
          });
          secaoId = resolvedSecao.id;
        }

        // Parse Valor Compra (clean up commas/currency)
        let rawValor = row.valor || '0.00';
        rawValor = rawValor.replace(/[R$\s]/g, '').replace(/,/g, '');
        const valorCompra = parseFloat(rawValor) || 0.00;

        // Clean fields
        const numPatrimonio = patNo.trim();
        const grupo = (row.grupo || 'DIV').trim().toUpperCase();
        const desc = row.descricao || `Item importado: ${numPatrimonio}`;
        const marca = row.marca || 'Não Informada';
        const modelo = row.modelo || 'Não Informado';
        const reDetentor = row.re || row.detentor || null;
        const numSerie = row.nserie || row.numero_serie || null;

        // check if Patrimonio already exists
        const existingPat = await Patrimonio.findOne({ where: { numero_patrimonio: numPatrimonio } });

        if (existingPat) {
          // Update
          await existingPat.update({
            numero_serie: numSerie,
            grupo: grupo,
            descricao: desc,
            marca: marca,
            modelo: modelo,
            valor_compra: valorCompra,
            re_detentor: reDetentor,
            opm_atual_id: opmId,
            secao_atual_id: secaoId
          });
          console.log(`[ATUALIZADO] Ativo ${numPatrimonio}`);
        } else {
          // Create
          await Patrimonio.create({
            numero_patrimonio: numPatrimonio,
            numero_serie: numSerie,
            grupo: grupo,
            descricao: desc,
            marca: marca,
            modelo: modelo,
            valor_compra: valorCompra,
            re_detentor: reDetentor,
            opm_atual_id: opmId,
            secao_atual_id: secaoId
          });
          console.log(`[INSERIDO] Ativo ${numPatrimonio}`);
        }

        successCount++;
      } catch (err) {
        console.error(`[ERRO - Linha ${i + 1}] Falha ao processar ativo ${patNo}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\nImportação de CSV concluída!`);
    console.log(`- Sucesso: ${successCount} registros`);
    console.log(`- Falhas/Pulados: ${errorCount} registros`);
    process.exit(0);
  } catch (err) {
    console.error('Erro fatal ao rodar script de importação:', err);
    process.exit(1);
  }
}

importCsv();
