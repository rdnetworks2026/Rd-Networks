const EMAILJS_PUBLIC_KEY="UmwT4S5HgDSr0BGEf";
const EMAILJS_SERVICE_ID="service_gyzcb9g";
const EMAILJS_TEMPLATE_ID="template_vis868m";

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
if(form&&statusEl){
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const button=form.querySelector('button[type="submit"]');
    if(button?.disabled)return;
    if(button)button.disabled=true;
    statusEl.textContent="Enviando solicitação...";
    const get=name=>form.elements[name]?.value?.trim()||"";
    const selected=form.querySelector('input[name="request_type"]:checked')?.value||"";
    const protocol="RD-"+new Date().toISOString().replace(/\D/g,"").slice(0,14);
    const dados={
      service_id:EMAILJS_SERVICE_ID,
      template_id:EMAILJS_TEMPLATE_ID,
      user_id:EMAILJS_PUBLIC_KEY,
      template_params:{
        name:get("name"),email:get("email"),whatsapp:get("phone"),client_type:get("client_type"),
        city:get("city"),neighborhood:"",cnpj:"",contact_preference:"WhatsApp e/ou e-mail",
        service:get("service"),request_type:selected,quantity:get("quantity"),urgency:get("urgency"),
        preferred_time:"A combinar",materials:get("materials"),existing_rack:"",first_service:"",
        has_files:get("has_files"),message:get("message"),protocol
      }
    };
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(dados),signal:controller.signal});
      clearTimeout(timeout);
      if(!response.ok)throw new Error("HTTP "+response.status);
      statusEl.textContent="Solicitação enviada com sucesso! Protocolo "+protocol+". Vamos analisar o escopo e entrar em contato.";
      form.reset();
    }catch(error){
      clearTimeout(timeout);
      console.error(error);
      statusEl.textContent=error.name==="AbortError"?"O envio demorou mais que o esperado. Tente novamente ou fale pelo WhatsApp.":"Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
    }finally{if(button)button.disabled=false;}
  });
}