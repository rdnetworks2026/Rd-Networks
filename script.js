// ==========================================
// RD NETWORKS - FORMULÁRIO DE ORÇAMENTO
// EMAILJS VIA API REST
// ==========================================

const EMAILJS_PUBLIC_KEY = "UmwT4S5HgDSr0BGEf";
const EMAILJS_SERVICE_ID = "service_gyzcb9g";
const EMAILJS_TEMPLATE_ID = "template_vis868m";


// ==========================================
// MENU MOBILE
// ==========================================

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

if (menu && nav) {
  menu.addEventListener("click", function () {
    nav.classList.toggle("open");
  });

  document.querySelectorAll("nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
    });
  });
}


// ==========================================
// FORMULÁRIO
// ==========================================

const form = document.getElementById("quoteForm");
const statusEl = document.getElementById("formStatus");

if (form && statusEl) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    statusEl.textContent = "Enviando solicitação...";

    function campo(nome) {
      const elemento = form.elements[nome];

      if (!elemento) {
        return "";
      }

      return elemento.value.trim();
    }

    // Dados que serão enviados para o EmailJS
    const dados = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,

      template_params: {
        name: campo("name"),
        email: campo("email"),
        whatsapp: campo("phone"),
        city: campo("city"),
        service: campo("service"),
        quantity: campo("quantity"),
        message: campo("message")
      }
    };

    // Cancela se demorar mais de 15 segundos
    const controller = new AbortController();

    const timeout = setTimeout(function () {
      controller.abort();
    }, 15000);

    try {

      const resposta = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(dados),

          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      const textoResposta = await resposta.text();

      if (!resposta.ok) {
        throw new Error(
          "HTTP " +
          resposta.status +
          " - " +
          textoResposta
        );
      }

      statusEl.textContent =
        "Solicitação enviada com sucesso! A RD Networks recebeu seus dados e entrará em contato após analisar a solicitação.";

      form.reset();

    } catch (error) {

      clearTimeout(timeout);

      console.error("Erro no envio:", error);

      if (error.name === "AbortError") {

        statusEl.textContent =
          "ERRO: o servidor demorou mais de 15 segundos para responder.";

      } else {

        statusEl.textContent =
          "ERRO EMAILJS: " + error.message;

      }
    }

  });

}
