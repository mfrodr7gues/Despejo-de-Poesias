const API_URL = "http://localhost:3000/posts";

carregarPosts();

async function carregarPosts() {
    try {
        const req = await fetch(API_URL);
        const posts = await req.json();

        if (!posts.length) {
            mostrarEstadoVazio();
            return;
        }

        const destaque = posts.find(p => Number(p.Rank) === 1);
        const populares = posts.filter(p => Number(p.Rank) === 2).slice(0, 3);
        const comuns = posts.filter(p => Number(p.Rank) >= 3);

        preencherDestaque(destaque);
        preencherPopulares(populares);
        preencherComuns(comuns);

    } catch (err) {
        console.error("Erro ao carregar posts:", err);
    }
}

/* DESTAQUE */

function preencherDestaque(post) {
    const card = document.querySelector(".destaque-card");
    const vazio = document.querySelector(".destaque-vazio");

    if (!card || !vazio) {
        console.error("HTML do destaque não encontrado.");
        return;
    }

    if (!post) {
        card.style.display = "none";
        vazio.style.display = "flex";
        return;
    }

    document.querySelector(".destaque-img").src = post.URL;
    document.querySelector(".destaque-categoria").textContent = post.Categoria;
    document.querySelector(".destaque-titulo").textContent = post.Title;
    document.querySelector(".destaque-assunto").textContent = post.Assunto;
    document.querySelector(".destaque-data").textContent = post.Data;

    // ⭐ ADICIONAR NAVEGAÇÃO PARA O POST
    card.onclick = () => {
        window.location.href = `/pages/blog/post-vazio.html?id=${post.id}`;
    };

    vazio.style.display = "none";
    card.style.display = "flex";
}

/* POPULARES */

function preencherPopulares(posts) {
    const container = document.querySelector(".miniArticles-super");
    const vazio = document.querySelector(".popular-vazio");

    if (!container || !vazio) {
        console.error("HTML dos populares não encontrado.");
        return;
    }

    if (!posts.length) {
        container.style.display = "none";
        vazio.style.display = "flex";
        return;
    }

    vazio.style.display = "none";
    container.style.display = "block";
    container.innerHTML = "";

    posts.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("miniArticles");

        div.innerHTML = `
            <img src="${post.URL}" alt="">
            <div class="MAContent">
                <div class="MACategory">${post.Categoria}</div>
                <div class="MATitle">${post.Title}</div>
                <div class="dateMArticles">
                    <i class="fa-regular fa-clock"></i>
                    <span>${post.Data}</span>
                </div>
            </div>
        `;

        // ⭐ NAVEGAR PARA O POST
        div.onclick = () => {
            window.location.href = `/pages/blog/post-vazio.html?id=${post.id}`;
        };

        container.appendChild(div);
    });
}

/* COMUNS */

function preencherComuns(posts) {
    const container = document.querySelector(".poesias");
    const vazio = document.querySelector(".poesias-vazio");

    if (!container || !vazio) {
        console.error("HTML das poesias comuns não encontrado.");
        return;
    }

    if (!posts.length) {
        container.style.display = "none";
        vazio.style.display = "flex";
        return;
    }

    vazio.style.display = "none";
    container.style.display = "grid";
    container.innerHTML = "";

    posts.forEach(post => {
        const card = document.createElement("div");
        card.classList.add("poesia");

        card.innerHTML = `
            <img src="${post.URL}" alt="">
            <div class="PContent">
                <div class="PCategory">${post.Categoria}</div>
                <div class="PTitle">${post.Title}</div>
                <p>${post.Assunto}</p>
                <div class="datePoesias">
                    <i class="fa-regular fa-clock"></i>
                    <span>${post.Data}</span>
                </div>
            </div>
        `;

        // ⭐ NAVEGAR PARA O POST
        card.onclick = () => {
            window.location.href = `/pages/blog/post-vazio.html?id=${post.id}`;
        };

        container.appendChild(card);
    });
}

/* VAZIOS */

function mostrarEstadoVazio() {
    document.querySelector(".destaque-card")?.style?.setProperty("display", "none");
    document.querySelector(".destaque-vazio")?.style?.setProperty("display", "flex");

    document.querySelector(".miniArticles-super")?.style?.setProperty("display", "none");
    document.querySelector(".popular-vazio")?.style?.setProperty("display", "flex");

    document.querySelector(".poesias")?.style?.setProperty("display", "none");
    document.querySelector(".poesias-vazio")?.style?.setProperty("display", "flex");
}
