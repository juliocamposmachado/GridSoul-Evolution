# GRID SOUL Evolution

**O Gemini é o cérebro. O enxame de microcubos é o corpo.**

GRID SOUL Evolution é um protótipo experimental de entidade visual
tridimensional controlada por inteligência artificial.

O projeto combina Google Gemini, Node.js, Three.js e WebGL para
interpretar comandos em linguagem natural e transformá-los em
mudanças geométricas e movimentos de um enxame visual coletivo.

## Arquitetura

- **Cérebro:** Google Gemini API.
- **Backend:** Node.js, Express e SDK oficial `@google/genai`.
- **Corpo visual:** Three.js, WebGL e microcubos instanciados.
- **Comunicação:** API HTTP local com respostas estruturadas em JSON.
- **Interface:** HTML, CSS e JavaScript.

## Funcionalidades atuais

- Controle da entidade por comandos em português.
- Transformações entre esfera, toro, espiral, onda, nuvem e rosto estilizado.
- Ajuste da população de microcubos.
- Controle de energia, escala, orientação e posição global.
- Animação local com interpolação de movimento.
- Chave da API protegida no backend.

## Requisitos

- Linux ou outro sistema compatível com Node.js.
- Node.js e npm.
- Chave válida da Google Gemini API.
- Microsoft Edge ou outro navegador compatível com WebGL.
- Conexão com a internet para acessar o Gemini e carregar o Three.js.

## Instalação

Clone o repositório e entre na pasta:

```bash
git clone URL_DO_REPOSITORIO
cd GridSoul-Evolution
npm install
```

Configure a chave da API:

```bash
read -rsp "Chave Gemini: " GEMINI_KEY
echo
umask 077
printf 'GEMINI_API_KEY=%s\nGEMINI_MODEL=gemini-flash-latest\n' "$GEMINI_KEY" > .env
unset GEMINI_KEY
chmod 600 .env
```

Inicie a aplicação:

```bash
npm start
```

Acesse:

http://127.0.0.1:8765

## Segurança

- Nunca publique o arquivo `.env`.
- Nunca inclua chaves secretas no frontend.
- O arquivo `.env` e a pasta `node_modules` são ignorados pelo Git.
- Não compartilhe registros de terminal que contenham credenciais.
- O servidor está configurado para aceitar conexões locais.

## Estado do projeto

Protótipo funcional em evolução.

A população e o desempenho dependem dos recursos disponíveis
na máquina. A expansão geométrica é dinâmica dentro dos limites
configurados de memória e processamento.

## Visão

Construir uma entidade visual coletiva na qual o Gemini interpreta
intenções e o motor tridimensional executa as transformações do
enxame como um único corpo expressivo.

O objetivo futuro inclui memória persistente, geração de geometrias
mais complexas, interação por voz e um sistema de execução adaptativo.

## Tecnologias

- Google Gemini API
- Node.js
- Express
- Three.js
- WebGL
- JavaScript
