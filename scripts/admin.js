const API_URL = "http://localhost:3000/posts";

const btnAdd = document.getElementById("btnAdd");
const btnFechar = document.getElementById("btnFechar");
const formUsuario = document.getElementById("formUsuario");

let editId = null;

//Ativa o modal
btnAdd.addEventListener("click", () => {
  formUsuario.reset();
  editId = null;
  modalOverlay.classList.add("active");
});

//Desativa o modal
btnFechar.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    formUsuario.reset();
    editId = null;
});

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
  } catch (err) {
    console.error(err);
  }
};
