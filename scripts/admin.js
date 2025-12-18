import { CKEDITOR } from "ckeditor4.js";
import { app, db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Authentication
const auth = getAuth(app);

const ADMINS = [
  "luiotv2302@gmail.com",
  "n.nandcchi@gmail.com",
  "alinexyz1811@gmail.com"
];

// Protege o painel dos admin's
onAuthStateChanged(auth, (user) => {
  if (!user || !ADMINS.includes(user.email)) {
    window.location.href = "/pages/login/login.html";
  }
});

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btnLogout");

  if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
      e.preventDefault(); 

      try {
        await signOut(auth);
        window.location.href = "/pages/login/login.html";
      } catch (err) {
        console.error("Erro ao sair:", err);
      }
    });
  }
});

// Elementos
const btnAdd = document.getElementById("btnAdd");
const btnFechar = document.getElementById("btnFechar");
const formUsuario = document.getElementById("formUsuario");
const modalOverlay = document.getElementById("modalOverlay");

const empty = document.getElementById("nenhum-post");
const postGrid = document.getElementById("postGrid");

const AdminName = document.getElementById("Admin");
const postTitle = document.getElementById("titulo");
const AutorName = document.getElementById("AutorName");
const URLimg = document.getElementById("URLimg");
const AboutPoesy = document.getElementById("AboutPoesy");
const assunto = document.getElementById("esconde");
const rank = document.getElementById("rank");

let editId = null;

// Modal
btnAdd?.addEventListener("click", () => {
  formUsuario.reset();
  editId = null;
  modalOverlay.classList.add("active");
});

btnFechar?.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
  formUsuario.reset();
  editId = null;
});

// CKEDITOR
document.addEventListener("DOMContentLoaded", () => {
  if (window.CKEDITOR) {
    CKEDITOR.replace("assunto");

    CKEDITOR.instances.assunto.on("change", function () {
      assunto.innerHTML = CKEDITOR.instances.assunto.getData();
    });
  }
});

// Listar posts
async function listarPosts(filtro = "") {
  try {
    const snapshot = await getDocs(collection(db, "posts"));
    const posts = [];

    snapshot.forEach(docSnap => {
      posts.push({ id: docSnap.id, ...docSnap.data() });
    });

    const q = filtro.trim().toLowerCase();

    const filtrados = posts.filter(p =>
      (p.Admin || "").toLowerCase().includes(q) ||
      (p.Title || "").toLowerCase().includes(q) ||
      (p.NomeAutor || "").toLowerCase().includes(q) ||
      (p.Assunto || "").toLowerCase().includes(q)
    );

    postGrid.innerHTML = "";

    if (!filtrados.length) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    filtrados.forEach(p => {
      const card = document.createElement("div");
      card.className = "post-admin";

      card.innerHTML = `
        ${p.URL ? `<img src="${p.URL}" alt="${p.Title || ""}">` : ""}
        <h3>${p.Title || "Nome da poesia"}</h3>
        <p>${p.NomeAutor || "Autor"}</p>

        <div class="post-details">
          <p><i class="fa-regular fa-calendar"></i> ${p.Data || ""}</p>
          <p> • </p>
          <p><i class="fa-solid fa-circle-user"></i> ${p.Admin || ""}</p>
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

      // Editar post
      card.querySelector(".edit").onclick = () => {
        AdminName.value = p.Admin || "";
        postTitle.value = p.Title || "";
        AutorName.value = p.NomeAutor || "";
        URLimg.value = p.URL || "";
        AboutPoesy.value = p.Sobre || "";
        rank.value = p.Rank || "";
        assunto.innerHTML = p.Assunto || "";

        if (CKEDITOR.instances.assunto) {
          CKEDITOR.instances.assunto.setData(assunto.innerHTML);
        }

        editId = p.id;
        modalOverlay.classList.add("active");
      };

      // Excluir post
      card.querySelector(".delete").onclick = async () => {
        if (confirm(`Excluir "${p.Title}"?`)) {
          await deleteDoc(doc(db, "posts", p.id));
          listarPosts();
        }
      };

      postGrid.appendChild(card);
    });

  } catch (err) {
    console.error("Erro ao listar posts:", err);
  }
}

// Salvar post ou atualizar post
formUsuario?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pub = {
    Admin: AdminName.value.trim(),
    Title: postTitle.value.trim(),
    NomeAutor: AutorName.value.trim(),
    URL: URLimg.value.trim(),
    Assunto: assunto.innerHTML,
    Sobre: AboutPoesy.value.trim(),
    Rank: rank.value.trim(),
    Data: new Date().toLocaleDateString("pt-BR")
  };

  try {
    if (editId) {
      await updateDoc(doc(db, "posts", editId), pub);
    } else {
      await addDoc(collection(db, "posts"), pub);
    }

    modalOverlay.classList.remove("active");
    formUsuario.reset();
    editId = null;
    listarPosts();

  } catch (err) {
    console.error("Erro ao salvar:", err);
  }
});

listarPosts();