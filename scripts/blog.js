const API_URL = "http://localhost:3000/posts";

let todosPosts = [];
let poesiasComuns = [];

carregarPosts();

/* Carregar posts*/
async function carregarPosts() {
  try {
    const req = await fetch(API_URL);
    const posts = await req.json();

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
  }
}

/* Pesquisar poesias */
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

/* Destaque */
function preencherDestaque(post) {
  const card = document.querySelector(".destaque-card");
  const vazio = document.querySelector(".destaque-vazio");

  if (!card || !vazio) return;

  if (!post) {
    card.style.display = "none";
    vazio.style.display = "flex";
    return;
  }

  const postId = post.id ?? post._id;

  document.querySelector(".destaque-img").src = post.URL || "";
  document.querySelector(".destaque-categoria").textContent = (post.NomeAutor || "").toUpperCase();
  document.querySelector(".destaque-titulo").textContent = post.Title || "";
  document.querySelector(".destaque-data").textContent = post.Data || "";

  card.onclick = () => {
    window.location.href = `/pages/blog/post.html?id=${postId}`;
  };

  vazio.style.display = "none";
  card.style.display = "flex";
}

/* Populares */
function preencherPopulares(posts) {
  const container = document.querySelector(".miniArticles-super");
  const vazio = document.querySelector(".popular-vazio");

  if (!container || !vazio) return;

  if (!posts.length) {
    container.style.display = "none";
    vazio.style.display = "flex";
    return;
  }

  vazio.style.display = "none";
  container.style.display = "block";
  container.innerHTML = "";

  posts.forEach(post => {
    const postId = post.id ?? post._id;

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
      window.location.href = `/pages/blog/post.html?id=${postId}`;
    };

    container.appendChild(div);
  });
}

/* Comuns */
function preencherComuns(posts) {
  const container = document.querySelector(".poesias");
  const vazio = document.querySelector(".poesias-vazio");

  if (!container || !vazio) return;

  container.innerHTML = "";

  if (!posts.length) {
    container.style.display = "none";
    vazio.style.display = "flex";
    vazio.innerHTML = `<p> Ops... Nenhuma poesia encontrada :/ </p>`;
    return;
  }

  vazio.style.display = "none";
  container.style.display = "grid";

  posts.forEach(post => {
    const postId = post.id ?? post._id;

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
      window.location.href = `/pages/blog/post.html?id=${postId}`;
    };

    container.appendChild(card);
  });
}

/* Vazios */
function mostrarEstadoVazio() {
  document.querySelector(".destaque-card")?.style?.setProperty("display", "none");
  document.querySelector(".destaque-vazio")?.style?.setProperty("display", "flex");

  document.querySelector(".miniArticles-super")?.style?.setProperty("display", "none");
  document.querySelector(".popular-vazio")?.style?.setProperty("display", "flex");

  document.querySelector(".poesias")?.style?.setProperty("display", "none");
  document.querySelector(".poesias-vazio")?.style?.setProperty("display", "flex");
}