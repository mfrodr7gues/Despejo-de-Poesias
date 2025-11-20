const loginTry = document.getElementById("login");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const senhaLabel = document.getElementById("Slabel");

const adms = [
    {
        "email": "luiotv2302@gmail.com",
        "senha": "Luiz2302"
    },
    {
        "email": "n.nandcchi@gmail.com",
        "senha": "nandoca"
    },
    {
        "email": "alinexyz1811@gmail.com",
        "senha": "Il0v3m7b0yfri3nd<3"
    }
]

loginTry.addEventListener("click", e => {
    e.preventDefault();
    const senhaTry =  senha.value;
    const emailTry =  email.value;

    for (let i = 0; i < adms.length; i++){
        if (emailTry === adms[i].email && senhaTry === adms[i].senha) {
            open("../admin/admin.html");
        }
        else {
            senha.style.borderBottom = "2px solid #ff6868ff";
            senhaLabel.style.color = "#ff6868ff";
        }
    }
})


function mostrarSenha() {
    if (senha.type === "password") {
        senha.type = "text";
    } else {
        senha.type = "password";
    }
}

