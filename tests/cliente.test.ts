import { Cliente } from '../src/cliente';

describe('Cliente - RN01', () => {
  it('deve criar um cliente com nome válido', () => {
    const cliente = new Cliente('Gustavo');
    expect(cliente.nome).toBe('Gustavo');
  });

  it('deve remover espaços em branco das extremidades do nome', () => {
    const cliente = new Cliente('  Ana Paula  ');
    expect(cliente.nome).toBe('Ana Paula');
  });

  it('não deve permitir nome vazio', () => {
    expect(() => new Cliente('')).toThrow('O nome do cliente não pode estar vazio.');
  });

  it('não deve permitir nome apenas com espaços', () => {
    expect(() => new Cliente('   ')).toThrow('O nome do cliente não pode estar vazio.');
  });

  it('não deve permitir nome com menos de 3 caracteres', () => {
    expect(() => new Cliente('Al')).toThrow(
      'O nome do cliente deve possuir pelo menos 3 caracteres.'
    );
  });

  it('deve aceitar nome com exatamente 3 caracteres', () => {
    const cliente = new Cliente('Ana');
    expect(cliente.nome).toBe('Ana');
  });
});
