const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');

menuButton?.addEventListener('click',()=>{
  const isOpen=menuButton.getAttribute('aria-expanded')==='true';
  menuButton.setAttribute('aria-expanded',String(!isOpen));
  nav.classList.toggle('open',!isOpen);
});

nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  menuButton?.setAttribute('aria-expanded','false');
  nav.classList.remove('open');
}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  });
},{threshold:.12,rootMargin:'0px 0px -5%'});

document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
document.querySelector('#year').textContent=new Date().getFullYear();
