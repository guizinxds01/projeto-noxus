/**
 * Gera um slug amigável para URLs a partir do nome de um produto.
 * Exemplo: "Camisa Brasil Azul 2026!" -> "camisa-brasil-azul-2026"
 * 
 * @param {string} text O texto/nome a ser convertido.
 * @returns {string} O slug gerado.
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Divide caracteres acentuados em caractere base + acento
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos/diacríticos
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/[^\w-]+/g, '') // Remove caracteres que não sejam letras, números ou hífens
    .replace(/--+/g, '-'); // Garante que não teremos hífens duplicados
};
