import React, { useEffect, useMemo, useRef, useState } from 'react';
import { translations, CATEGORY_IDS, REGIONS, type Language, type Category } from './copy';
import { mountTelegram, telegramApp, telegramInitData } from './telegram';

type FormData = { fullName: string; phone: string; region: string; role: string; service: string; message: string; website: string };
type Listing = {category: Exclude<Category,'all'>; region: number; photo: string; title: number};
const images = ['/images/landscape.webp','/images/machines.webp','/images/warehouse.webp','/images/export.webp'];
const smallImages = ['/images/landscape-sm.webp','/images/machines-sm.webp','/images/warehouse-sm.webp','/images/export-sm.webp'];
const listingData: Listing[] = [
  {category:'storage',region:0,photo:smallImages[2],title:0},
  {category:'equipment',region:1,photo:smallImages[1],title:1},
  {category:'transport',region:2,photo:smallImages[2],title:2},
  {category:'export',region:0,photo:smallImages[3],title:3},
  {category:'equipment',region:3,photo:smallImages[1],title:4},
  {category:'storage',region:4,photo:smallImages[2],title:5}
];
const stageImageIndices = [0,1,2,3];
const formatMoney = (value:number) => new Intl.NumberFormat('uz-UZ',{maximumFractionDigits:0}).format(value);
function Icon({name,size=20}: {name:string;size?:number}) {
  const props = {width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.65,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true as const};
  const paths: Record<string, React.ReactNode> = {
    arrow:<g><path d="M4 12h16M13 5l7 7-7 7"/></g>,
    diagon:<g><path d="M6 18 18 6M8 6h10v10"/></g>,
    menu:<g><path d="M4 7h16M4 12h16M4 17h16"/></g>,
    close:<g><path d="M5 5 19 19M19 5 5 19"/></g>,
    search:<g><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></g>,
    chevron:<g><path d="m6 9 6 6 6-6"/></g>,
    pin:<g><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></g>,
    check:<g><path d="m5 12 5 5L20 6"/></g>,
    leaf:<g><path d="M20 4C11 4 5 7 5 14a6 6 0 0 0 6 6c7 0 10-8 9-16Z"/><path d="M5 20c1-6 6-10 12-12"/></g>,
    grid:<g><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></g>,
    clock:<g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>,
    link:<g><path d="M10 13a5 5 0 0 0 7 .2l3-3a5 5 0 0 0-7-7l-2 2"/><path d="M14 11a5 5 0 0 0-7-.2l-3 3a5 5 0 1 0 7 7l2-2"/></g>,
  };
  return <svg {...props}>{paths[name] ?? paths.arrow}</svg>;
}

const initialForm:FormData = {fullName:'',phone:'',region:'',role:'Fermer',service:'',message:'',website:''};

