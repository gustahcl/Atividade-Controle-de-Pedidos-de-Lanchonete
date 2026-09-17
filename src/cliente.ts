/**
 * Cliente
 *
 * RN01 — Cliente
 * - O nome do cliente não pode estar vazio.
 * - O nome do cliente deve possuir pelo menos 3 caracteres.
 */
export class Cliente {
  readonly nome: string;

  constructor(nome: string) {
    const nomeNormalizado = nome?.trim() ?? '';

    if (nomeNormalizado.length === 0) {
      throw new Error('O nome do cliente não pode estar vazio.');
    }

    if (nomeNormalizado.length < 3) {
      throw new Error('O nome do cliente deve possuir pelo menos 3 caracteres.');
    }

    this.nome = nomeNormalizado;
  }
}
