# Spotify playlist subset

Objetivo: pegar minha lista de músicas curtidas ou qualquer playlist especificada
e gerar uma nova playlist com um subconjunto aleatório dessas músicas.

Motivo: Quero ter algumas músicas offline no celular mas não a colação toda.

## Análise inicial

- Não vai precisar de persistência;
- Usando o fluxo "implicit grant" do oauth não precisamos de um backend (100% client-side);
- Escolha de formato: CLI ou site estático?
- Precisa abrir uma tela de oauth no navegador;
- Ganhou: Site estático, por ser mais fácil de acessar e mais fácil de integrar com a janela do oauth;

Site estático? Portanto será um projeto next.js.