function App() {
  const [lang,setLang] = useState<Language>('uz');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [activeStage,setActiveStage] = useState(0);
  const [category,setCategory] = useState<Category>('all');
  const [region,setRegion] = useState('all');
  const [query,setQuery] = useState('');
  const [amount,setAmount] = useState(3000000);
  const [expandedFaq,setExpandedFaq] = useState<number|null>(0);
  const [form,setForm] = useState<FormData>(initialForm);
  const [sendState,setSendState] = useState<'idle'|'sending'|'success'|'error'|'offline'|'invalid'>('idle');
  const storyRef=useRef<HTMLDivElement|null>(null);
  const stepRef=useRef(0);
  const t=translations[lang];

  // Telegram enhancements only: preserve the full website design and navigation.
  useEffect(() => mountTelegram(), []);
  useEffect(() => {
    const app = telegramApp();
    const back = app?.BackButton;
    if (!back) return;
    const closeMenu = () => setMobileOpen(false);
    if (mobileOpen) {
      back.show();
      back.onClick(closeMenu);
    } else {
      back.hide();
    }
    return () => { if (mobileOpen) back.offClick(closeMenu); };
  }, [mobileOpen]);

  useEffect(()=>{
    try { const saved=localStorage.getItem('agrohub-lang'); if(saved==='uz'||saved==='ru'||saved==='en')setLang(saved); } catch {}
  },[]);
  useEffect(()=>{
    document.documentElement.lang=lang;
    document.title=lang==='uz'?'AGROHUB — Daladan bozorgacha':lang==='ru'?'AGROHUB — От поля до рынка':'AGROHUB — From farm to market';
    const meta = document.querySelector<HTMLMetaElement>('meta[name=description]');
    if (meta) meta.content = lang==='uz'
      ? 'AGROHUB — fermerlar, texnika, omborlar, logistika va xaridorlarni birlashtiruvchi raqamli platforma.'
      : lang==='ru' ? 'AGROHUB — цифровая платформа для фермеров, техники, хранения, логистики и торговли.'
      : 'AGROHUB — a digital platform connecting farmers, equipment, storage, logistics and buyers.';
    try { localStorage.setItem('agrohub-lang',lang); } catch {}
  },[lang]);
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els=document.querySelectorAll<HTMLElement>('[data-reveal]');
    if(!('IntersectionObserver' in window)||reduced){els.forEach(e=>e.classList.add('shown'));return;}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('shown');io.unobserve(e.target);}
    }),{threshold:0.07,rootMargin:'0px 0px -35px 0px'});
    els.forEach(e=>io.observe(e));
    return ()=>io.disconnect();
  },[]);
  useEffect(()=>{
    let request=0;
    const handle=()=>{
      if(request)return;
      request=requestAnimationFrame(()=>{
        request=0;
        const el=storyRef.current;
        if(!el)return;
        const rect=el.getBoundingClientRect();
        const distance=Math.max(1,rect.height-window.innerHeight);
        const progress=Math.max(0,Math.min(0.99999,-rect.top/distance));
        const next=Math.min(3,Math.floor(progress*4));
        if(next!==stepRef.current){ stepRef.current=next; setActiveStage(next); }
        el.style.setProperty('--scene-progress',String(progress));
        const hero=document.querySelector<HTMLElement>('.hero-photo img');
        if(hero&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
          const y=Math.min(window.scrollY,window.innerHeight);
          hero.style.transform=`scale(1.025) translate3d(0,${(y*0.09).toFixed(1)}px,0)`;
        }
      });
    };
    handle();window.addEventListener('scroll',handle,{passive:true});window.addEventListener('resize',handle);
    return ()=>{window.removeEventListener('scroll',handle);window.removeEventListener('resize',handle);cancelAnimationFrame(request);};
  },[]);

  const items=useMemo(()=>listingData.filter(item=>{
    if(category!=='all'&&item.category!==category)return false;
    if(region!=='all'&&REGIONS[item.region]!==region)return false;
    const hay=[t.listingTitles[item.title],t.listingDescriptions[item.title],t.locations[item.region],t.categoryNames[CATEGORY_IDS.indexOf(item.category)]].join(' ').toLocaleLowerCase(lang==='ru'?'ru-RU':lang==='en'?'en-US':'uz-UZ');
    return hay.includes(query.trim().toLocaleLowerCase(lang==='ru'?'ru-RU':lang==='en'?'en-US':'uz-UZ'));
  }),[category,region,query,lang]);

  const navigate=(anchor:string,service?:string)=>{
    setMobileOpen(false);
    if(service!==undefined)setForm(prev=>({...prev,service}));
    document.getElementById(anchor)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  const updateForm=(key:keyof FormData,value:string)=>{setForm(p=>({...p,[key]:value}));setSendState('idle');};
  const submit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(sendState==='sending')return;
    if(form.fullName.trim().length<2 || !/^\+?[\d\s()\-]{9,20}$/.test(form.phone)){setSendState('invalid');return;}
    setSendState('sending');
    try {
      if(location.protocol==='file:'){setSendState('offline');return;}
      const initData=telegramInitData();
      const headers: Record<string,string>={'Content-Type':'application/json'};
      if (initData) headers['X-Telegram-Init-Data']=initData;
      const response=await fetch('/api/leads',{method:'POST',headers,body:JSON.stringify(form)});
      if(!response.headers.get('content-type')?.includes('application/json')){setSendState('offline');return;}
      const data=await response.json();
      if(response.ok&&data.ok){setSendState('success');setForm({...initialForm});}
      else setSendState('error');
    }catch{setSendState('offline');}
  };
  const statusMessage=sendState==='success'?t.formSuccess:sendState==='invalid'?t.formInvalid:sendState==='offline'?t.formOffline:sendState==='error'?t.formError:'';

  return <div className="site-shell">
    <header className="site-header" id="top">
      <div className="header-inner">
        <a className="brand" href="#top" onClick={e=>{e.preventDefault();navigate('top');}} aria-label="AGROHUB">
          <span className="brand-symbol"><Icon name="leaf" size={22}/></span><span>AGRO<span className="brand-light">HUB</span></span>
        </a>
        <nav className={`desktop-nav ${mobileOpen?'mobile-visible':''}`} aria-label={t.menu}>
          {['why','services','journey','catalog','contact'].map((id,i)=><a href={'#'+id} key={id} onClick={e=>{e.preventDefault();navigate(id);}}>{t.nav[i]}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label={t.locale}>
            {(['uz','ru','en'] as Language[]).map(code=><button type="button" className={lang===code?'selected':''} key={code} onClick={()=>setLang(code)} aria-pressed={lang===code}>{code.toUpperCase()}</button>)}
          </div>
          <button className="menu-toggle" aria-label={mobileOpen?t.menuClose:t.menu} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(!mobileOpen)}><Icon name={mobileOpen?'close':'menu'} size={23}/></button>
        </div>
      </div>
    </header>

    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photo"><picture><source media="(max-width: 640px)" srcSet={smallImages[0]}/><img src={images[0]} alt="" fetchPriority="high"/></picture></div>
        <div className="hero-filter"/>
        <div className="hero-content container">
          <div className="hero-main" data-reveal>
            <p className="overline hero-overline"><span className="mini-dot"/>{t.heroEyebrow}</p>
            <h1 id="hero-title">{t.heroTitle}<span>{t.heroAccent}</span></h1>
            <p className="hero-description">{t.heroDesc}</p>
            <div className="hero-buttons"><button className="button button-solid" onClick={()=>navigate('services')}>{t.heroPrimary}<Icon name="diagon" size={17}/></button><button className="button button-outline" onClick={()=>navigate('journey')}>{t.heroSecondary}<Icon name="arrow" size={17}/></button></div>
          </div>
          <div className="hero-glass" aria-hidden="true"><div className="hero-glass-mark"><Icon name="leaf" size={25}/></div><div><small>{t.heroBubbleTitle}</small><strong>{t.heroBubbleText}</strong></div></div>
          <div className="hero-bottom"><span className="hero-bottom-line"/><span>{t.heroFoot}</span><span className="scroll-hint">{t.scroll}<span className="scroll-tick"/></span></div>
        </div>
      </section>

      <section className="pillars" aria-label={t.heroFoot}><div className="container pillar-list">{t.pillarLabels.map((label,i)=><button key={i} type="button" onClick={()=>navigate('services',translations.uz.serviceCards[i===0?0:i===1?1:i===2?2:3][0])}><span className="pillar-number">0{i+1}</span><span>{label}</span><Icon name="diagon" size={16}/></button>)}</div></section>

      <section className="why section-space" id="why"><div className="container">
        <div className="why-top" data-reveal><p className="overline dark-overline">{t.eyebrowWhy}</p><div><h2 className="section-title">{t.whyTitle}<br/><span>{t.whyAccent}</span></h2><p className="section-description">{t.whyIntro}</p></div></div>
        <div className="why-grid">{t.whyCards.map(([title,description],i)=><article className="reason" key={i} data-reveal><span className="reason-index">0{i+1}</span><div className="reason-line"/><h3>{title}</h3><p>{description}</p></article>)}</div>
      </div></section>

      <section className="services section-space" id="services"><div className="container"><div className="section-heading" data-reveal><div><p className="overline dark-overline">{t.servicesEye}</p><h2 className="section-title">{t.servicesTitle}<br/><span>{t.servicesAccent}</span></h2></div><p className="section-description">{t.servicesDesc}</p></div>
        <div className="service-grid">{t.serviceCards.map(([title,description,label],i)=><article className="service-card" key={i} data-reveal>
          <div className="service-photo"><img loading="lazy" src={images[[1,2,2,3][i]]} alt=""/><span className="service-pill">{label}</span></div>
          <div className="service-detail"><div><span className="service-index">0{i+1} / 04</span><h3>{title}</h3><p>{description}</p></div><button className="round-arrow" aria-label={`${t.explore}: ${title}`} onClick={()=>navigate('contact',translations.uz.serviceCards[i][0])}><Icon name="diagon" size={19}/></button></div>
        </article>)}</div>
      </div></section>

      <section className="journey" id="journey"><div className="journey-intro container" data-reveal><p className="overline dark-overline">{t.flowEye}</p><h2 className="section-title">{t.flowTitle}<br/><span>{t.flowAccent}</span></h2><p className="section-description">{t.flowDesc}</p></div>
        <div className="journey-track" ref={storyRef}>
          <div className="journey-sticky"><div className="journey-stage container">
            <div className="journey-copy">
              <p className="overline stage-overline"><span className="mini-dot"/>{t.flowCount} 0{activeStage+1} / 04</p>
              <div className="journey-words" aria-live="polite" key={lang+'-'+activeStage}><span className="journey-status">{t.flowSteps[activeStage][2]}</span><h3>{t.flowSteps[activeStage][0]}</h3><p>{t.flowSteps[activeStage][1]}</p></div>
              <div className="journey-progress" aria-label={`${t.flowCount} ${activeStage+1}/4`}><div className="journey-progress-bar"><span style={{width:`${(activeStage+1)*25}%`}}/></div><div className="journey-progress-label"><span>0{activeStage+1}</span><span>04</span></div></div>
              <small className="journey-instruction">{t.flowHint} ↓</small>
            </div>
            <div className="journey-visual" aria-hidden="true"><div className="scene-images">{stageImageIndices.map((photo,i)=><img className={activeStage===i?'active':''} src={images[photo]} alt="" key={i} loading="lazy"/>)}</div><div className="scene-shade"/><div className="scene-orbit scene-orbit-1"/><div className="scene-orbit scene-orbit-2"/><span className="scene-caption">AGROHUB / 0{activeStage+1}</span></div>
          </div></div>
        </div>
      </section>

      <section className="catalog section-space" id="catalog"><div className="container">
        <div className="section-heading" data-reveal><div><p className="overline dark-overline">{t.catalogEye}</p><h2 className="section-title">{t.catalogTitle}<br/><span>{t.catalogAccent}</span></h2></div><p className="section-description">{t.catalogDesc}</p></div>
        <div className="catalog-toolbar" data-reveal><div className="catalog-demo"><span className="small-signal"/>{t.demoBadge}</div><label className="catalog-search"><Icon name="search" size={19}/><span className="sr-only">{t.searchLabel}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.searchPlaceholder}/></label><label className="catalog-region"><span className="sr-only">{t.regionLabel}</span><select value={region} onChange={e=>setRegion(e.target.value)}><option value="all">{t.allRegions}</option>{REGIONS.map((r,i)=><option value={r} key={r}>{t.locations[i]}</option>)}</select><Icon name="chevron" size={15}/></label></div>
        <div className="catalog-tabs" role="group" aria-label={t.categoryLabel}>{CATEGORY_IDS.map((id,i)=><button type="button" key={id} className={category===id?'active':''} onClick={()=>setCategory(id)} aria-pressed={category===id}>{t.categoryNames[i]}</button>)}</div>
        {items.length?<div className="catalog-grid">{items.map(list=><article className="listing" key={list.title}><div className="listing-image"><img loading="lazy" src={list.photo} alt=""/></div><div className="listing-body"><p className="listing-region"><Icon name="pin" size={14}/>{t.locations[list.region]}</p><h3>{t.listingTitles[list.title]}</h3><p>{t.listingDescriptions[list.title]}</p><button onClick={()=>navigate('contact',translations.uz.serviceCards[list.category==='storage'?1:list.category==='equipment'?0:list.category==='transport'?2:3][0])}>{t.listingCTA} <Icon name="arrow" size={16}/></button></div></article>)}</div>:<p className="zero-results" role="status">{t.zeroResults}</p>}
      </div></section>

      <section className="pricing section-space" id="calculator"><div className="container"><div className="pricing-box" data-reveal><div className="pricing-content"><p className="overline dark-overline">{t.pricingEye}</p><h2 className="section-title">{t.pricingTitle}<br/><span>{t.pricingAccent}</span></h2><p className="section-description">{t.pricingDesc}</p></div><div className="pricing-calculator"><label htmlFor="amount">{t.amountLabel}</label><div className="value-big">{formatMoney(amount)} <span>UZS</span></div><input id="amount" type="range" min="500000" max="20000000" step="100000" value={amount} onChange={e=>setAmount(Number(e.target.value))}/><div className="price-row"><span>{t.platformFee}</span><strong>{formatMoney(amount*0.03)} UZS</strong></div><div className="price-row"><span>{t.netAmount}</span><strong>{formatMoney(amount*0.97)} UZS</strong></div><p className="price-note">{t.pricingNote}</p></div></div></div></section>

      <section className="faq section-space" id="faq"><div className="container faq-layout"><div data-reveal><p className="overline dark-overline">{t.faqEye}</p><h2 className="section-title">{t.faqTitle}<br/><span>{t.faqAccent}</span></h2></div><div className="faq-entries">{t.faqs.map(([q,a],i)=><div className={`faq-entry ${expandedFaq===i?'expanded':''}`} key={i}><button onClick={()=>setExpandedFaq(expandedFaq===i?null:i)} aria-expanded={expandedFaq===i} aria-controls={`faq-a-${i}`}><span>{q}</span><Icon name="chevron" size={19}/></button><div id={`faq-a-${i}`} hidden={expandedFaq!==i}><p>{a}</p></div></div>)}</div></div></section>

      <section className="contact section-space" id="contact"><div className="container contact-layout"><div className="contact-intro" data-reveal><p className="overline">{t.contactEye}</p><h2>{t.contactTitle}<br/><span>{t.contactAccent}</span></h2><p>{t.contactDesc}</p><div className="contact-image"><img loading="lazy" src={images[0]} alt=""/></div></div>
        <form className="contact-form" onSubmit={submit} data-reveal><div className="form-grid"><label>{t.formName}<input required minLength={2} maxLength={100} value={form.fullName} onChange={e=>updateForm('fullName',e.target.value)} placeholder={t.formNamePlace}/></label><label>{t.formPhone}<input type="tel" required value={form.phone} onChange={e=>updateForm('phone',e.target.value)} placeholder={t.formPhonePlace}/></label><label>{t.formRegion}<input value={form.region} maxLength={80} onChange={e=>updateForm('region',e.target.value)} placeholder={t.formRegionPlace}/></label><label>{t.formRole}<select value={form.role} onChange={e=>updateForm('role',e.target.value)}>{translations.uz.roles.map((role,i)=><option key={role} value={role}>{t.roles[i]}</option>)}</select></label></div>
          <label>{t.formService}<select value={form.service} onChange={e=>updateForm('service',e.target.value)}><option value="">{t.formServicePlace}</option>{translations.uz.serviceCards.map((service,i)=><option value={service[0]} key={i}>{t.serviceCards[i][0]}</option>)}</select></label>
          <label>{t.formMessage}<textarea rows={3} maxLength={1000} value={form.message} onChange={e=>updateForm('message',e.target.value)} placeholder={t.formMessagePlace}/></label><div className="bot-field" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>updateForm('website',e.target.value)}/></div>
          <button type="submit" disabled={sendState==='sending'} className="button button-solid submit-button">{sendState==='sending'?t.formSending:t.formSubmit}<Icon name="arrow" size={17}/></button>
          {statusMessage&&<p className={`form-status ${sendState==='success'?'success':'warning'}`} role="status">{statusMessage}</p>}
          <p className="form-privacy"><Icon name="check" size={15}/>{t.privacy}</p>
        </form></div></section>
    </main>
    <footer className="footer"><div className="container footer-top"><a className="brand footer-brand" href="#top" onClick={e=>{e.preventDefault();navigate('top');}}><span className="brand-symbol"><Icon name="leaf" size={22}/></span><span>AGRO<span className="brand-light">HUB</span></span></a><p>{t.footerLine}</p><button onClick={()=>navigate('top')}>{t.backTop} ↑</button></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AGROHUB. {t.footerRights}</span><span>{t.footerNotes}</span></div></footer>
  </div>;
}

export default App;
