module.exports = (string) => {
  if (!string || string.length !== 14
    || string === '00000000000000'
    || string === '11111111111111'
    || string === '22222222222222'
    || string === '33333333333333'
    || string === '44444444444444'
    || string === '55555555555555'
    || string === '66666666666666'
    || string === '77777777777777'
    || string === '88888888888888'
    || string === '99999999999999') return false;
  let tamanho = string.length - 2;
  let numeros = string.substring(0, tamanho);
  const digitos = string.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i -= 1) {
    soma += numeros.charAt(tamanho - i) * (pos -= 1);
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : (11 - soma) % 11;
  if (resultado !== digitos.charAt(0)) return false;
  tamanho += 1;
  numeros = string.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i -= 1) {
    soma += numeros.charAt(tamanho - i) * (pos -= 1);
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : (11 - soma) % 11;
  if (resultado !== digitos.charAt(1)) return false;
  return true;
};
