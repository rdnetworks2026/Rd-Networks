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
    const isOpen = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  document.querySelectorAll("nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Abrir menu");
    });
  });
}


// ==========================================
// FORMULÁRIO
// ==========================================

const form = document.getElementById("quoteForm");
const statusEl = document.getElementById("formStatus");
const submitButton = form?.querySelector('button[type="submit"]');

if (form && statusEl) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (submitButton?.disabled) return;
    if (submitButton) submitButton.disabled = true;
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
        request_type: campo("request_type"),
        quantity: campo("quantity"),
        urgency: campo("urgency"),
        preferred_time: campo("preferred_time"),
        materials: campo("materials"),
        existing_rack: campo("existing_rack"),
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
          "Não foi possível confirmar o envio agora. Tente novamente ou escreva para rdnetworks2026@gmail.com.";

      } else {

        statusEl.textContent =
          "Não foi possível enviar a solicitação. Tente novamente ou escreva para rdnetworks2026@gmail.com.";

      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }

  });

}


// ==========================================
// SELETOR DE IDIOMA - TRADUÇÃO DA PÁGINA PÚBLICA
// ==========================================
(function () {
  const header = document.querySelector(".topbar");
  if (!header || document.getElementById("languageSelector")) return;

  const languages = [
    ["pt", "Português"], ["en", "English"], ["es", "Español"],
    ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"],
    ["nl", "Nederlands"], ["da", "Dansk"], ["sv", "Svenska"],
    ["no", "Norsk"], ["fi", "Suomi"], ["pl", "Polski"],
    ["ro", "Română"], ["ru", "Русский"], ["ar", "العربية"],
    ["ja", "日本語"], ["ko", "한국어"], ["zh-CN", "中文（简体）"],
    ["hi", "हिन्दी"], ["tr", "Türkçe"]
  ];
  const canonical = document.querySelector('link[rel="canonical"]');
  const pageUrl = new URL(canonical ? canonical.href : location.origin + location.pathname);
  pageUrl.search = "";
  pageUrl.hash = "";
  const bar = document.createElement("div");
  bar.className = "language-bar notranslate";
  bar.setAttribute("translate", "no");
  const translationForm = document.createElement("form");
  translationForm.action = "https://translate.google.com/translate";
  translationForm.method = "get";
  translationForm.target = "_blank";
  translationForm.rel = "noopener noreferrer";
  translationForm.setAttribute("aria-label", "Translate this website");
  const label = document.createElement("label");
  label.htmlFor = "languageSelector";
  label.textContent = "Idioma / Language";
  const select = document.createElement("select");
  select.id = "languageSelector";
  select.name = "tl";
  select.setAttribute("aria-describedby", "translationHint");
  languages.forEach(function ([code, name]) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    option.lang = code;
    select.appendChild(option);
  });
  const preferred = (navigator.language || "pt").toLowerCase().split("-")[0];
  const match = languages.find(function ([code]) {
    return code.toLowerCase().split("-")[0] === preferred;
  });
  select.value = match ? match[0] : "en";
  for (const [name, value] of [["sl", "pt"], ["u", pageUrl.href]]) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    translationForm.appendChild(input);
  }
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Traduzir / Translate ↗";
  const hint = document.createElement("small");
  hint.id = "translationHint";
  hint.textContent = "Google Translate · nova aba / new tab";
  translationForm.append(label, select, button, hint);
  translationForm.addEventListener("submit", function (event) {
    if (select.value === "pt") {
      event.preventDefault();
      location.assign(pageUrl.href);
    }
  });
  bar.appendChild(translationForm);
  const css = document.createElement("style");
  css.textContent = `
.language-bar{background:#f4f8fb;border-bottom:1px solid #dfe7ef;padding:10px max(5vw,24px)}
.language-bar form{display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap;margin:0}
.language-bar label{margin:0;color:#0b1f33;font-size:13px;font-weight:700}
.language-bar select{width:auto;max-width:100%;min-width:150px;margin:0;padding:9px 12px;font-size:14px;border:1px solid #c9d6e2;border-radius:8px;background:#fff;color:#17212b}
.language-bar button{border:0;border-radius:8px;padding:11px 15px;background:#1769aa;color:#fff;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
.language-bar button:hover{background:#0b1f33}
.language-bar small{color:#637083;font-size:11px}
@media(max-width:600px){.language-bar{padding:12px 24px}.language-bar form{justify-content:flex-start;gap:9px}.language-bar label{width:100%}.language-bar select{flex:1;min-width:0}.language-bar small{width:100%}}
`;
  document.head.appendChild(css);
  header.before(bar);
})();
