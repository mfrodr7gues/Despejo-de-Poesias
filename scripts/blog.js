import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let todosPosts = [];
let poesiasComuns = [];

carregarPosts();

// Carregar posts 
async function carregarPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = [];

    querySnapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    if (!posts.length) {
      mostrarEstadoVazio();
      return;
    }

    todosPosts = posts;

    const destaque = posts.find(p => Number(p.Rank) === 1);
    const populares = posts.filter(p => Number(p.Rank) === 2).slice(0, 3);
    poesiasComuns = posts.filter(p => Number(p.Rank) >= 3);

    preencherDestaque(destaque);
    preencherPopulares(populares);
    preencherComuns(poesiasComuns);
    pesquisarPoesias();

  } catch (err) {
    console.error("Erro ao carregar posts:", err);
    mostrarEstadoVazio();
  }
}

// Pesquisar por poesias ou autores
function pesquisarPoesias() {
  const campoBusca = document.getElementById("pesquisa-poesia");
  if (!campoBusca) return;

  campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase().trim();

    if (!termo) {
      preencherComuns(poesiasComuns);
      return;
    }

    const filtrados = poesiasComuns.filter(post =>
      (post.Title || "").toLowerCase().includes(termo) ||
      (post.NomeAutor || "").toLowerCase().includes(termo)
    );

    preencherComuns(filtrados);
  });
}

/* ==========================
   DESTAQUE
========================== */
function preencherDestaque(post) {
  const card = document.querySelector(".destaque-card");
  const vazio = document.querySelector(".destaque-vazio");

  if (!card || !vazio) return;

  if (!post) {
    card.style.display = "none";
    vazio.style.display = "flex";
    return;
  }

  document.querySelector(".destaque-img").src = post.URL || "";
  document.querySelector(".destaque-categoria").textContent =
    (post.NomeAutor || "").toUpperCase();
  document.querySelector(".destaque-titulo").textContent = post.Title || "";
  document.querySelector(".destaque-data").textContent = post.Data || "";

  card.onclick = () => {
    window.location.href = `/pages/blog/post.html?id=${post.id}`;
  };

  vazio.style.display = "none";
  card.style.display = "flex";
}

/* ==========================
   POPULARES
========================== */
function preencherPopulares(posts) {
  const container = document.querySelector(".miniArticles-super");
  const vazio = document.querySelector(".popular-vazio");

  if (!container || !vazio) return;

  if (!posts.length) {
    container.style.display = "none";
    vazio.style.display = "flex";
    return;
  }

  container.style.display = "block";
  vazio.style.display = "none";
  container.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("miniArticles");

    div.innerHTML = `
      <img src="${post.URL || ""}" alt="">
      <div class="MAContent">
        <div class="MACategory">${(post.NomeAutor || "").toUpperCase()}</div>
        <div class="MATitle">${post.Title || ""}</div>
        <div class="dateMArticles">
          <i class="fa-regular fa-clock"></i>
          <span>${post.Data || ""}</span>
        </div>
      </div>
    `;

    div.onclick = () => {
      window.location.href = `/pages/blog/post.html?id=${post.id}`;
    };

    container.appendChild(div);
  });
}

/* ==========================
   COMUNS
========================== */
function preencherComuns(posts) {
  const container = document.querySelector(".poesias");
  const vazio = document.querySelector(".poesias-vazio");

  if (!container || !vazio) return;

  container.innerHTML = "";

  if (!posts.length) {
    container.style.display = "none";
    vazio.style.display = "flex";
    vazio.innerHTML = `<p>Ops... Nenhuma poesia encontrada :/</p>`;
    return;
  }

  vazio.style.display = "none";
  container.style.display = "grid";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.classList.add("poesia");

    card.innerHTML = `
      <img src="${post.URL || ""}" alt="">
      <div class="PContent">
        <div class="PCategory">${(post.NomeAutor || "").toUpperCase()}</div>
        <div class="PTitle">${post.Title || ""}</div>
        <div class="datePoesias">
          <i class="fa-regular fa-clock"></i>
          <span>${post.Data || ""}</span>
        </div>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `/pages/blog/post.html?id=${post.id}`;
    };

    container.appendChild(card);
  });
}

/* ==========================
   ESTADO VAZIO
========================== */
function mostrarEstadoVazio() {
  document.querySelector(".destaque-card")?.style.setProperty("display", "none");
  document.querySelector(".destaque-vazio")?.style.setProperty("display", "flex");

  document.querySelector(".miniArticles-super")?.style.setProperty("display", "none");
  document.querySelector(".popular-vazio")?.style.setProperty("display", "flex");

  document.querySelector(".poesias")?.style.setProperty("display", "none");
  document.querySelector(".poesias-vazio")?.style.setProperty("display", "flex");
}