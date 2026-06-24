const fs = require('fs');
const path = require('path');
const { OPM, Secao, Patrimonio } = require('../models');

const csvPath = path.join(__dirname, '../../import.csv');

class ImportController {
  async importLocalCsv(req, res, next) {
    try {
      if (!fs.existsSync(csvPath)) {
        return res.status(404).json({ error: 'Arquivo import.csv não encontrado na raiz do backend.' });
      }

      const fileBuffer = fs.readFileSync(csvPath);
      let fileContent;
      try {
        const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
        fileContent = utf8Decoder.decode(fileBuffer);
      } catch (e) {
        const winDecoder = new TextDecoder('windows-1252');
        fileContent = winDecoder.decode(fileBuffer);
      }

      const lines = fileContent.split(/\r?\n/);
      if (lines.length <= 1) {
        return res.status(400).json({ error: 'Arquivo CSV vazio ou sem dados.' });
      }

      const headerLine = lines[0];
      const delimiter = headerLine.includes(';') ? ';' : ',';
      const headers = headerLine.split(delimiter).map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));

      if (!headers.includes('patrimonio')) {
        return res.status(400).json({ error: 'Coluna "patrimonio" não encontrada no CSV.' });
      }

      let successCount = 0;
      let errorCount = 0;
      const logs = [];

      const [defaultSecao] = await Secao.findOrCreate({
        where: { nome: 'Almoxarifado Geral' },
        defaults: { controla_estoque: true }
      });

      const [defaultOpm] = await OPM.findOrCreate({
        where: { codigo: '180000000' },
        defaults: { descricao: 'OPM Geral Importação' }
      });

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] !== undefined ? values[index] : null;
        });

        const patNo = row.patrimonio;
        if (!patNo) {
          logs.push(`Linha ${i + 1}: Ignorada (número de patrimônio ausente).`);
          errorCount++;
          continue;
        }

        try {
          let opmId = defaultOpm.id;
          if (row.opmatual) {
            const [resolvedOpm] = await OPM.findOrCreate({
              where: { codigo: row.opmatual },
              defaults: { descricao: `OPM ${row.opmatual}` }
            });
            opmId = resolvedOpm.id;
          }

          let secaoId = defaultSecao.id;
          if (row.localizacao) {
            const [resolvedSecao] = await Secao.findOrCreate({
              where: { nome: row.localizacao },
              defaults: { controla_estoque: true }
            });
            secaoId = resolvedSecao.id;
          }

          let rawValor = row.valor || '0.00';
          rawValor = rawValor.replace(/[R$\s]/g, '').replace(/,/g, '');
          const valorCompra = parseFloat(rawValor) || 0.00;

          const numPatrimonio = patNo.trim();
          const grupo = (row.grupo || 'DIV').trim().toUpperCase();
          const desc = row.descricao || `Item importado: ${numPatrimonio}`;
          const marca = row.marca || 'Não Informada';
          const modelo = row.modelo || 'Não Informado';
          const reDetentor = row.re || row.detentor || null;
          const numSerie = row.nserie || row.numero_serie || null;

          const existingPat = await Patrimonio.findOne({ where: { numero_patrimonio: numPatrimonio } });

          if (existingPat) {
            await existingPat.update({
              numero_serie: numSerie,
              grupo,
              descricao: desc,
              marca,
              modelo,
              valor_compra: valorCompra,
              re_detentor: reDetentor,
              opm_atual_id: opmId,
              secao_atual_id: secaoId
            });
            logs.push(`Linha ${i + 1} [${numPatrimonio}]: Atualizado.`);
          } else {
            await Patrimonio.create({
              numero_patrimonio: numPatrimonio,
              numero_serie: numSerie,
              grupo,
              descricao: desc,
              marca,
              modelo,
              valor_compra: valorCompra,
              re_detentor: reDetentor,
              opm_atual_id: opmId,
              secao_atual_id: secaoId
            });
            logs.push(`Linha ${i + 1} [${numPatrimonio}]: Inserido.`);
          }
          successCount++;
        } catch (err) {
          logs.push(`Linha ${i + 1} [${patNo}]: Erro (${err.message}).`);
          errorCount++;
        }
      }

      return res.status(200).json({
        message: 'Importação de CSV executada.',
        successCount,
        errorCount,
        logs
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImportController();
