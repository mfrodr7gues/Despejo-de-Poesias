// pegar o ID da URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// buscar o post no json-server
fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
        
        // preencher os elementos da página
        document.getElementById("post-img").src = post.URL;
        document.getElementById("post-title").textContent = post.Title;
        document.getElementById("post-author").textContent = "Autor: " + post.Author;
        document.getElementById("post-date").textContent = "Publicado em: " + post.Date;
        document.getElementById("post-content").textContent = post.Content;
        
    })
    .catch(err => {
        document.body.innerHTML = "<h1>Post não encontrado 😭</h1>";
    });
