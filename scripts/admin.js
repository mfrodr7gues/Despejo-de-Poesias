const API_URL = "http://localhost:3000/posts";

const btnAdd = document.getElementById("btnAdd");
const btnFechar = document.getElementById("btnFechar");
const formUsuario = document.getElementById("formUsuario");
const modalOverlay = document.getElementById("modalOverlay");

let editId = null;

// Ativa o modal
btnAdd.addEventListener("click", () => {
  formUsuario.reset();
  editId = null;
  modalOverlay.classList.add("active");
});

// Desativa o modal
btnFechar.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
  formUsuario.reset();
  editId = null;
});

// Coisa
document.addEventListener("DOMContentLoaded", () => {
  CKEDITOR.replace("assunto");

  const editor = CKEDITOR.instances.assunto;

  editor.on("instanceReady", function () {
    editor.setData(assunto.value);
  });

  editor.on( 'change', function(evt) {
        var data = evt.editor.getData();
        document.getElementById("esconde").innerHTML = data;
  });
});


const empty = document.getElementById("nenhum-post");
const postGrid = document.getElementById("postGrid");

async function listarPosts(filtro = "") {
  try {
    const res = await fetch(API_URL);
    const posts = await res.json();

    const q = filtro.trim().toLowerCase();
    const filtrados = posts.filter((p) =>
      (p.Admin || "").toLowerCase().includes(q) ||
      (p.Title || "").toLowerCase().includes(q) ||
      (p.NomeAutor || "").toLowerCase().includes(q) ||
      (p.Assunto || "").toLowerCase().includes(q)
    );

    postGrid.innerHTML = "";

    if (filtrados.length === 0) {
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";

    filtrados.forEach((p) => {
      const card = document.createElement("div");
      card.className = "post-admin";
      card.innerHTML = `
        ${p.URL ? `<img src="${p.URL}" alt="${p.Title || 'Imagem da Publicação'}">` : ""}
        <h3>${p.Title || "Nome da poesia"}</h3>
        <p>${p.NomeAutor || "Nome do autor"}</p>
        
        <div class="post-details">
          <p class="icon-data-post"><i class="fa-regular fa-calendar fa-lg"></i> ${p.Data || p.date || ""}</p>
          <p class="icon-pontinho-post"> • </p>
          <p class="icon-autor-post"><i class="fa-solid fa-circle-user"></i> ${p.Admin || ""}</p>
        </div>
        
        <div class="buttons-post-admin">
          <button class="button-editar-post edit">
        <i class="fa-solid fa-feather"></i> Editar
          </button>

          <button class="button-excluir-post delete">
        <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </div>
      `;

      const editBtn = card.querySelector(".edit");
      const deleteBtn = card.querySelector(".delete");

      editBtn.onclick = () => {
        AdminName.value = p.Admin || "";
        postTitle.value = p.Title || "";
        AutorName.value = p.NomeAutor || "";
        URLimg.value = p.URL || "";
        assunto.value = p.Assunto;
        editId = p.id ?? p._id ?? null;
        modalOverlay.classList.add("active");

        CKEDITOR.instances.assunto.setData(assunto.value);
      };

      deleteBtn.onclick = async () => {
        if (confirm(`Excluir "${p.Title || 'este post'}"?`)) {
          try {
            await fetch(`${API_URL}/${p.id ?? p._id}`, { method: "DELETE" });
            listarPosts(filtro);
          } catch (err) {
            console.error(err);
          }
        }
      };

      postGrid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

const AdminName = document.getElementById("Admin");
const postTitle = document.getElementById("titulo");
const AutorName = document.getElementById("AutorName");
const URLimg = document.getElementById("URLimg");
const AboutPoesy = document.getElementById("AboutPoesy");
const assunto = document.getElementById("esconde");
const rank = document.getElementById("rank");

formUsuario.onsubmit = async (e) => {
  e.preventDefault();
  const pub = {
    Admin: AdminName.value.trim(),
    Title: postTitle.value.trim(),
    NomeAutor: AutorName.value.trim(),
    URL: URLimg.value.trim(),
    Assunto: assunto.innerHTML,
    Data: new Date().toLocaleDateString("pt-BR"),
    Rank: rank.value.trim(),
    Sobre: AboutPoesy.value.trim()
  };

  try {
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pub),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pub),
      });
    }

    modalOverlay.classList.remove("active");
    formUsuario.reset();
    listarPosts();
  } catch (err) {
    console.error(err);
  }
};

// Carrega a lista inicialmente
listarPosts();