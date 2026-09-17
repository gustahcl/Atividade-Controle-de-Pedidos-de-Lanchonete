import { Cliente } from '../src/cliente';
import { Pedido, StatusPedido } from '../src/pedido';

function criarPedidoComCliente(): Pedido {
  const cliente = new Cliente('Gustavo Henrique');
  return new Pedido(cliente);
}

describe('Pedido - RN02 (pedido precisa de pelo menos um produto)', () => {
  it('não deve calcular subtotal de um pedido sem produtos', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.calcularSubtotal()).toThrow(
      'O pedido precisa possuir pelo menos um produto.'
    );
  });

  it('deve calcular subtotal corretamente após adicionar produtos', () => {
    const pedido = criarPedidoComCliente();
    pedido.adicionarProduto('HAMBURGUER', 2); // 40
    pedido.adicionarProduto('REFRIGERANTE', 1); // 7

    expect(pedido.calcularSubtotal()).toBe(47);
  });
});

describe('Pedido - adicionarProduto e RN04 (valores negativos)', () => {
  it('não deve aceitar quantidade negativa', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.adicionarProduto('BATATA', -1)).toThrow(
      'A quantidade não pode ser menor que zero.'
    );
  });

  it('não deve aceitar quantidade igual a zero', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.adicionarProduto('BATATA', 0)).toThrow(
      'A quantidade deve ser maior que zero.'
    );
  });

  it('deve somar quantidades ao adicionar o mesmo produto mais de uma vez', () => {
    const pedido = criarPedidoComCliente();
    pedido.adicionarProduto('SOBREMESA', 1);
    pedido.adicionarProduto('SOBREMESA', 2);

    const itens = pedido.listarItens();
    expect(itens).toHaveLength(1);
    expect(itens[0].quantidade).toBe(3);
  });
});

describe('Pedido - RN03 (desconto) e valor final', () => {
  it('deve aplicar desconto quando subtotal ultrapassa R$ 100,00', () => {
    const pedido = criarPedidoComCliente();
    pedido.adicionarProduto('HAMBURGUER', 5); // 100
    pedido.adicionarProduto('BATATA', 1); // 10 -> subtotal 110

    expect(pedido.calcularSubtotal()).toBe(110);
    expect(pedido.calcularDesconto()).toBeCloseTo(11);
    expect(pedido.calcularValorFinal()).toBeCloseTo(99);
  });

  it('não deve aplicar desconto quando subtotal é exatamente R$ 100,00', () => {
    const pedido = criarPedidoComCliente();
    pedido.adicionarProduto('HAMBURGUER', 5); // 100

    expect(pedido.calcularSubtotal()).toBe(100);
    expect(pedido.calcularDesconto()).toBe(0);
    expect(pedido.calcularValorFinal()).toBe(100);
  });
});

describe('Pedido - RN05 (status inicial) e consulta de status', () => {
  it('deve iniciar com status CRIADO', () => {
    const pedido = criarPedidoComCliente();
    expect(pedido.consultarStatus()).toBe(StatusPedido.CRIADO);
  });
});

describe('Pedido - alteração de status (RN05, RN06, RN07)', () => {
  it('deve seguir o fluxo normal até ENTREGUE', () => {
    const pedido = criarPedidoComCliente();

    pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
    expect(pedido.consultarStatus()).toBe(StatusPedido.EM_PREPARACAO);

    pedido.alterarStatus(StatusPedido.PRONTO);
    expect(pedido.consultarStatus()).toBe(StatusPedido.PRONTO);

    pedido.alterarStatus(StatusPedido.ENTREGUE);
    expect(pedido.consultarStatus()).toBe(StatusPedido.ENTREGUE);
  });

  it('deve permitir cancelar um pedido CRIADO', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.CANCELADO);
    expect(pedido.consultarStatus()).toBe(StatusPedido.CANCELADO);
  });

  it('deve permitir cancelar um pedido EM_PREPARACAO', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
    pedido.alterarStatus(StatusPedido.CANCELADO);
    expect(pedido.consultarStatus()).toBe(StatusPedido.CANCELADO);
  });

  it('não deve permitir cancelar um pedido ENTREGUE (RN06)', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
    pedido.alterarStatus(StatusPedido.PRONTO);
    pedido.alterarStatus(StatusPedido.ENTREGUE);

    expect(() => pedido.alterarStatus(StatusPedido.CANCELADO)).toThrow(
      'Um pedido entregue não pode ser cancelado.'
    );
  });

  it('não deve permitir marcar como ENTREGUE sem antes estar PRONTO (RN07)', () => {
    const pedido = criarPedidoComCliente();

    expect(() => pedido.alterarStatus(StatusPedido.ENTREGUE)).toThrow(
      'Um pedido só pode ser marcado como ENTREGUE depois de estar PRONTO.'
    );
  });

  it('não deve permitir marcar como ENTREGUE a partir de EM_PREPARACAO (RN07)', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.EM_PREPARACAO);

    expect(() => pedido.alterarStatus(StatusPedido.ENTREGUE)).toThrow(
      'Um pedido só pode ser marcado como ENTREGUE depois de estar PRONTO.'
    );
  });

  it('não deve permitir alterar o status de um pedido já CANCELADO', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.CANCELADO);

    expect(() => pedido.alterarStatus(StatusPedido.EM_PREPARACAO)).toThrow(
      'Não é possível alterar o status de "CANCELADO" para "EM_PREPARACAO".'
    );
  });
});
