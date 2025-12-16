const form = document.getElementById("form-contato");
const feedback = document.getElementById("erro-form");

const nome = document.getElementById("nome");
const email = document.getElementById("email");
const mensagem = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo = "erro") {
  feedback.textContent = texto;
  feedback.className = `feedback-form show ${tipo}`;

  if (tipo === "sucesso") {
    setTimeout(() => {
      feedback.classList.remove("show");
    }, 10000);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedback.className = "feedback-form";

  if (!nome.value.trim()) {
    mostrarMensagem("Ops… Tu não digitastes teu nome :/");
    return;
  }

  if (!email.value.trim() || !email.value.includes("@")) {
    mostrarMensagem("Digite um e-mail válido.");
    return;
  }

  if (!mensagem.value.trim()) {
    mostrarMensagem("Ops... Parece que você não escreveu nenhuma mensagem :/");
    return;
  }

  const assuntos = [];
  if (document.getElementById("ajuda").checked) assuntos.push("Ajuda");
  if (document.getElementById("sugestao").checked) assuntos.push("Sugestão");
  if (document.getElementById("feedback").checked) assuntos.push("Feedback");

  const contato = {
    nome: nome.value,
    email: email.value,
    assuntos,
    mensagem: mensagem.value,
    data: new Date().toISOString()
  };

  try {
    const response = await fetch("http://localhost:3000/contatos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contato)
    });

    if (!response.ok) throw new Error();

    mostrarMensagem("Mensagem enviada com sucesso <3", "sucesso");
    form.reset();

  } catch (error) {
    mostrarMensagem("Ops... Erro ao enviar mensagem :/");
    console.error(error);
  }
});

form.addEventListener("input", () => {
  feedback.classList.remove("show");
});
