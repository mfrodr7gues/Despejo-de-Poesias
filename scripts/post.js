// pegar o ID da URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// buscar o post no json-server
fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
        
        // preencher os elementos da página
        document.getElementById("post-img").src = post.URL;
        document.getElementById("post-category").innerText = post.Categoria;
        document.getElementById("post-title").innerHTML = post.Title;
        document.getElementById("post-author").innerHTML = post.Autor;
        document.getElementById("post-date").innerHTML = "Publicado em: " + post.Data;
        document.getElementById("estrofe").innerHTML = post.Assunto;
        
    })
    .catch(err => {
        document.body.innerHTML = "<h1>Post não encontrado 😭</h1>";
    });
