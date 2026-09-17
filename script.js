const EMAILJS_PUBLIC_KEY = "ghlxfFM1Lr0pAIpGk";
const EMAILJS_SERVICE_ID = "service_gyzcb9g";
const EMAILJS_TEMPLATE_ID = "template_vis868m";

// ==============================
// MENU MOBILE
// ==============================

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

// ==============================
// FORMULÁRIO DE ORÇAMENTO
// ==============================

const form = document.getElementById("quoteForm");
const statusEl = document.getElementById("formStatus");

if (form && statusEl) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    statusEl.textContent = "Enviando solicitação...";

    try {

      // Confirma se a biblioteca EmailJS foi carregada
      if (typeof emailjs === "undefined") {
        throw new Error("A biblioteca EmailJS não foi carregada.");
      }

      // Pega os valores dos campos do formulário
      const campo = function (nome) {
        const elemento = form.elements[nome];

        if (!elemento) {
          return "";
        }

        return elemento.value.trim();
      };

      // Dados enviados para o template do EmailJS
      const dados = {
        name: campo("name"),
        email: campo("email"),
        whatsapp: campo("phone"),
        city: campo("city"),
        service: campo("service"),
        quantity: campo("quantity"),
        message: campo("message")
      };

      // Envia para o EmailJS
     const envioEmailJS = emailjs.send(
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  dados,
  {
    publicKey: EMAILJS_PUBLIC_KEY
  }
);

const limiteTempo = new Promise((_, reject) => {
  setTimeout(() => {
    reject(
      new Error(
        "TIMEOUT: o navegador não recebeu resposta do EmailJS após 15 segundos."
      )
    );
  }, 15000);
});

const resposta = await Promise.race([
  envioEmailJS,
  limiteTempo
]);

      console.log("EmailJS:", resposta);

      // Mensagem de sucesso
      statusEl.textContent =
        "Solicitação enviada com sucesso! A RD Networks recebeu seus dados e entrará em contato após analisar a solicitação.";

      // Limpa o formulário
      form.reset();

    } catch (error) {

      console.error("Erro EmailJS:", error);

      const detalhe =
        error?.text ||
        error?.message ||
        String(error);

      // Mostra o erro na própria página
      statusEl.textContent =
        "ERRO EMAILJS: " + detalhe;
    }

  });

}
