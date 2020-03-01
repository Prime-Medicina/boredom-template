module.exports = (string) => {
  if (!string || string.length !== 11
    || string === '00000000000'
    || string === '11111111111'
    || string === '22222222222'
    || string === '33333333333'
    || string === '44444444444'
    || string === '55555555555'
    || string === '66666666666'
    || string === '77777777777'
    || string === '88888888888'
    || string === '99999999999') return false;
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i += 1) soma += Number(string.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== Number(string.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i += 1) soma += Number(string.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== Number(string.substring(10, 11))) return false;
  return true;
};
