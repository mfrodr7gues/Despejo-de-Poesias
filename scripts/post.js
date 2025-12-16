const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
        document.getElementById("post-img").src = post.URL;
        document.getElementById("post-category").innerText = post.NomeAutor;
        document.getElementById("post-title").innerHTML = post.Title;
        document.getElementById("post-author").innerHTML = post.Admin;
        document.getElementById("post-date").innerHTML = "Publicado em: " + post.Data;
        document.getElementById("estrofe").innerHTML = post.Assunto;
        document.getElementById("AbtPoContent").innerHTML = post.Sobre;

        carregarRecomendados(post);
    })
    .catch(err => {
        document.body.innerHTML = "<h1> Post não encontrado :/ </h1>";
        grid.style.marginTop = "30px";
        grid.style.marginLeft = "30px";
    });

function carregarRecomendados(post) {
    fetch("http://localhost:3000/posts")
        .then(res => res.json())
        .then(posts => {
            const nomeAutor = post.NomeAutor;

            const semelhantes = posts.filter(p =>
                p.NomeAutor.toLowerCase() === nomeAutor.toLowerCase() && p.id !== post.id
            );

            const recomendados = semelhantes.slice(0, 3);
            const grid = document.querySelector(".semelhantes-grid");

            grid.innerHTML = "";

            if (recomendados.length === 0) {
                grid.innerHTML = `<p> Nenhuma poesia semelhante encontrada :/ </p>`;
                grid.style.marginLeft = "30px";
                return;
            }

            recomendados.forEach(p => {
                grid.innerHTML += `
                    <article class="poesia-semelhante" onclick="location.href='post.html?id=${p.id}'">
                        <div class="semelhante-categoria">${p.NomeAutor}</div>
                        <h4 class="semelhante-title">${p.Title}</h4>
                        <div class="semelhante-meta">
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
        });
}