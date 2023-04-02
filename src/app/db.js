/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
const fs = require("fs");

fs.readFile("lista.txt", "utf8", (err, data) => {
  if (err) throw err;

  const words = data.split("\n"); // Separar as palavras do arquivo em um array
  const fiveLetterWords = words.filter(
    (word) => word.length === 5 && !word.includes("-")
  ); // Filtrar as palavras com 5 letras

  // Cria um array a partir das linhas do arquivo
  const array = fiveLetterWords.map((line) => line.trim().toLowerCase());

  // Escreve o array no arquivo de saída
  fs.writeFile("saida.txt", JSON.stringify(array), (err) => {
    if (err) throw err;
    console.log("Arquivo salvo com sucesso!");
  });
});
