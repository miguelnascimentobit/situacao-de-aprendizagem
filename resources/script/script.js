
// 1. ARRAY PARA ARMAZENAR OS MORADORES (ESTADO DA APLICAÇÃO)
let moradores = [];

// Dados de exemplo para iniciar a lista se estiver vazia
const dadosIniciais = [
  {
    nome: "Maria Oliveira",
    telefone: "(11) 98888-1111",
    bairro: "Rua das Flores, 45 - Centro",
    atividade: "Reunião Comunitária",
    solicitacao: "Solicitou iluminação na rua."
  },
  {
    nome: "João dos Santos",
    telefone: "(11) 97777-2222",
    bairro: "Av. Principal, 102 - Bairro Alto",
    atividade: "Cesta Básica / Benefício",
    solicitacao: "Cadastro para auxílio alimentação."
  }
];

// 2. INICIALIZAÇÃO AO CARREGAR A PÁGINA
window.onload = function() {
  carregarDados();
  atualizarTabela();
};

// Carrega dados do localStorage ou insere dados de teste
function carregarDados() {
  const dadosSalvos = localStorage.getItem("moradores_assoc");
  if (dadosSalvos) {
    moradores = JSON.parse(dadosSalvos);
  } else {
    moradores = dadosIniciais;
    salvarDados();
  }
}

// Salva a lista atual de moradores no localStorage
function salvarDados() {
  localStorage.setItem("moradores_assoc", JSON.stringify(moradores));
}

// 3. EVENTO DE SUBMISSÃO DO FORMULÁRIO (CADASTRAR OU EDITAR)
document.getElementById("form-morador").addEventListener("submit", function(event) {
  event.preventDefault(); // Impede o recarregamento da página ao enviar o formulário

  // Pegar valores dos campos
  const index = document.getElementById("index-edicao").value;
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const bairro = document.getElementById("bairro").value;
  const atividade = document.getElementById("atividade").value;
  const solicitacao = document.getElementById("solicitacao").value;

  // Criar objeto do morador
  const moradorObj = { nome, telefone, bairro, atividade, solicitacao };

  if (index === "") {
    // Se index está vazio, estamos CADASTRANDO um novo morador
    moradores.push(moradorObj);
  } else {
    // Se tem index, estamos EDITANDO um morador existente
    moradores[index] = moradorObj;
  }

  salvarDados();
  atualizarTabela();
  limparFormulario();
});

// 4. ATUALIZAR A TABELA NA TELA
function atualizarTabela(listaParaExibir = moradores) {
  const tbody = document.getElementById("tabela-corpo");
  tbody.innerHTML = ""; // Limpa a tabela antes de desenhar

  if (listaParaExibir.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #777;">Nenhum morador encontrado.</td></tr>`;
    return;
  }

  // Percorre cada morador e cria a linha na tabela
  listaParaExibir.forEach(function(morador) {
    // Descobre o índice original na lista principal para edição/exclusão corretas
    const indexOriginal = moradores.indexOf(morador);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${morador.nome}</strong></td>
      <td>${morador.telefone}</td>
      <td>${morador.bairro}</td>
      <td>${morador.atividade}</td>
      <td>${morador.solicitacao || '-'}</td>
      <td>
        <button class="btn-editar" onclick="prepararEdicao(${indexOriginal})">Editar</button>
        <button class="btn-excluir" onclick="excluirMorador(${indexOriginal})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 5. EDITAR MORADOR (Preenche o formulário com os dados)
function prepararEdicao(index) {
  const morador = moradores[index];

  document.getElementById("index-edicao").value = index;
  document.getElementById("nome").value = morador.nome;
  document.getElementById("telefone").value = morador.telefone;
  document.getElementById("bairro").value = morador.bairro;
  document.getElementById("atividade").value = morador.atividade;
  document.getElementById("solicitacao").value = morador.solicitacao;

  // Alterar interface do formulário para modo de edição
  document.getElementById("titulo-form").innerText = "Editar Morador";
  document.getElementById("btn-salvar").innerText = "Atualizar Morador";
  document.getElementById("btn-cancelar").style.display = "inline-block";

  // Rola suavemente até o formulário
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. LIMPAR FORMULÁRIO E CANCELAR EDIÇÃO
function limparFormulario() {
  document.getElementById("form-morador").reset();
  document.getElementById("index-edicao").value = "";

  document.getElementById("titulo-form").innerText = "Cadastrar Novo Morador";
  document.getElementById("btn-salvar").innerText = "Salvar Morador";
  document.getElementById("btn-cancelar").style.display = "none";
}

// 7. EXCLUIR MORADOR
function excluirMorador(index) {
  const morador = moradores[index];
  if (confirm(`Tem certeza que deseja excluir o cadastro de ${morador.nome}?`)) {
    moradores.splice(index, 1); // Remove 1 item do array no índice especificado
    salvarDados();
    atualizarTabela();
    limparFormulario();
  }
}

// 8. FILTRAR / BUSCAR MORADORES
function filtrarMoradores() {
  const termoBusca = document.getElementById("input-busca").value.toLowerCase();

  const moradoresFiltrados = moradores.filter(function(morador) {
    const nomeMatch = morador.nome.toLowerCase().includes(termoBusca);
    const telMatch = morador.telefone.toLowerCase().includes(termoBusca);
    const bairroMatch = morador.bairro.toLowerCase().includes(termoBusca);

    return nomeMatch || telMatch || bairroMatch;
  });

  atualizarTabela(moradoresFiltrados);
}