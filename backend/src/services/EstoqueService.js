const { Op } = require('sequelize');
const { EstoqueSaldo } = require('../models');

class EstoqueService {
  /**
   * Registra uma entrada física e recalcula o custo médio para o mês.
   */
  async registrarEntradaItem(transaction, materialId, opmId, naturezaId, anomes, quantidade, valorUnitario) {
    // 1. Obter saldo do mês atual
    let currentSaldo = await EstoqueSaldo.findOne({
      where: { material_id: materialId, opm_id: opmId, natureza_id: naturezaId, anomes },
      transaction
    });

    let anteriorQty = 0;
    let anteriorValorMedio = 0.00;

    if (!currentSaldo) {
      // Se não existe registro no mês atual, buscar o último saldo disponível de meses anteriores
      const ultimoSaldoAnterior = await EstoqueSaldo.findOne({
        where: {
          material_id: materialId,
          opm_id: opmId,
          natureza_id: naturezaId,
          anomes: { [Op.lt]: anomes }
        },
        order: [['anomes', 'DESC']],
        transaction
      });

      if (ultimoSaldoAnterior) {
        anteriorQty = ultimoSaldoAnterior.estoque;
        anteriorValorMedio = parseFloat(ultimoSaldoAnterior.valor_medio) || 0.00;
      }

      // Criar o registro para o mês atual
      const novaQtde = anteriorQty + quantidade;
      const novoValorMedio = novaQtde > 0 
        ? ((anteriorQty * anteriorValorMedio) + (quantidade * valorUnitario)) / novaQtde
        : valorUnitario;

      currentSaldo = await EstoqueSaldo.create({
        material_id: materialId,
        opm_id: opmId,
        natureza_id: naturezaId,
        anomes,
        estoque: novaQtde,
        valor_medio: parseFloat(novoValorMedio.toFixed(2))
      }, { transaction });
    } else {
      // Se já existe registro no mês atual
      // O saldo anterior é o saldo do mês atual antes desta operação
      const antigaQtde = currentSaldo.estoque;
      const antigoValorMedio = parseFloat(currentSaldo.valor_medio) || 0.00;

      const novaQtde = antigaQtde + quantidade;
      const novoValorMedio = novaQtde > 0
        ? ((antigaQtde * antigoValorMedio) + (quantidade * valorUnitario)) / novaQtde
        : valorUnitario;

      await currentSaldo.update({
        estoque: novaQtde,
        valor_medio: parseFloat(novoValorMedio.toFixed(2))
      }, { transaction });
    }

    // 2. Propagar a alteração de quantidade para todos os meses posteriores que já existam
    await EstoqueSaldo.increment(
      { estoque: quantidade },
      {
        where: {
          material_id: materialId,
          opm_id: opmId,
          natureza_id: naturezaId,
          anomes: { [Op.gt]: anomes }
        },
        transaction
      }
    );

    return currentSaldo;
  }

  /**
   * Registra uma saída física de estoque (deduz a quantidade, mantém o custo médio).
   */
  async registrarSaidaItem(transaction, materialId, opmId, naturezaId, anomes, quantidade) {
    // 1. Obter saldo do mês atual
    let currentSaldo = await EstoqueSaldo.findOne({
      where: { material_id: materialId, opm_id: opmId, natureza_id: naturezaId, anomes },
      transaction
    });

    let anteriorQty = 0;
    let anteriorValorMedio = 0.00;

    if (!currentSaldo) {
      // Buscar saldo do mês anterior para verificar estoque
      const ultimoSaldoAnterior = await EstoqueSaldo.findOne({
        where: {
          material_id: materialId,
          opm_id: opmId,
          natureza_id: naturezaId,
          anomes: { [Op.lt]: anomes }
        },
        order: [['anomes', 'DESC']],
        transaction
      });

      if (!ultimoSaldoAnterior || ultimoSaldoAnterior.estoque < quantidade) {
        throw new Error(`Estoque insuficiente. Saldo disponível: ${ultimoSaldoAnterior ? ultimoSaldoAnterior.estoque : 0}, Saída requisitada: ${quantidade}`);
      }

      anteriorQty = ultimoSaldoAnterior.estoque;
      anteriorValorMedio = parseFloat(ultimoSaldoAnterior.valor_medio) || 0.00;

      // Criar registro para o mês atual
      currentSaldo = await EstoqueSaldo.create({
        material_id: materialId,
        opm_id: opmId,
        natureza_id: naturezaId,
        anomes,
        estoque: anteriorQty - quantidade,
        valor_medio: parseFloat(anteriorValorMedio.toFixed(2))
      }, { transaction });
    } else {
      // Se já existe registro no mês atual, validar estoque
      if (currentSaldo.estoque < quantidade) {
        throw new Error(`Estoque insuficiente no mês. Saldo disponível: ${currentSaldo.estoque}, Saída requisitada: ${quantidade}`);
      }

      await currentSaldo.update({
        estoque: currentSaldo.estoque - quantidade
      }, { transaction });
    }

    // 2. Propagar a redução de quantidade para todos os meses posteriores
    await EstoqueSaldo.decrement(
      { estoque: quantidade },
      {
        where: {
          material_id: materialId,
          opm_id: opmId,
          natureza_id: naturezaId,
          anomes: { [Op.gt]: anomes }
        },
        transaction
      }
    );

    return currentSaldo;
  }
}

module.exports = new EstoqueService();
