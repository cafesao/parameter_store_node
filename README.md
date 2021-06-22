# Adicionar parâmetros no SSM

Sabe quando você tem 100 parâmetros para colocar no SSM e sabe que vai levar um bom tempo para fazer isso?

Então, seus problemas acabaram!

Graças a esse Script NodeJS basta você colocar seus parâmetros em um arquivo JSON e pronto!

Vamos ver um passo a passo:

- Faça um clone do repositório com o comando `git clone`
- Entre na pasta com o comando `cd parameter_store_node`
- Você pode perceber que existe um arquivo chamado _.env_
- Edite o arquivo mudando os dois parâmetros:
  - AWS_PROFILE = Coloque o nome do profile da AWS que você usa na AWS CLI
  - AWS_REGION = Coloque a região da AWS
- Perceba que existe o arquivo _params.json_, vamos editar ele:
  - Como você pode perceber nos exemplos do arquivo, é um JSON simples:
  - Basta colocar `{Nome do parâmetro:Valor do parâmetro}`
- Por fim execute `node index.js` ou `yarn start`
