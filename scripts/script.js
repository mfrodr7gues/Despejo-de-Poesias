const API_URL = "http://localhost:3000/posts";

async function LoadNews() {
    const response = await fetch(API_URL);
    const noticia = await response.json();

    console.log(noticia);
}

LoadNews();