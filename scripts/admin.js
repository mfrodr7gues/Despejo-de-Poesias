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

const empty = document.getElementById("nenhum-post");
const postGrid = document.getElementById("postGrid");

async function listarPosts(filtro = "") {
  try {
    const res = await fetch(API_URL);
    const posts = await res.json();

    const q = filtro.trim().toLowerCase();
    const filtrados = posts.filter((p) =>
      (p.Autor || "").toLowerCase().includes(q) ||
      (p.Title || "").toLowerCase().includes(q) ||
      (p.Categoria || "").toLowerCase().includes(q) ||
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
        <p>${p.Autor || "Nome do autor"}</p>
        
        <div class="post-details">
          <p class="icon-data-post"><i class="fa-regular fa-calendar fa-lg"></i> ${p.Data || p.date || ""}</p>
          <p class="icon-pontinho-post"> • </p>
          <p class="icon-autor-post"><i class="fa-solid fa-circle-user"></i> ${p.Autor || ""}</p>
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
        autName.value = p.Autor || "";
        postTitle.value = p.Title || "";
        postCate.value = p.Categoria || "";
        URLimg.value = p.URL || "";
        assunto.value = p.Assunto || "";
        editId = p.id ?? p._id ?? null;
        modalOverlay.classList.add("active");
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

const autName = document.getElementById("autorName");
const postTitle = document.getElementById("titulo");
const postCate = document.getElementById("categoria");
const URLimg = document.getElementById("URLimg");
const assunto = document.getElementById("assunto");

formUsuario.onsubmit = async (e) => {
  e.preventDefault();
  const pub = {
    Autor: autName.value.trim(),
    Title: postTitle.value.trim(),
    Categoria: postCate.value.trim(),
    URL: URLimg.value.trim(),
    Assunto: assunto.value.trim()
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
