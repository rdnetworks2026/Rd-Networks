const EMAILJS_PUBLIC_KEY = "ghlxfFM1Lr0pAIpGk";
const EMAILJS_SERVICE_ID = "service_gyzcb9g";
const EMAILJS_TEMPLATE_ID = "template_vis868m";

// Menu mobile
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

if (menu && nav) {
  menu.addEventListener("click", () => nav.classList.toggle("open"));

  document.querySelectorAll("nav a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// Formulário de orçamento
const form = document.getElementById("quoteForm");
const statusEl = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    statusEl.textContent = "Enviando solicitação...";

    const dados = {
      name: form.elements["name"].value,
      email: form.elements["email"].value,
      whatsapp: form.elements["phone"].value,
      city: form.elements["city"].value,
      service: form.elements["service"].value,
      quantity: form.elements["quantity"].value,
      message: form.elements["message"].value
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        dados,
        {
          publicKey: EMAILJS_PUBLIC_KEY
        }
      );

      statusEl.textContent =
        "Solicitação enviada com sucesso! A RD Networks entrará em contato após analisar as informações.";

      form.reset();

   } catch (error) {
  console.error("Erro EmailJS:", error);

  const detalhe =
    error?.text ||
    error?.message ||
    JSON.stringify(error) ||
    String(error);

  statusEl.textContent = "ERRO EMAILJS: " + detalhe;
}
  });
}
