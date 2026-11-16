// Funções usadas em todas as páginas.
// Dados de exemplo das telas. Os pedidos são exportados por JSON.
let produtos = [
    { id: 1, nome: "House Clássico", preco: 24.90, imagem: "https://images.pexels.com/photos/17518459/pexels-photo-17518459.jpeg?auto=compress&cs=tinysrgb&w=500" },
    { id: 2, nome: "Bacon da Casa", preco: 32.90, imagem: "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=500" },
    { id: 3, nome: "Combo House", preco: 39.90, imagem: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=500" },
    { id: 4, nome: "Batata Crocante", preco: 14.90, imagem: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=500&q=85" },
    { id: 5, nome: "Refrigerante de cola", preco: 6.90, imagem: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=500&q=85" },
    { id: 6, nome: "Brownie com Sorvete", preco: 18.90, imagem: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=85" }
];

let icones = "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/";

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function encontrarProduto(id) {
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id === id) {
            return produtos[i];
        }
    }
}

let carrinho = JSON.parse(localStorage.getItem("burger-carrinho")) || [];

function atualizarSacola() {
    let quantidade = 0;
    for (let i = 0; i < carrinho.length; i++) {
        quantidade += carrinho[i].quantidade;
    }
    document.getElementById("quantidade-carrinho").textContent = quantidade;
}

function adicionarProduto(id) {
    let encontrou = false;
    for (let i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === id) {
            carrinho[i].quantidade++;
            encontrou = true;
        }
    }
    if (encontrou === false) {
        carrinho.push({ id: id, quantidade: 1 });
    }
    localStorage.setItem("burger-carrinho", JSON.stringify(carrinho));
    atualizarSacola();
}

let botoesAdicionar = document.querySelectorAll(".adicionar");
for (let i = 0; i < botoesAdicionar.length; i++) {
    botoesAdicionar[i].addEventListener("click", function () {
        adicionarProduto(Number(this.dataset.produto));
    });
}

let botaoTema = document.getElementById("botao-tema");

function aplicarTema(tema) {
    let escuro = tema === "escuro";
    document.body.classList.toggle("escuro", escuro);
    document.getElementById("nome-tema").textContent = escuro ? "Escuro" : "Claro";
    botaoTema.querySelector("img").src = icones + (escuro ? "moon.svg" : "sun.svg");
    botaoTema.setAttribute("aria-pressed", String(escuro));
    botaoTema.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
}

aplicarTema(JSON.parse(localStorage.getItem("burger-tema")) || "claro");

botaoTema.addEventListener("click", function () {
    let tema = document.body.classList.contains("escuro") ? "claro" : "escuro";
    aplicarTema(tema);
    localStorage.setItem("burger-tema", JSON.stringify(tema));
});

if (JSON.parse(localStorage.getItem("burger-sessao"))) {
    let acessoPerfil = document.querySelector(".conta a");
    acessoPerfil.textContent = "Meu perfil";
    acessoPerfil.href = "perfil.html";
}

atualizarSacola();

// Máscaras e campos dos formulários.
// As máscaras retiram letras antes de inserir a pontuação.
function aplicarMascara(campo) {
    let numero = campo.value.replace(/\D/g, "");
    if (campo.id === "cpf") {
        numero = numero.slice(0, 11);
        campo.value = numero.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    if (campo.id === "cep") {
        campo.value = numero.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    }
    if (campo.id === "nascimento") {
        campo.value = numero.slice(0, 8).replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
    }
    if (campo.id === "telefone") {
        numero = numero.slice(0, 11);
        if (numero.length > 10) {
            campo.value = numero.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
        } else {
            campo.value = numero.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
        }
    }
    if (campo.id === "numero") {
        campo.value = numero.slice(0, 6);
    }
}

let camposNumericos = document.querySelectorAll('[inputmode="numeric"]');
for (let i = 0; i < camposNumericos.length; i++) {
    camposNumericos[i].addEventListener("input", function () {
        aplicarMascara(this);
    });
}

let botoesSenha = document.querySelectorAll(".mostrar-senha");
for (let i = 0; i < botoesSenha.length; i++) {
    botoesSenha[i].addEventListener("click", function () {
        let campo = this.parentElement.querySelector("input");
        let mostrar = campo.type === "password";
        campo.type = mostrar ? "text" : "password";
        this.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
        this.setAttribute("aria-pressed", String(mostrar));
        this.querySelector("img").src = icones + (mostrar ? "eye-off.svg" : "eye.svg");
    });
}

function pegarDadosFormulario() {
    // O site guarda apenas os dados demonstrativos, sem a senha.
    return {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value,
        nascimento: document.getElementById("nascimento").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value.trim(),
        cep: document.getElementById("cep").value,
        endereco: document.getElementById("endereco").value.trim(),
        numero: document.getElementById("numero").value,
        complemento: document.getElementById("complemento").value.trim()
    };
}

// Página de cadastro.
if (document.getElementById("formulario-cadastro")) {
    document.getElementById("formulario-cadastro").addEventListener("submit", function (evento) {
        evento.preventDefault();
        let usuario = pegarDadosFormulario();
        localStorage.setItem("burger-usuario", JSON.stringify(usuario));
        localStorage.setItem("burger-sessao", "true");
        window.location.href = "perfil.html";
    });
}

// Página de login.
if (document.getElementById("formulario-login")) {
    document.getElementById("formulario-login").addEventListener("submit", function (evento) {
        evento.preventDefault();
        let email = document.getElementById("email").value.trim().toLowerCase();
        let usuario = JSON.parse(localStorage.getItem("burger-usuario")) || {};
        let mensagem = document.getElementById("mensagem-login");
        if (!usuario.email || email !== usuario.email.toLowerCase()) {
            mensagem.textContent = "Use o e-mail do seu cadastro ou crie uma conta.";
            mensagem.hidden = false;
            return;
        }
        // O login do site é local; os pedidos são integrados ao C# por JSON.
        localStorage.setItem("burger-sessao", "true");
        window.location.href = "perfil.html";
    });

    document.getElementById("esqueci-senha").addEventListener("click", function () {
        let mensagem = document.getElementById("mensagem-login");
        mensagem.textContent = "A recuperação de senha não está disponível nesta demonstração.";
        mensagem.hidden = false;
    });
}

// Página de cardapio.
if (document.getElementById("busca")) {
    let busca = document.getElementById("busca");
    let filtros = document.querySelectorAll(".filtro");
    let cartoes = document.querySelectorAll(".produto");
    let categoriaAtual = "Todos";

    function filtrarProdutos() {
        let quantidade = 0;
        let termo = busca.value.trim().toLowerCase();
        for (let i = 0; i < cartoes.length; i++) {
            let categoria = cartoes[i].dataset.categoria;
            let nome = cartoes[i].dataset.nome.toLowerCase();
            let correspondeCategoria = categoriaAtual === "Todos" || categoria === categoriaAtual;
            let correspondeBusca = nome.includes(termo);
            cartoes[i].hidden = !(correspondeCategoria && correspondeBusca);
            if (cartoes[i].hidden === false) {
                quantidade++;
            }
        }
        let palavra = quantidade === 1 ? " produto" : " produtos";
        document.getElementById("resultado").textContent = quantidade + palavra + " · Feitos na hora, do seu jeito.";
        document.getElementById("sem-produtos").hidden = quantidade !== 0;
    }

    busca.addEventListener("input", filtrarProdutos);

    for (let i = 0; i < filtros.length; i++) {
        filtros[i].addEventListener("click", function () {
            categoriaAtual = this.dataset.categoria;
            for (let j = 0; j < filtros.length; j++) {
                let selecionado = filtros[j] === this;
                filtros[j].classList.toggle("selecionado", selecionado);
                filtros[j].setAttribute("aria-pressed", String(selecionado));
            }
            filtrarProdutos();
        });
    }
}

// Página de carrinho.
if (document.getElementById("itens-carrinho")) {
    let listaCarrinho = document.getElementById("itens-carrinho");
    let subtotal = 0;

    function mostrarCarrinho() {
        listaCarrinho.innerHTML = "";
        subtotal = 0;
        let quantidade = 0;
        for (let i = 0; i < carrinho.length; i++) {
            let item = carrinho[i];
            let produto = encontrarProduto(item.id);
            let valor = produto.preco * item.quantidade;
            subtotal += valor;
            quantidade += item.quantidade;

            listaCarrinho.innerHTML += `
                <article class="caixa item-carrinho">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <div>
                        <h3>${produto.nome}</h3>
                        <p class="valor-unidade">${formatarPreco(produto.preco)} / unidade</p>
                        <div class="quantidade" aria-label="Quantidade de ${produto.nome}">
                            <button type="button" data-id="${item.id}" data-acao="diminuir" aria-label="Diminuir ${produto.nome}">
                                <img class="icone" src="${icones}minus.svg" alt="">
                            </button>
                            <span>${item.quantidade}</span>
                            <button type="button" data-id="${item.id}" data-acao="aumentar" aria-label="Aumentar ${produto.nome}">
                                <img class="icone" src="${icones}plus.svg" alt="">
                            </button>
                        </div>
                        <strong class="preco-item">${formatarPreco(valor)}</strong>
                    </div>
                    <button class="remover" type="button" data-id="${item.id}" data-acao="remover" aria-label="Remover ${produto.nome}">Remover</button>
                </article>
            `;
        }

        let entrega = carrinho.length > 0 ? 5 : 0;
        let palavra = quantidade === 1 ? " item no seu pedido" : " itens no seu pedido";
        document.getElementById("total-itens").textContent = quantidade + palavra;
        document.getElementById("subtotal").textContent = formatarPreco(subtotal);
        document.getElementById("taxa").textContent = formatarPreco(entrega);
        document.getElementById("total").textContent = formatarPreco(subtotal + entrega);
        document.getElementById("finalizar").disabled = quantidade === 0;

        if (quantidade === 0) {
            listaCarrinho.innerHTML = "<p>Seu carrinho está vazio. Escolha um produto no cardápio.</p>";
        }

        let botoes = listaCarrinho.querySelectorAll("button");
        for (let i = 0; i < botoes.length; i++) {
            botoes[i].addEventListener("click", function () {
                alterarQuantidade(Number(this.dataset.id), this.dataset.acao);
            });
        }
        atualizarSacola();
    }

    function alterarQuantidade(id, acao) {
        for (let i = 0; i < carrinho.length; i++) {
            if (carrinho[i].id === id) {
                if (acao === "aumentar") {
                    carrinho[i].quantidade++;
                }
                if (acao === "diminuir" && carrinho[i].quantidade > 1) {
                    carrinho[i].quantidade--;
                }
                if (acao === "remover") {
                    carrinho.splice(i, 1);
                }
                break;
            }
        }
        localStorage.setItem("burger-carrinho", JSON.stringify(carrinho));
        mostrarCarrinho();
    }

    let usuario = JSON.parse(localStorage.getItem("burger-usuario")) || {};
    let endereco = "";
    if (usuario.nome && usuario.endereco) {
        document.getElementById("destinatario").textContent = "Entregar para " + usuario.nome;
        endereco = usuario.endereco + ", " + usuario.numero;
        if (usuario.complemento) {
            endereco += " · " + usuario.complemento;
        }
        endereco += " · CEP " + usuario.cep;
        document.getElementById("endereco-entrega").textContent = endereco;
    }

    document.getElementById("finalizar").addEventListener("click", function () {
        if (carrinho.length === 0) {
            return;
        }
        let mensagem = document.getElementById("mensagem-carrinho");
        mensagem.hidden = false;
        if (!JSON.parse(localStorage.getItem("burger-sessao"))) {
            mensagem.textContent = "Faça login antes de finalizar o pedido.";
            return;
        }
        if (!usuario.nome || !usuario.telefone || !usuario.endereco || !usuario.numero || !usuario.cep) {
            mensagem.textContent = "Preencha seus dados de entrega no perfil.";
            return;
        }
        let numero = Number(localStorage.getItem("burger-numero-pedido")) || 1;
        let agora = new Date();
        let pedido = {
            codigo: "BH-" + agora.getTime(),
            numero: numero,
            data: agora.toLocaleDateString("pt-BR"),
            hora: agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            cliente: usuario.nome,
            telefone: usuario.telefone,
            endereco: endereco,
            itens: carrinho,
            subtotal: Number(subtotal.toFixed(2)),
            taxa: 5,
            total: Number((subtotal + 5).toFixed(2))
        };
        // O Windows Forms recebe este arquivo pelo botão Importar JSON.
        let arquivo = new Blob([JSON.stringify([pedido], null, 4)], { type: "application/json" });
        let link = document.createElement("a");
        let url = URL.createObjectURL(arquivo);
        link.href = url;
        link.download = "pedido-" + pedido.codigo + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        carrinho = [];
        localStorage.setItem("burger-carrinho", JSON.stringify(carrinho));
        localStorage.setItem("burger-numero-pedido", String(numero + 1));
        mostrarCarrinho();
        mensagem.textContent = "Pedido finalizado. Arquivo JSON baixado.";
    });

    mostrarCarrinho();
}

// Página de perfil.
if (document.getElementById("formulario-perfil")) {
    let formularioPerfil = document.getElementById("formulario-perfil");
    let usuario = JSON.parse(localStorage.getItem("burger-usuario")) || {};
    let camposPerfil = formularioPerfil.querySelectorAll("input");

    function atualizarNome() {
        document.getElementById("nome-usuario").textContent = usuario.nome || "Seu nome";
        let nomes = (usuario.nome || "").split(" ");
        let iniciais = nomes[0].charAt(0);
        if (nomes.length > 1) {
            iniciais += nomes[nomes.length - 1].charAt(0);
        }
        document.getElementById("iniciais").textContent = iniciais.toUpperCase();
    }

    for (let i = 0; i < camposPerfil.length; i++) {
        if (camposPerfil[i].id !== "senha") {
            camposPerfil[i].value = usuario[camposPerfil[i].id] || "";
        }
        camposPerfil[i].readOnly = true;
    }

    atualizarNome();

    document.getElementById("editar").addEventListener("click", function () {
        for (let i = 0; i < camposPerfil.length; i++) {
            camposPerfil[i].readOnly = false;
        }
        document.getElementById("nome").focus();
    });

    formularioPerfil.addEventListener("submit", function (evento) {
        evento.preventDefault();
        usuario = pegarDadosFormulario();
        localStorage.setItem("burger-usuario", JSON.stringify(usuario));
        atualizarNome();
        let mensagem = document.getElementById("mensagem-formulario");
        mensagem.textContent = "Dados salvos neste navegador.";
        if (document.getElementById("senha").value !== "") {
            mensagem.textContent += " A alteração de senha é feita no aplicativo C#.";
        }
        mensagem.hidden = false;
        document.getElementById("senha").value = "";
        for (let i = 0; i < camposPerfil.length; i++) {
            camposPerfil[i].readOnly = true;
        }
    });

    document.getElementById("sair").addEventListener("click", function () {
        localStorage.setItem("burger-sessao", "false");
        window.location.href = "login.html";
    });
}
