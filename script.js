// RD Networks — formulário preparado para EmailJS.
// PASSO 1: crie sua conta no EmailJS e configure Service ID + Template ID.
// PASSO 2: substitua os três valores abaixo.
const EMAILJS_PUBLIC_KEY = "COLOQUE_SUA_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "COLOQUE_SEU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "COLOQUE_SEU_TEMPLATE_ID";

const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const form = document.getElementById('quoteForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (EMAILJS_PUBLIC_KEY.startsWith('COLOQUE_')) {
    statusEl.textContent = 'O formulário está pronto. Configure o EmailJS seguindo o arquivo PASSO_A_PASSO.txt para ativar o envio automático.';
    return;
  }
  statusEl.textContent = 'Enviando solicitação...';
  try {
    if (!window.emailjs) throw new Error('Biblioteca EmailJS não carregada.');
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
    statusEl.textContent = 'Solicitação enviada com sucesso. A RD Networks entrará em contato após analisar as informações.';
    form.reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Não foi possível enviar agora. Tente novamente ou entre em contato diretamente com a RD Networks.';
  }
});
