// ==========================================
// CONFIGURAÇÃO EMAILJS - RD NETWORKS
// ==========================================

const EMAILJS_PUBLIC_KEY = "ghlxfFM1Lr0pAIpGk";
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
// FORMULÁRIO DE ORÇAMENTO
// ==========================================

const form = document.getElementById("quoteForm");
const statusEl = document.getElementById("formStatus");


if (form && statusEl) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    statusEl.textContent = "Enviando solicitação...";

    try {

      // Verifica se o EmailJS foi carregado
      if (typeof emailjs === "undefined") {
        throw new Error("A biblioteca EmailJS não foi carregada.");
      }


      // ======================================
      // INICIALIZA EMAILJS
      // ======================================

      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
      });


      // ======================================
      // FUNÇÃO PARA LER OS CAMPOS
      // ======================================

      function campo(nome) {

        const elemento = form.elements[nome];

        if (!elemento) {
          return "";
        }

        return elemento.value.trim();
      }


      // ======================================
      // DADOS DO FORMULÁRIO
      // ======================================

      const dados = {

        name: campo("name"),

        email: campo("email"),

        // No seu index.html o WhatsApp
        // está identificado como "phone"
        whatsapp: campo("phone"),

        city: campo("city"),

        service: campo("service"),

        quantity: campo("quantity"),

        message: campo("message")

      };


      // ======================================
      // ENVIO PELO EMAILJS
      // ======================================

      const envioEmailJS = emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        dados
      );


      // ======================================
      // LIMITE DE 15 SEGUNDOS
      // ======================================

      const limiteTempo = new Promise(function (_, reject) {

        setTimeout(function () {

          reject(
            new Error(
              "TIMEOUT: o EmailJS não respondeu após 15 segundos."
            )
          );

        }, 15000);

      });


      // Aguarda envio ou timeout

      const resposta = await Promise.race([
        envioEmailJS,
        limiteTempo
      ]);


      console.log("Resposta EmailJS:", resposta);


      // ======================================
      // SUCESSO
      // ======================================

      statusEl.textContent =
        "Solicitação enviada com sucesso! A RD Networks recebeu seus dados e entrará em contato após analisar a solicitação.";

      form.reset();


    } catch (error) {


      // ======================================
      // ERRO
      // ======================================

      console.error("Erro EmailJS:", error);

      const detalhe =
        error?.text ||
        error?.message ||
        String(error);

      statusEl.textContent =
        "ERRO EMAILJS: " + detalhe;

    }

  });

}
