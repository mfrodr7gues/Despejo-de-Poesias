const btnAdd = document.getElementById("btnAdd");
const btnFechar = document.getElementById("btnFechar");
const formUsuario = document.getElementById("formUsuario");

let editId = null;

//Ativa o modal
btnAdd.addEventListener("click", () => {
  formUsuario.reset();
  editId = null;
  modalOverlay.classList.add("active");
});

//Desativa o modal
btnFechar.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    formUsuario.reset();
    editId = null;
});