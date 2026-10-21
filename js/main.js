// Importa a conexão com o Firebase
import { db } from "./firebase.js";

// Importa as funções do Firestore
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// ELEMENTOS DO HTML

const formItem = document.getElementById("formItem");
const nome = document.getElementById("nome");
const quantidade = document.getElementById("Qtde");
const mensagem = document.getElementById("mensagem");
const listaItens = document.getElementById("ListaItens");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");


// Guarda o ID do item que está sendo editado
let idEdicao = null;


// FUNÇÃO PARA LISTAR OS ITENS

async function carregarItens() {
    try {
        const consulta = await getDocs(
            collection(db, "itens")
        );

        listaItens.innerHTML = "";

        if (consulta.empty) {
            listaItens.textContent = "Nenhum item cadastrado.";
            return;
        }

        consulta.forEach((documento) => {
            const item = documento.data();

            // Cria o cartão
            const card = document.createElement("div");
            card.className = "item-card";

            const titulo = document.createElement("h3");
            const quantidadeItem = document.createElement("p");

            titulo.textContent = item.nome;

            quantidadeItem.textContent =
                `Quantidade: ${item.quantidade}`;

            // Área dos botões
            const acoes = document.createElement("div");
            acoes.className = "acoes";

            // BOTÃO EDITAR
            const btnEditar = document.createElement("button");

            btnEditar.textContent = "Editar";
            btnEditar.type = "button";

            btnEditar.addEventListener("click", () => {
                idEdicao = documento.id;

                nome.value = item.nome;
                quantidade.value = item.quantidade;

                tituloFormulario.textContent = "Editar item";
                btnSalvar.textContent = "Salvar alterações";
                btnCancelar.hidden = false;

                mensagem.textContent =
                    "Altere os dados do item e salve.";

                mensagem.className = "";

                formItem.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            // BOTÃO EXCLUIR
            const btnExcluir = document.createElement("button");

            btnExcluir.textContent = "Excluir";
            btnExcluir.type = "button";
            btnExcluir.className = "btn-excluir";

            btnExcluir.addEventListener("click", async () => {
                await excluirItem(documento.id, item.nome);
            });

            // Adiciona os botões ao cartão
            acoes.appendChild(btnEditar);
            acoes.appendChild(btnExcluir);

            card.appendChild(titulo);
            card.appendChild(quantidadeItem);
            card.appendChild(acoes);

            listaItens.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar itens:", erro);

        listaItens.textContent =
            "Não foi possível carregar os itens.";
    }
}


// FUNÇÃO PARA EXCLUIR UM ITEM

async function excluirItem(id, nomeItem) {
    // Pede confirmação antes de excluir
    const confirmar = confirm(
        `Deseja realmente excluir o item "${nomeItem}"?`
    );

    if (!confirmar) {
        return;
    }

    try {
        // Localiza o documento e exclui do Firestore
        await deleteDoc(doc(db, "itens", id));

        // Se o item excluído estava sendo editado,
        // volta o formulário para o modo de cadastro
        if (idEdicao === id) {
            cancelarEdicao();
        }

        mensagem.textContent =
            "Item excluído com sucesso!";

        mensagem.className = "sucesso";

        // Atualiza a lista na página
        await carregarItens();

    } catch (erro) {
        console.error("Erro ao excluir item:", erro);

        mensagem.textContent =
            "Não foi possível excluir o item.";

        mensagem.className = "erro";
    }
}


// FUNÇÃO PARA CANCELAR A EDIÇÃO

function cancelarEdicao() {
    idEdicao = null;

    formItem.reset();

    tituloFormulario.textContent = "Cadastrar item";
    btnSalvar.textContent = "Cadastrar item";
    btnCancelar.hidden = true;

    mensagem.textContent = "";
    mensagem.className = "";
}


// BOTÃO CANCELAR EDIÇÃO

btnCancelar.addEventListener("click", () => {
    cancelarEdicao();
});


// CADASTRAR OU EDITAR ITEM

formItem.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nomeItem = nome.value.trim();
    const valorQuantidade = Number(quantidade.value);

    // Valida o nome
    if (nomeItem === "") {
        mensagem.textContent = "Digite o nome do item.";
        mensagem.className = "erro";
        return;
    }

    // Valida a quantidade
    if (
        quantidade.value === "" ||
        !Number.isFinite(valorQuantidade) ||
        valorQuantidade < 0 ||
        valorQuantidade > 1000
    ) {
        mensagem.textContent =
            "Digite uma quantidade válida entre 0 e 1000.";

        mensagem.className = "erro";
        return;
    }

    try {
        if (idEdicao !== null) {
            // ATUALIZA ITEM EXISTENTE
            const referencia = doc(
                db,
                "itens",
                idEdicao
            );

            await updateDoc(referencia, {
                nome: nomeItem,
                quantidade: valorQuantidade
            });

        } else {
            // CADASTRA NOVO ITEM
            await addDoc(collection(db, "itens"), {
                nome: nomeItem,
                quantidade: valorQuantidade,
                criadoEm: serverTimestamp()
            });
        }

        // Restaura o formulário
        cancelarEdicao();

        mensagem.textContent = idEdicao === null
            ? "Operação realizada com sucesso!"
            : "Operação realizada com sucesso!";

        mensagem.className = "sucesso";

        await carregarItens();

    } catch (erro) {
        console.error("Erro ao salvar item:", erro);

        mensagem.textContent =
            "Erro ao salvar. Verifique o Firebase.";

        mensagem.className = "erro";
    }
});


// CARREGA OS ITENS AO ABRIR A PÁGINA

carregarItens();