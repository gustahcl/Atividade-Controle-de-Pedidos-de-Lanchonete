# Projeto Testes — Controle de Pedidos de Lanchonete

Sistema simples (em TypeScript) para controle de pedidos de uma lanchonete, com testes
unitários cobrindo as regras de negócio definidas pelo cliente.

## Estrutura

```
projeto-testes/
│
├── src/
│   ├── cliente.ts     # Cadastro/validação de cliente (RN01)
│   ├── pedido.ts       # Pedido, produtos e status (RN02, RN04, RN05, RN06, RN07)
│   └── desconto.ts     # Cálculo de desconto e valor final (RN03)
│
├── tests/
│   ├── cliente.test.ts
│   ├── pedido.test.ts
│   └── desconto.test.ts
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Cardápio

| Produto      | Preço    |
|--------------|----------|
| Hambúrguer   | R$ 20,00 |
| Batata       | R$ 10,00 |
| Refrigerante | R$ 7,00  |
| Sobremesa    | R$ 8,00  |

## Regras de negócio implementadas

- **RN01 — Cliente**: nome não pode ser vazio e deve ter pelo menos 3 caracteres.
- **RN02 — Pedido**: precisa ter pelo menos um produto para calcular subtotal/valor final.
- **RN03 — Desconto**: 10% de desconto para pedidos acima de R$ 100,00; nenhum desconto
  para pedidos de R$ 100,00 ou menos.
- **RN04 — Valor negativo**: preço e quantidade não podem ser menores que zero.
- **RN05 — Status**: `CRIADO`, `EM_PREPARACAO`, `PRONTO`, `ENTREGUE`, `CANCELADO`.
- **RN06 — Cancelamento**: um pedido `ENTREGUE` não pode ser cancelado.
- **RN07 — Pedido pronto**: só pode ir para `ENTREGUE` a partir de `PRONTO`.

## Fluxo de status permitido

```
CRIADO ──► EM_PREPARACAO ──► PRONTO ──► ENTREGUE
  │              │               │
  └──────────────┴───────────────┴──► CANCELADO
```

(`ENTREGUE` e `CANCELADO` são estados finais — nenhuma transição sai deles.)

## Como usar

### Instalar dependências
```bash
npm install
```

### Rodar os testes
```bash
npm test
```

### Rodar os testes com cobertura
```bash
npm run test:coverage
```

## Exemplo de uso

```ts
import { Cliente } from './src/cliente';
import { Pedido, StatusPedido } from './src/pedido';

const cliente = new Cliente('Gustavo Henrique');
const pedido = new Pedido(cliente);

pedido.adicionarProduto('HAMBURGUER', 2);
pedido.adicionarProduto('REFRIGERANTE', 1);

console.log(pedido.calcularSubtotal());   // 47
console.log(pedido.calcularValorFinal()); // 47 (sem desconto, pois é <= 100)

pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
pedido.alterarStatus(StatusPedido.PRONTO);
pedido.alterarStatus(StatusPedido.ENTREGUE);

console.log(pedido.consultarStatus()); // ENTREGUE
```
