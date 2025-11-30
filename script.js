// Basic interactive behaviour for the Gojo theme site
const themeToggle = document.getElementById('themeToggle');
const loginBtn = document.getElementById('loginBtn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const demoCred = document.getElementById('demoCred');
const yearEl = document.getElementById('year');
const productsEl = document.getElementById('products');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const downloadBtn = document.getElementById('downloadBtn');
const contactForm = document.getElementById('contactForm');
const resetForm = document.getElementById('resetForm');

yearEl.textContent = new Date().getFullYear();

// Demo products (replace with real data later)
const PRODUCTS = [
  {id:1,title:"Gojo Theme Skin",cat:"skin",desc:"Dark theme skin pack, 3 variants",price:"$4.99"},
  {id:2,title:"UI Asset Pack",cat:"asset",desc:"Icons, buttons, and components",price:"$7.99"},
  {id:3,title:"Site Setup Service",cat:"service",desc:"We deploy this template for you",price:"$29"},
  {id:4,title:"Animation Kit",cat:"asset",desc:"Smooth JS & CSS animations",price:"$5.49"},
  {id:5,title:"Premium Skin",cat:"skin",desc:"Exclusive premium skin",price:"$9.99"},
];

// Render products
function renderProducts(list){
  productsEl.innerHTML = '';
  if(!list.length){
    productsEl.innerHTML = '<div style="color:var(--muted)">Produk tidak ditemukan.</div>';
    return;
  }
  list.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'product';
    el.innerHTML = `
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="price">${p.price}</div>
      <div class="actions">
        <button class="btn primary buyBtn" data-id="${p.id}">Beli</button>
        <button class="btn ghost" onclick="preview(${p.id})">Preview</button>
      </div>`;
    productsEl.appendChild(el);
  });
}
function preview(id){
  const p = PRODUCTS.find(x=>x.id===id);
  alert(`Preview: ${p.title}\n\n${p.desc}\nPrice: ${p.price}`);
}

// Initial load
renderProducts(PRODUCTS);

// Search & filter
function applyFilter(){
  const q = (searchInput.value || '').toLowerCase().trim();
  const cat = categorySelect.value;
  const filtered = PRODUCTS.filter(p=>{
    const matchesQ = p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchesCat = cat === 'all' ? true : p.cat === cat;
    return matchesQ && matchesCat;
  });
  renderProducts(filtered);
}
searchInput.addEventListener('input', applyFilter);
categorySelect.addEventListener('change', applyFilter);

// Theme toggle with localStorage
function getTheme(){ return localStorage.getItem('gojo-theme') || 'dark'; }
function applyTheme(t){
  if(t==='light'){ document.documentElement.style.colorScheme='light'; document.body.style.background='linear-gradient(180deg,#f7f9fb,#eef3f8)'; document.body.style.color='#061018'; }
  else { document.documentElement.style.colorScheme='dark'; document.body.style.background='linear-gradient(180deg,#050608,#0b0f12)'; document.body.style.color='#e6f2f8'; }
  localStorage.setItem('gojo-theme', t);
}
themeToggle.addEventListener('click', ()=>{
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});
applyTheme(getTheme());

// Modal login
loginBtn.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','false'); });
modalClose.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); loginMsg.textContent=''; });
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.setAttribute('aria-hidden','true'); });

// Demo credentials: fill fields
demoCred.addEventListener('click', ()=>{
  loginForm.username.value = 'demo';
  loginForm.password.value = 'demo123';
});

// Login handler (front-end demo only)
loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const u = loginForm.username.value.trim();
  const p = loginForm.password.value.trim();
  // Demo validation: accept demo/demo123 or any non-empty
  if((u === 'demo' && p === 'demo123') || (u && p)){
    loginMsg.style.color = 'var(--accent)';
    loginMsg.textContent = 'Login berhasil (demo). Selamat datang, ' + u + '!';
    setTimeout(()=>{ modal.setAttribute('aria-hidden','true'); loginMsg.textContent=''; loginForm.reset(); }, 900);
  } else {
    loginMsg.style.color = '#ff6b6b';
    loginMsg.textContent = 'Username / password salah.';
  }
});

// Dummy buy buttons (event delegation)
productsEl.addEventListener('click', (e)=>{
  if(e.target.classList.contains('buyBtn')){
    const id = e.target.dataset.id;
    const p = PRODUCTS.find(x=>x.id==id);
    alert(`Checkout\n\nProduk: ${p.title}\nHarga: ${p.price}\n\n(Ingat: ini demo front-end.)`);
  }
});

// Download zip button (creates simple zip-like blob with files)
// NOTE: for full zip creation you can prepare server side; here we create a small text file as placeholder
downloadBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  const content = `Gojo theme placeholder\n\nReplace this with a proper zip containing index.html, styles.css, script.js.`;
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  downloadBtn.href = url;
  downloadBtn.download = 'gojo-template.txt';
  // user will download the placeholder file; for full zip, prepare server or client-side zip lib.
});

// Contact form: use mailto fallback
contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(contactForm);
  const name = fd.get('name');
  const email = fd.get('email');
  const message = fd.get('message');
  const subject = encodeURIComponent('Kontak dari Gojo Site: ' + name);
  const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:your@email.com?subject=${subject}&body=${body}`;
});

// Reset contact form
resetForm.addEventListener('click', ()=> contactForm.reset());