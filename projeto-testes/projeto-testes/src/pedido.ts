import { Cliente } from './cliente';
import { calcularDesconto, calcularValorFinal } from './desconto';

/**
 * Cardápio fixo da lanchonete.
 */
export const CARDAPIO = {
  HAMBURGUER: 20.0,
  BATATA: 10.0,
  REFRIGERANTE: 7.0,
  SOBREMESA: 8.0,
} as const;

export type NomeProduto = keyof typeof CARDAPIO;

export interface ItemPedido {
  nome: NomeProduto;
  precoUnitario: number;
  quantidade: number;
}

/**
 * RN05 — Status
 * Um pedido pode possuir os seguintes status:
 * CRIADO, EM_PREPARACAO, PRONTO, ENTREGUE, CANCELADO
 */
export enum StatusPedido {
  CRIADO = 'CRIADO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  PRONTO = 'PRONTO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

/**
 * Transições de status permitidas.
 * RN06 — Um pedido ENTREGUE não pode ser cancelado.
 * RN07 — Um pedido só pode ser marcado como ENTREGUE depois de estar PRONTO.
 */
const TRANSICOES_PERMITIDAS: Record<StatusPedido, StatusPedido[]> = {
  [StatusPedido.CRIADO]: [StatusPedido.EM_PREPARACAO, StatusPedido.CANCELADO],
  [StatusPedido.EM_PREPARACAO]: [StatusPedido.PRONTO, StatusPedido.CANCELADO],
  [StatusPedido.PRONTO]: [StatusPedido.ENTREGUE, StatusPedido.CANCELADO],
  [StatusPedido.ENTREGUE]: [],
  [StatusPedido.CANCELADO]: [],
};

export class Pedido {
  readonly cliente: Cliente;
  private itens: ItemPedido[] = [];
  private status: StatusPedido = StatusPedido.CRIADO;

  constructor(cliente: Cliente) {
    this.cliente = cliente;
  }

  /**
   * Adiciona um produto do cardápio ao pedido.
   *
   * RN04 — O sistema não pode aceitar preço ou quantidade menor que zero.
   */
  adicionarProduto(nome: NomeProduto, quantidade: number = 1): void {
    if (quantidade < 0) {
      throw new Error('A quantidade não pode ser menor que zero.');
    }

    if (quantidade === 0) {
      throw new Error('A quantidade deve ser maior que zero.');
    }

    const precoUnitario = CARDAPIO[nome];

    if (precoUnitario === undefined) {
      throw new Error(`Produto "${nome}" não existe no cardápio.`);
    }

    if (precoUnitario < 0) {
      throw new Error('O preço do produto não pode ser menor que zero.');
    }

    const itemExistente = this.itens.find((item) => item.nome === nome);

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      this.itens.push({ nome, precoUnitario, quantidade });
    }
  }

  listarItens(): ItemPedido[] {
    return [...this.itens];
  }

  /**
   * RN02 — Um pedido precisa possuir pelo menos um produto.
   * Lança erro se o pedido estiver vazio; caso contrário retorna o subtotal.
   */
  calcularSubtotal(): number {
    if (this.itens.length === 0) {
      throw new Error('O pedido precisa possuir pelo menos um produto.');
    }

    const subtotal = this.itens.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0
    );

    return arredondar(subtotal);
  }

  calcularDesconto(): number {
    return arredondar(calcularDesconto(this.calcularSubtotal()));
  }

  /**
   * RN03 — Aplica o desconto sobre o subtotal e retorna o valor final do pedido.
   */
  calcularValorFinal(): number {
    return calcularValorFinal(this.calcularSubtotal());
  }

  consultarStatus(): StatusPedido {
    return this.status;
  }

  /**
   * Altera o status do pedido respeitando as transições permitidas
   * (RN05, RN06 e RN07).
   */
  alterarStatus(novoStatus: StatusPedido): void {
    const transicoesValidas = TRANSICOES_PERMITIDAS[this.status];

    if (!transicoesValidas.includes(novoStatus)) {
      if (this.status === StatusPedido.ENTREGUE && novoStatus === StatusPedido.CANCELADO) {
        throw new Error('Um pedido entregue não pode ser cancelado.');
      }

      if (novoStatus === StatusPedido.ENTREGUE && this.status !== StatusPedido.PRONTO) {
        throw new Error('Um pedido só pode ser marcado como ENTREGUE depois de estar PRONTO.');
      }

      throw new Error(
        `Não é possível alterar o status de "${this.status}" para "${novoStatus}".`
      );
    }

    this.status = novoStatus;
  }
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}
