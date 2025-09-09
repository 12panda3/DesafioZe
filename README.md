Desafio BackEnd Projeto Desenvolve - Banco de Dados - Carlos Henrico de Oliveira Maciel, PD124

Este projeto tem como objetivo criar uma API para o cadastro, leitura e filtro de
fornecedores de um dado banco de dados.

As tecnologias utilizadas foram:
Node.js
Express
Turf.js
Insomnia (para envio de requests à API.)

Arquivos notáveis:
index.js (Código do projeto)
package.js (Dependências e scripts, necessário para a boa execução)

Para usar a API, é necessário executá-lo usando "node index.js" em um terminal dentro
de uma pasta que contenha todos arquivos necessário. Uma vez executado, a API e o
banco de dados estará disponível no endereço hhtp://localhost:3000/parceiros.

Dentro do link, poderá ser visto todos parceiros cadastrados, junto de suas 
informações e um filtro que pode ser usado para pesquisar fornecedores específicos
(por quaisquer informações que os fornecedores possuam).

Utilizando um aplicativo para executar requests (como Insomnia), é possível facilmente
adicionar parceiros utilizando um código JSON o qual forneça todas informações necessárias
para o cadastro, a seguir um exemplo de código JSON para cadastrar um parceiro:

{
  "id": 1,
  "tradingName": "Adega da Cerveja - Pinheiros",
  "ownerName": "Zé da Silva",
  "document": "1432132123891/0001",
  "coverageArea": {
    "type": "MultiPolygon",
    "coordinates": [
      [[[30, 20], [45, 40], [10, 40], [30, 20]]]
    ]
  },
  "address": {
    "type": "Point",
    "coordinates": [-46.57421, -21.785741]
  }
}

*Note que o campo "document" e "id" não podem ser repetidos entre diferentes parceiros,
sendo impedido pelo próprio código.

