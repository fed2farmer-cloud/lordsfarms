(() => {
  const D = window.LORDS_FARMS;
  const page = document.body.dataset.page || 'home';
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
  const money = n => n ? new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n) : 'TBD';

  function header(){
    const el=$('#site-header'); if(!el) return;
    const links=[['index.html','Home','home'],['shop.html','Shop','shop'],['experiences.html','Experiences','experiences'],['story.html','Our Story','story'],['veteran.html','Veteran Farm','veteran'],['contact.html','Contact','contact']];
    const nav=links.map(([href,label,key])=>`<a href="${href}" ${page===key?'aria-current="page"':''}>${label}</a>`).join('');
    el.innerHTML=`<div class="topbar">Antelope Valley • Regenerative farm build • Harvest & experience updates</div>
      <header class="site-header"><div class="container nav">
        <a class="brand" href="index.html"><img src="assets/logo.svg" alt="Lords Farms logo"><span>Lords Farms</span></a>
        <nav class="nav-links" aria-label="Main navigation">${nav}</nav>
        <div class="nav-actions"><button class="btn ghost small cart-btn" id="cart-open" aria-label="Open cart">Cart <span class="cart-count" id="cart-count">0</span></button><a class="btn primary small" href="contact.html">Get Updates</a><button class="menu-btn" id="menu-btn" aria-label="Open menu">☰</button></div>
      </div><nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">${nav}</nav></header>`;
  }
  function footer(){
    const el=$('#site-footer'); if(!el) return;
    el.innerHTML=`<footer class="footer"><div class="container"><div class="footer-grid">
      <div><a class="brand" href="index.html"><img src="assets/logo.svg" alt=""><span>Lords Farms</span></a><p>Building a regenerative, water-smart farm and agritourism destination in California's Antelope Valley.</p></div>
      <div><h4>Explore</h4><a href="shop.html">Farm Store</a><a href="experiences.html">Experiences</a><a href="story.html">Our Story</a></div>
      <div><h4>Work With Us</h4><a href="contact.html#wholesale">Wholesale</a><a href="contact.html#partnerships">Partnerships</a><a href="contact.html">Farm Updates</a></div>
      <div><h4>Contact</h4><p>${D.business.location}</p><a href="mailto:${D.business.email}">${D.business.email}</a></div>
      </div><div class="footer-note">© 2026 ${D.business.legalName}. All rights reserved. Product availability, certifications and visitor experiences must be confirmed before purchase or booking. This build intentionally avoids displaying certification seals until approval is verified.</div></div></footer>`;
  }
  function shell(){
    header(); footer();
    $('#menu-btn')?.addEventListener('click',()=>$('#mobile-menu').classList.toggle('open'));
    setupCartDrawer(); updateCartCount();
  }
  function getCart(){try{return JSON.parse(localStorage.getItem('lf_cart'))||[]}catch{return[]}}
  function saveCart(c){localStorage.setItem('lf_cart',JSON.stringify(c));updateCartCount();renderCart()}
  function updateCartCount(){const c=getCart().reduce((a,i)=>a+i.qty,0);const el=$('#cart-count');if(el)el.textContent=c}
  function addCart(id){const p=D.products.find(x=>x.id===id); if(!p)return; let c=getCart(); const x=c.find(i=>i.id===id); x?x.qty++:c.push({id,qty:1}); saveCart(c); openCart()}
  function changeQty(id,delta){let c=getCart(); const x=c.find(i=>i.id===id); if(!x)return; x.qty+=delta; c=c.filter(i=>i.qty>0); saveCart(c)}
  function setupCartDrawer(){
    if($('#cart-drawer'))return;
    document.body.insertAdjacentHTML('beforeend',`<div class="drawer-backdrop" id="drawer-backdrop"></div><aside class="cart-drawer" id="cart-drawer" aria-label="Shopping cart"><div class="drawer-head"><strong>Your Farm Cart</strong><button class="btn ghost small" id="cart-close">Close</button></div><div class="drawer-body" id="cart-body"></div><div class="drawer-footer"><div id="cart-total" style="font-weight:900;margin-bottom:12px"></div><button class="btn primary" id="order-request" style="width:100%">Request This Order</button><p class="legal">This rebuild does not process card payments yet. The button prepares an order request by email.</p></div></aside>`);
    $('#cart-open')?.addEventListener('click',openCart); $('#cart-close')?.addEventListener('click',closeCart); $('#drawer-backdrop')?.addEventListener('click',closeCart); $('#order-request')?.addEventListener('click',requestOrder); renderCart();
  }
  function openCart(){$('#drawer-backdrop').classList.add('open');$('#cart-drawer').classList.add('open')}
  function closeCart(){$('#drawer-backdrop').classList.remove('open');$('#cart-drawer').classList.remove('open')}
  function renderCart(){const el=$('#cart-body');if(!el)return;const c=getCart();if(!c.length){el.innerHTML='<div class="empty">Your cart is empty.<br><a href="shop.html"><strong>Browse the farm store →</strong></a></div>';$('#cart-total').textContent='';return}let total=0;el.innerHTML=c.map(i=>{const p=D.products.find(x=>x.id===i.id);if(!p)return'';total+=p.price*i.qty;return`<div class="cart-item"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><div class="legal">${p.source} • ${p.status}</div><div class="qty"><button data-q="-1" data-id="${p.id}">−</button><span>${i.qty}</span><button data-q="1" data-id="${p.id}">+</button></div></div><strong>${p.price?money(p.price*i.qty):'TBD'}</strong></div>`}).join('');$('#cart-total').textContent=`Estimated total: ${money(total)}`;$$('[data-q]',el).forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.id,+b.dataset.q)))}
  function requestOrder(){const c=getCart();if(!c.length)return;const lines=c.map(i=>{const p=D.products.find(x=>x.id===i.id);return `${i.qty} × ${p.name} (${p.status})`}).join('\n');const body=`Hello Lords Farms,\n\nI would like to request availability for:\n${lines}\n\nName:\nPhone:\nPreferred pickup/delivery details:\n`;location.href=`mailto:${D.business.email}?subject=${encodeURIComponent('Lords Farms order request')}&body=${encodeURIComponent(body)}`}
  function productCard(p){return `<article class="card product-card" data-category="${p.category}"><div class="card-media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="card-body"><div class="tag-row"><span class="tag">${p.source}</span><span class="tag gold">${p.status}</span></div><h3>${p.name}</h3><p>${p.desc}</p><div class="card-footer"><div><div class="price">${p.price?money(p.price):'Price TBD'}</div><div class="legal">${p.price?`per ${p.unit}`:''}</div></div><button class="btn primary small" data-add="${p.id}">${p.status==='Future Harvest'?'Save Interest':'Add'}</button></div></div></article>`}
  function bindAdds(root=document){$$('[data-add]',root).forEach(b=>b.addEventListener('click',()=>addCart(b.dataset.add)))}
  function renderProducts(target,limit){const el=$(target);if(!el)return;el.innerHTML=D.products.slice(0,limit||D.products.length).map(productCard).join('');bindAdds(el)}
  function renderShop(){const el=$('#product-grid');if(!el)return;const cats=['All',...new Set(D.products.map(p=>p.category))];$('#filters').innerHTML=cats.map((c,i)=>`<button class="filter-btn ${i===0?'active':''}" data-filter="${c}">${c}</button>`).join('');
    function draw(cat='All'){el.innerHTML=D.products.filter(p=>cat==='All'||p.category===cat).map(productCard).join('');bindAdds(el)} draw();
    $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(b.dataset.filter)}));
  }
  function renderExperiences(target,limit){const el=$(target);if(!el)return;el.innerHTML=D.experiences.slice(0,limit||D.experiences.length).map(x=>`<article class="card"><div class="card-media"><img src="${x.image}" alt="${x.name}" loading="lazy"></div><div class="card-body"><div class="tag-row"><span class="tag">${x.type}</span><span class="tag gold">${x.status}</span></div><h3>${x.name}</h3><p>${x.desc}</p><div class="card-footer"><div><div class="price">${x.price?money(x.price):'Price TBD'}</div><div class="legal">${x.duration}</div></div><a class="btn primary small" href="contact.html?interest=${encodeURIComponent(x.name)}">Join Interest List</a></div></div></article>`).join('')}
  function setupForms(){$$('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const status=$('.form-status',form);const fd=new FormData(form);const subject=`Lords Farms inquiry: ${fd.get('inquiry')||'Website'}`;const body=[...fd.entries()].map(([k,v])=>`${k}: ${v}`).join('\n');if(status)status.textContent='Opening your email app so this message can be sent to Lords Farms.';location.href=`mailto:${D.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}));
    const q=new URLSearchParams(location.search).get('interest'); if(q){const s=$('select[name="inquiry"]');if(s)s.value='Farm Experience';const m=$('textarea[name="message"]');if(m)m.value=`I am interested in: ${q}. Please add me to the interest list and send availability updates.`}
  }
  shell(); renderProducts('#featured-products',4); renderShop(); renderExperiences('#featured-experiences',3); renderExperiences('#experience-grid'); setupForms();
})();
