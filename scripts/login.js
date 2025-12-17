import { app } from "./firebase.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);

const ADMINS = [
  "luiotv2302@gmail.com",
  "n.nandcchi@gmail.com",
  "alinexyz1811@gmail.com"
];

// Elementos
const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const senhaLabel = document.getElementById("Slabel");

const erro = document.createElement("p");
erro.style.color = "#ff6868ff";
erro.style.marginTop = "10px";
erro.style.fontSize = "14px";
form.appendChild(erro);

onAuthStateChanged(auth, (user) => {
  if (user && ADMINS.includes(user.email)) {
    window.location.href = "/pages/admin/admin-vazio.html";
  }
});

// Login
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  erro.textContent = "";
  senhaInput.style.borderBottom = "";
  senhaLabel.style.color = "";

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    erro.textContent = "Preencha o e-mail e a senha.";
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, senha);

    if (!ADMINS.includes(cred.user.email)) {
      erro.textContent = "Este usuário não é administrador.";
      return;
    }

    window.location.href = "/pages/admin/admin-vazio.html";

  } catch (err) {
    erro.textContent = "E-mail ou senha inválidos.";
    senhaInput.style.borderBottom = "2px solid #ff6868ff";
    senhaLabel.style.color = "#ff6868ff";
    console.error(err);
  }
});

// Mostrar e esconder senha
window.mostrarSenha = function () {
  senhaInput.type =
    senhaInput.type === "password" ? "text" : "password";
};