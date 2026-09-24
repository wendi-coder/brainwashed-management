(function(){
  const rootPath='/';
  let articles=[];
  let language=localStorage.getItem('brainwashed-language')||'en';
  let filter='All';
  const localized=(item,key)=>item[`${key}_${language}`]||item[`${key}_${language==='en'?'id':'en'}`]||'';
  const dateLabel=value=>new Intl.DateTimeFormat(language==='id'?'id-ID':'en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value));
  const imageUrl=value=>value?.startsWith('/')?value:(rootPath+(value||'').replace(/^\.\//,''));
  const articleUrl=slug=>`article.html?slug=${encodeURIComponent(slug)}`;
  const setLanguage=lang=>{language=lang;localStorage.setItem('brainwashed-language',lang);document.documentElement.lang=lang;document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));document.querySelectorAll('[data-copy-id]').forEach(el=>el.textContent=el.dataset[`copy${lang==='id'?'Id':'En'}`]);document.body.dataset.newsView==='index'?renderIndex():renderArticle()};
  const card=(item,featured=false)=>{const el=document.createElement(featured?'article':'a');el.className=featured?'featured-news':'news-card';if(!featured)el.href=articleUrl(item.slug);const img=document.createElement('img');img.src=imageUrl(item.image);img.alt=localized(item,'image_alt');img.loading='lazy';const copy=document.createElement('div');copy.className='news-card-copy';const meta=document.createElement('span');meta.className='news-card-meta';meta.textContent=`${item.roster} · ${dateLabel(item.date)}`;const title=document.createElement('h2');title.textContent=localized(item,'title');const excerpt=document.createElement('p');excerpt.textContent=localized(item,'excerpt');const link=document.createElement('a');link.className='news-read';link.href=articleUrl(item.slug);link.textContent=language==='id'?'Baca artikel ↗':'Read article ↗';copy.append(meta,title,excerpt,link);el.append(img,copy);return el};
  function renderIndex(){
    const grid=document.querySelector('#news-grid'),featuredRoot=document.querySelector('#featured-news'),empty=document.querySelector('#news-empty');if(!grid)return;
    grid.innerHTML='';featuredRoot.innerHTML='';
    const visible=articles.filter(a=>a.published!==false&&(filter==='All'||a.roster===filter)).sort((a,b)=>new Date(b.date)-new Date(a.date));
    const featured=visible.find(a=>a.featured)||visible[0];if(featured)featuredRoot.append(card(featured,true));
    visible.filter(a=>a!==featured).forEach(a=>grid.append(card(a)));
    empty.hidden=visible.length>0;empty.textContent=language==='id'?'Belum ada berita yang diterbitkan.':'No published stories yet.';
  }
  function renderArticle(){
    const root=document.querySelector('#article-root');if(!root)return;const slug=new URLSearchParams(location.search).get('slug');const item=articles.find(a=>a.slug===slug&&a.published!==false);
    if(!item){root.innerHTML=`<section class="article-hero"><p>${language==='id'?'Artikel tidak ditemukan.':'Article not found.'}</p><a href="news.html">← News</a></section>`;return}
    document.title=`${localized(item,'title')} — Brainwashed`;
    root.innerHTML='';const hero=document.createElement('section');hero.className='article-hero';const kicker=document.createElement('div');kicker.className='article-kicker';const meta=document.createElement('span');meta.textContent=`${item.roster} · ${dateLabel(item.date)}`;const lang=document.createElement('div');lang.className='article-lang';lang.innerHTML='<button data-lang="id">ID</button><button data-lang="en">EN</button>';kicker.append(meta,lang);const h1=document.createElement('h1');h1.textContent=localized(item,'title');const deck=document.createElement('p');deck.className='article-deck';deck.textContent=localized(item,'excerpt');const figure=document.createElement('figure');figure.className='article-image';const img=document.createElement('img');img.src=imageUrl(item.image);img.alt=localized(item,'image_alt');figure.append(img);if(item.photo_credit){const cap=document.createElement('figcaption');cap.textContent=`Photo / ${item.photo_credit}`;figure.append(cap)}hero.append(kicker,h1,deck,figure);
    const body=document.createElement('section');body.className='article-body';const prose=document.createElement('article');prose.className='article-prose';const markdown=localized(item,'body');prose.innerHTML=window.marked?marked.parse(markdown):markdown.split('\n\n').map(p=>`<p>${p}</p>`).join('');if(item.related_url){const related=document.createElement('a');related.className='article-related';related.href=item.related_url;related.target='_blank';related.rel='noopener';related.textContent=localized(item,'related_label')||'Related link ↗';prose.append(related)}const back=document.createElement('a');back.className='article-back';back.href='news.html';back.textContent=language==='id'?'← Kembali ke News':'← Back to News';body.append(prose,back);root.append(hero,body);document.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===language);b.addEventListener('click',()=>setLanguage(b.dataset.lang))});
  }
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderIndex()}));
  fetch('content/news.json').then(r=>{if(!r.ok)throw new Error('News data unavailable');return r.json()}).then(data=>{articles=Array.isArray(data.articles)?data.articles:[];setLanguage(language)}).catch(()=>{articles=[];setLanguage(language)});
})();
