
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

  // Mostrar o nome do barbeiro na tela, se disponível
document.addEventListener("DOMContentLoaded", () => {
  const barbeiro = getBarbeiroFromURL();
  const el = document.getElementById("nomeBarbeiro");
  if (el && barbeiro !== 'Não especificado') {
    el.textContent = `Você está agendando com o barbeiro ${barbeiro}`;
  }
});

  
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const corte = document.getElementById("corte").value;
    const barbeiro = getBarbeiroFromURL();
  
    // Verificação extra de horário
    const [horaAgendada, minutoAgendado] = hora.split(":").map(Number);
    const horarioEmMinutos = horaAgendada * 60 + minutoAgendado;
    const minHorario = 7 * 60 + 30;  // 7:30 = 450 minutos
    const maxHorario = 19 * 60 + 30; // 19:30 = 1170 minutos
  
    if (horarioEmMinutos < minHorario || horarioEmMinutos > maxHorario) {
      alert("❌ Horário inválido! Escolha um horário entre 07:30 e 19:30.");
      return;
    }
  
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

  // Gera horários entre 07:30 e 19:30 em intervalos de 30 minutos
function gerarHorarios() {
  const horarios = [];
  for (let h = 7; h <= 19; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = String(h).padStart(2, "0");
      const minuto = String(m).padStart(2, "0");
      horarios.push(`${hora}:${minuto}`);
    }
  }
  return horarios;
}

// Função para carregar horários disponíveis
function carregarHorariosDisponiveis() {
  const data = document.getElementById("data").value;
  const barbeiro = getBarbeiroFromURL();
  const selectHora = document.getElementById("hora");

  if (!data) {
    selectHora.innerHTML = `<option value="">Selecione a data primeiro</option>`;
    return;
  }

  firebase
    .database()
    .ref("agendamentos")
    .orderByChild("data")
    .equalTo(data)
    .once("value", (snapshot) => {
      const agendados = snapshot.val();
      const horariosOcupados = [];

      for (let id in agendados) {
        if (agendados[id].barbeiro === barbeiro) {
          horariosOcupados.push(agendados[id].hora);
        }
      }

      const todosHorarios = gerarHorarios();
      const horariosDisponiveis = todosHorarios.filter(
        (hora) => !horariosOcupados.includes(hora)
      );

      if (horariosDisponiveis.length === 0) {
        selectHora.innerHTML = `<option value="">Sem horários disponíveis</option>`;
      } else {
        selectHora.innerHTML = "";
        horariosDisponiveis.forEach((hora) => {
          const option = document.createElement("option");
          option.value = hora;
          option.textContent = hora;
          selectHora.appendChild(option);
        });
      }
    });
}

// Mostrar nome do barbeiro na tela
document.addEventListener("DOMContentLoaded", () => {
  const barbeiro = getBarbeiroFromURL();
  const el = document.getElementById("nomeBarbeiro");
  if (el && barbeiro !== 'Não especificado') {
    el.textContent = `Você está agendando com o barbeiro ${barbeiro}`;
  }
});

// Função para exibir agendamentos em uma lista
function mostrarAgendamentos() {
  const listaDiv = document.getElementById("agendamentosLista");
  firebase.database().ref("agendamentos").once("value")
    .then((snapshot) => {
      const agendamentos = snapshot.val();
      if (!agendamentos) {
        listaDiv.innerHTML = "Nenhum agendamento encontrado.";
        return;
      }

      const lista = document.createElement("ul");
      lista.style.listStyleType = "none";

      // Organiza por data e hora
      const agendamentosArray = Object.values(agendamentos).sort((a, b) => {
        return `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`);
      });

      agendamentosArray.forEach(ag => {
        const item = document.createElement("li");
        item.innerHTML = `<strong>${ag.data} ${ag.hora}</strong> - ${ag.nome} com ${ag.barbeiro} (${ag.corte})`;
        lista.appendChild(item);
      });

      listaDiv.innerHTML = "";
      listaDiv.appendChild(lista);
    })
    .catch((err) => {
      listaDiv.innerHTML = "Erro ao carregar agendamentos: " + err.message;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarAgendamentos();
});



  