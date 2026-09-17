import { calcularDesconto, calcularValorFinal } from '../src/desconto';

describe('Desconto - RN03', () => {
  it('não deve aplicar desconto para subtotal igual a R$ 100,00', () => {
    expect(calcularDesconto(100)).toBe(0);
  });

  it('não deve aplicar desconto para subtotal menor que R$ 100,00', () => {
    expect(calcularDesconto(50)).toBe(0);
  });

  it('deve aplicar 10% de desconto para subtotal acima de R$ 100,00', () => {
    expect(calcularDesconto(150)).toBeCloseTo(15);
  });

  it('deve calcular o valor final com desconto aplicado', () => {
    expect(calcularValorFinal(150)).toBeCloseTo(135);
  });

  it('deve calcular o valor final sem desconto quando não ultrapassa o limite', () => {
    expect(calcularValorFinal(100)).toBe(100);
  });

  it('não deve aceitar subtotal negativo (RN04)', () => {
    expect(() => calcularDesconto(-10)).toThrow('O subtotal não pode ser negativo.');
  });
});
