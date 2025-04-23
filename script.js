// Import the functions you need from the SDKs you need


// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdOXL2X3LXi8cAm-pG_JI0uPcb0iryqeQ",
    authDomain: "barbearia-cf987.firebaseapp.com",
    databaseURL: "https://barbearia-cf987-default-rtdb.firebaseio.com",
    projectId: "barbearia-cf987",
    storageBucket: "barbearia-cf987.appspot.com",
    messagingSenderId: "263765732524",
    appId: "1:263765732524:web:10f1f859237317227cc309",
    measurementId: "G-33Z27BG0SC"
  };
  
  // Inicializa o Firebase (usando compat)
  firebase.initializeApp(firebaseConfig);
  
  // Teste simples para ver se conecta
  firebase.database().ref('teste').set({ msg: "Firebase funcionando" });
  
  // Função para pegar barbeiro da URL
  function getBarbeiroFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('barbeiro') || 'Não especificado';
  }
  
  // Envio dos dados do formulário para o Firebase
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const corte = document.getElementById("corte").value;
    const barbeiro = getBarbeiroFromURL();
  
    const agendamento = {
      nome,
      data,
      hora,
      corte,
      barbeiro
    };
  
    firebase.database().ref("agendamentos").push(agendamento)
      .then(() => {
        alert("✅ Agendamento confirmado com sucesso!");
        document.querySelector("form").reset();
      })
      .catch((error) => {
        alert("❌ Erro ao agendar: " + error.message);
      });
  });
  