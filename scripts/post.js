import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Pegar id da URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.body.innerHTML = "<h1>Post não encontrado :/</h1>";
  throw new Error("ID não encontrado na URL");
}

// Carregar post
async function carregarPost() {
  try {
    const ref = doc(db, "posts", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error("Post não existe");
    }

    const post = { id: snapshot.id, ...snapshot.data() };

    document.getElementById("post-img").src = post.URL;
    document.getElementById("post-category").innerText = post.NomeAutor;
    document.getElementById("post-title").innerHTML = post.Title;
    document.getElementById("post-author").innerHTML = post.Admin;
    document.getElementById("post-date").innerHTML = "Publicado em: " + post.Data;
    document.getElementById("estrofe").innerHTML = post.Assunto;
    document.getElementById("AbtPoContent").innerHTML = post.Sobre;

    carregarRecomendados(post);

  } catch (error) {
    console.error(error);
    document.body.innerHTML = "<h1>Post não encontrado :/</h1>";
  }
}

carregarPost();

// Posts recomendados
async function carregarRecomendados(postAtual) {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = [];

    querySnapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    const grid = document.querySelector(".semelhantes-grid");
    grid.innerHTML = "";

    const semelhantes = posts.filter(p =>
      p.NomeAutor?.toLowerCase() === postAtual.NomeAutor?.toLowerCase() &&
      p.id !== postAtual.id
    );

    const recomendados = semelhantes.slice(0, 3);

    if (recomendados.length === 0) {
      grid.innerHTML = `<p>Nenhuma poesia semelhante encontrada :/</p>`;
      grid.style.marginLeft = "30px";
      return;
    }

    recomendados.forEach(p => {
      grid.innerHTML += `
        <article class="poesia-semelhante" onclick="location.href='post.html?id=${p.id}'">
          <div class="semelhante-categoria">${p.NomeAutor}</div>
          <h4 class="semelhante-title">${p.Title}</h4>
          <div class="semelhante-meta" style="display: flex;">
            <i class="fas fa-feather-alt"></i>
            <span>${p.Admin}</span>
            <div class="details-meta">
              <p class="meta-date">
                <i class="fa-regular fa-calendar fa-lg"></i> ${p.Data}
              </p>
              <p> • </p>
              <p class="meta-time">
                <i class="fa-solid fa-ranking-star"></i> Rank ${p.Rank}
              </p>
            </div>
          </div>
        </article>
      `;
    });

  } catch (error) {
    console.error("Erro ao carregar recomendados:", error);
  }
}