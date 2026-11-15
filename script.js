const menu=document.querySelector(".menu");
const nav=document.getElementById("mainNav");
if(menu&&nav){
  menu.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menu.setAttribute("aria-expanded",String(open));
    menu.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded","false");
  }));
}

const form=document.getElementById("quoteForm");
const statusEl=document.getElementById("formStatus");
if(form){
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const get=name=>form.elements[name]?.value?.trim()||"";
    const nome=get("name");
    const cidade=get("city");
    const mensagem=get("message");
    const texto=[
      "Olá! Vim pelo site da RD Networks e gostaria de solicitar um orçamento.",
      "",
      "Nome: "+nome,
      "Cidade/região: "+cidade,
      "Serviço desejado: "+mensagem
    ].join("\n");
    const url="https://wa.me/5527992551513?text="+encodeURIComponent(texto);
    window.open(url,"_blank","noopener,noreferrer");
    if(statusEl)statusEl.textContent="O WhatsApp foi aberto com sua mensagem. Confira os dados e toque em enviar.";
  });
}
