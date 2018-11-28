# Dooca themekit cli

Ferramenta para desenvovimento de temas na plataforma ([Dooca commerce](https://dooca.com.br)).

# Instalação

Para instalação aconselhamos o uso do ([yarn](https://yarnpkg.com/))

```bash
yarn global add @doocacommerce/dooca-cli
```
# Configuração

Primeiramente iremos configurar o ambiente usando o comando ```dooca config``` 

```bash
dooca config
```

# Inicialização

Para inicializar o serviço use o comando ```dooca serve```, ele utilizará os dados do config para inicializar.

```bash
dooca serve
```

## Opções de inicialização:

O comando ```dooca serve``` pode ser usando com algumas opções, ```-s``` para passar ```shop-id``` e ```-t``` para passar o tema.

```bash
dooca serve -s dooca -t default
```

# Commandos extras

Será gerado os arquivos ```.twig``` e ```.scss``` no diretório do tema.

### section 

```bash
dooca section nome-section
```

### snippet

```bash
dooca snippet nome-snippet
```

### template

```bash
dooca template nome-template
```
