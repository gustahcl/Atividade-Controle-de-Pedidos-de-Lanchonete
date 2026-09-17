/**
 * Desconto
 *
 * RN03 — Desconto
 * - Pedidos acima de R$ 100,00 recebem desconto de 10%.
 * - Pedidos de R$ 100,00 ou menos não recebem desconto.
 */
const LIMITE_PARA_DESCONTO = 100;
const PERCENTUAL_DESCONTO = 0.1;

export function calcularDesconto(subtotal: number): number {
  if (subtotal < 0) {
    throw new Error('O subtotal não pode ser negativo.');
  }

  if (subtotal > LIMITE_PARA_DESCONTO) {
    return subtotal * PERCENTUAL_DESCONTO;
  }

  return 0;
}

export function calcularValorFinal(subtotal: number): number {
  const desconto = calcularDesconto(subtotal);
  return arredondar(subtotal - desconto);
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}
