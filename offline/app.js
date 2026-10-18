const OfflineHooks = (() => {
 let current = null;
 const same = (a,b) => Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
 function slot(){ if(!current) throw Error('Hook used outside render'); return [current,current._cursor++]; }
 function useState(initial){ const [inst,i]=slot(); if(!inst._slots[i]) {const value=typeof initial==='function'?initial():initial;const item={value};item.setter=(v)=>{item.value=typeof v==='function'?v(item.value):v;inst.forceUpdate();};inst._slots[i]=item;} return [inst._slots[i].value,inst._slots[i].setter]; }
 function useRef(initial){const [inst,i]=slot();if(!inst._slots[i]){const ref=node=>{ref.current=node};ref.current=initial;inst._slots[i]={value:ref};}return inst._slots[i].value;}
 function useMemo(fn,deps){const [inst,i]=slot();const prev=inst._slots[i];if(!prev||!same(prev.deps,deps)){const value=fn();inst._slots[i]={value,deps};return value;}return prev.value;}
 function useEffect(fn,deps){const [inst,i]=slot();const prev=inst._slots[i];if(!prev||!same(prev.deps,deps)){inst._pending.push(()=>{if(prev?.cleanup)prev.cleanup();const cleanup=fn();inst._slots[i]={deps,cleanup:typeof cleanup==='function'?cleanup:null};});}}
 class ReactHooksPage extends React.Component{
  constructor(p){super(p);this._slots=[];this._pending=[];this._cursor=0;}
  render(){this._cursor=0;current=this;try{return App(this.props);}finally{current=null;}}
  componentDidMount(){this.flush();}
  componentDidUpdate(){this.flush();}
  flush(){const effects=this._pending.splice(0);effects.forEach(fn=>fn());}
  componentWillUnmount(){this._slots.forEach(x=>{if(x?.cleanup)x.cleanup();});}
 }
 return {useState,useEffect,useRef,useMemo,App:ReactHooksPage};
})();
const {useState,useEffect,useRef,useMemo}=OfflineHooks;

const uz = {
    nav: ['Platforma', 'Xizmatlar', 'Jarayon', 'Katalog', 'Bog‘lanish'],
    menu: 'Menyu', menuClose: 'Menyuni yopish', locale: 'Sayt tili',
    heroEyebrow: 'QISHLOQ XO‘JALIGI UCHUN RAQAMLI PLATFORMA',
    heroTitle: 'Daladan bozorgacha.', heroAccent: 'Hammasi bir joyda.',
    heroDesc: 'Texnika, ombor, transport va xaridor topish endi osonroq. Fermer va xizmat ko‘rsatuvchilarni bitta platformada bog‘laymiz.',
    heroPrimary: 'Xizmatlarni ko‘rish', heroSecondary: 'Qanday ishlaydi?',
    heroFoot: 'Bir platforma. Ko‘proq imkoniyat.',
    heroBubbleTitle: 'AGROHUB bilan', heroBubbleText: 'fermerlikning keyingi bosqichi',
    scroll: 'Pastga aylantiring',
    pillarLabels: ['Texnika ijarasi', 'Ombor va saqlash', 'Transport', 'Sotish va eksport'],
    eyebrowWhy: 'NIMA UCHUN AGROHUB?',
    whyTitle: 'Fermerning vaqti', whyAccent: 'eng qimmat resurs.',
    whyIntro: 'Hosil yetishtirish yetarlicha murakkab. Xizmat topish esa bunga qo‘shimcha tashvish bo‘lmasligi kerak.',
    whyCards: [
        ['Bir joyda', 'Kerakli xizmatlar turli manzillarda emas, bitta platformada.'],
        ['Oson qidiruv', 'Hududingiz va ehtiyojingizga mos takliflarni saralang.'],
        ['Aniq jarayon', 'Xizmatni tanlashdan hamkor bilan bog‘lanishgacha tushunarli yo‘l.']
    ],
    servicesEye: 'SIZGA KERAK BO‘LGAN XIZMATLAR',
    servicesTitle: 'Har bir bosqich uchun', servicesAccent: 'o‘z yechimi.',
    servicesDesc: 'Hosilni yetishtirishdan xaridorgacha — asosiy xizmatlarni bitta tizimda izlang.',
    serviceCards: [
        ['Texnika ijarasi', 'Traktor, kombayn va dala ishlari uchun uskunalar.', 'Texnika'],
        ['Ombor va saqlash', 'Mahsulotni saqlash uchun mos ombor va sovutkichlar.', 'Saqlash'],
        ['Transport va logistika', 'Mahsulotni kerakli manzilga yetkazish xizmatlari.', 'Logistika'],
        ['Savdo va eksport', 'Mahalliy va xalqaro xaridorlar bilan aloqalar.', 'Savdo']
    ],
    explore: 'Batafsil',
    flowEye: 'QANDAY ISHLAYDI?',
    flowTitle: 'To‘rt qadam.', flowAccent: 'Bitta yaxlit jarayon.',
    flowDesc: 'Pastga aylantiring. Sahna o‘z joyida qoladi, jarayon esa sekin-asta keyingi bosqichga o‘tadi.',
    flowSteps: [
        ['Ehtiyojni belgilang', 'Sizga qanday xizmat kerakligini tanlang: texnika, ombor, transport yoki xaridor.', 'Boshlanish'],
        ['Mos variantni toping', 'Hudud va xizmat turiga qarab demo-katalogdagi variantlarni saralang.', 'Qidiruv'],
        ['Hamkor bilan bog‘laning', 'So‘rov yuboring. Jamoa yoki xizmat ko‘rsatuvchi bilan keyingi qadamlarni kelishib oling.', 'Hamkorlik'],
        ['Mahsulotni bozorga olib chiqing', 'Saqlash, tashish va sotish bosqichlarini yagona zanjir sifatida rejalashtiring.', 'Natija']
    ],
    flowCount: 'BOSQICH', flowHint: 'Davom etish uchun aylantiring',
    catalogEye: 'PLATFORMA IMKONIYATLARI',
    catalogTitle: 'O‘zingizga mos xizmatni', catalogAccent: 'tanlang.',
    catalogDesc: 'Quyidagilar — platforma qanday ishlashini ko‘rsatadigan namunaviy e’lonlar. Ular hozircha haqiqiy band qilish taklifi emas.',
    demoBadge: 'DEMO KATALOG',
    searchLabel: 'Xizmat qidirish', searchPlaceholder: 'Xizmat nomi yoki hudud…',
    categoryLabel: 'Xizmat turi', regionLabel: 'Hudud', allRegions: 'Barcha hududlar',
    categoryNames: ['Barchasi', 'Ombor', 'Texnika', 'Transport', 'Eksport'],
    locations: ['Toshkent', 'Samarqand', 'Farg‘ona', 'Buxoro', 'Nukus'],
    listingTitles: ['Sovutkichli ombor', 'Traktor va agregatlar', 'Sovutkichli transport', 'Eksport hamkorligi', 'Hosil yig‘ish texnikasi', 'Saralash va qadoqlash'],
    listingDescriptions: ['Meva-sabzavotni saqlash imkoniyati', 'Yerga ishlov berish uskunalari', 'Harorat nazoratidagi yuk tashish', 'Xaridorlar bilan aloqa o‘rnatish', 'Kombayn va yordamchi uskunalar', 'Mahsulotni sotishga tayyorlash'],
    listingCTA: 'So‘rov qoldirish', zeroResults: 'Mos variant topilmadi. Qidiruv yoki filtrlarni o‘zgartiring.',
    pricingEye: 'SHAFFOF YONDASHUV', pricingTitle: 'Hisob-kitob ham', pricingAccent: 'tushunarli.',
    pricingDesc: 'Rejalashtirilayotgan marketplace modeli uchun 3% komissiya hisobini ko‘ring. Yakuniy xizmat shartlari hamkorlikda aniqlanadi.',
    amountLabel: 'Xizmat qiymati', platformFee: 'Platforma komissiyasi · 3%', netAmount: 'Qoladigan summa',
    pricingNote: 'Bu misol — kalkulyator, to‘lov yoki rasmiy narx taklifi emas.',
    contactEye: 'BIRGA ISHLAYMIZ', contactTitle: 'Agro sohasidagi keyingi qadamingiz', contactAccent: 'shu yerdan boshlanadi.',
    contactDesc: 'Fermer, ombor egasi yoki xizmat ko‘rsatuvchimisiz? Bizga yozing — hamkorlik imkoniyatlarini muhokama qilamiz.',
    formName: 'Ism-familiya', formNamePlace: 'Ismingiz va familiyangiz', formPhone: 'Telefon raqami', formPhonePlace: '+998 90 123 45 67',
    formRegion: 'Hududingiz', formRegionPlace: 'Viloyat yoki shahar', formRole: 'Faoliyat turi',
    roles: ['Fermer', 'Ombor egasi', 'Texnika egasi', 'Logistika xizmati', 'Xaridor / eksportchi', 'Boshqa'],
    formService: 'Qiziqtirgan xizmat', formServicePlace: 'Xizmatni tanlang',
    formMessage: 'Qo‘shimcha izoh', formMessagePlace: 'Ehtiyojingiz haqida qisqacha yozing (ixtiyoriy)',
    formSubmit: 'So‘rov yuborish', formSending: 'Yuborilmoqda…',
    formSuccess: 'So‘rovingiz qabul qilindi. Tez orada siz bilan bog‘lanamiz.',
    formError: 'So‘rov yuborilmadi. Keyinroq qayta urinib ko‘ring.',
    formInvalid: 'Iltimos, ism va telefon raqamini to‘g‘ri kiriting.',
    formOffline: 'Demo rejimida so‘rov saqlanmaydi. Saqlash uchun saytni API server bilan ishga tushiring.',
    privacy: 'Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi.',
    faqEye: 'TEZ-TEZ SO‘RALADIGAN SAVOLLAR', faqTitle: 'Savollaringizga', faqAccent: 'oddiy javob.',
    faqs: [
        ['AGROHUB nima?', 'AGROHUB — fermerlar va qishloq xo‘jaligi xizmatlarini ko‘rsatuvchilarni birlashtirishga mo‘ljallangan platforma.'],
        ['Hozir xizmatni band qilish mumkinmi?', 'Saytdagi katalog demo shaklida. Hozircha xizmatni bevosita band qilish yoki onlayn to‘lash funksiyasi mavjud emas.'],
        ['Komissiya qancha?', 'Loyiha uchun rejalashtirilgan komissiya 3%. Yakuniy shartlar tegishli xizmat bo‘yicha aniqlashtiriladi.']
    ],
    footerLine: 'Daladan bozorgacha — bitta tizimda.', footerNotes: 'Demo platforma · O‘zbekiston', footerRights: 'Barcha huquqlar himoyalangan.', backTop: 'Yuqoriga',
};
const ru = {
    nav: ['Платформа', 'Услуги', 'Как это работает', 'Каталог', 'Контакты'],
    menu: 'Меню', menuClose: 'Закрыть меню', locale: 'Язык сайта',
    heroEyebrow: 'ЦИФРОВАЯ ПЛАТФОРМА ДЛЯ СЕЛЬСКОГО ХОЗЯЙСТВА',
    heroTitle: 'От поля до рынка.', heroAccent: 'Всё в одном месте.',
    heroDesc: 'Найти технику, склад, транспорт и покупателей становится проще. Мы объединяем фермеров и поставщиков услуг на одной платформе.',
    heroPrimary: 'Смотреть услуги', heroSecondary: 'Как это работает?',
    heroFoot: 'Одна платформа. Больше возможностей.',
    heroBubbleTitle: 'Вместе с AGROHUB', heroBubbleText: 'к новому этапу сельского хозяйства',
    scroll: 'Прокрутите вниз',
    pillarLabels: ['Аренда техники', 'Склады и хранение', 'Транспорт', 'Продажи и экспорт'],
    eyebrowWhy: 'ПОЧЕМУ AGROHUB?',
    whyTitle: 'Время фермера —', whyAccent: 'самый ценный ресурс.',
    whyIntro: 'Выращивать урожай и без того непросто. Поиск нужных услуг не должен становиться дополнительной проблемой.',
    whyCards: [
        ['Всё в одном месте', 'Нужные услуги собраны на одной платформе.'],
        ['Удобный поиск', 'Выбирайте предложения по региону и потребностям.'],
        ['Понятный процесс', 'Простой путь от выбора услуги до связи с партнёром.']
    ],
    servicesEye: 'УСЛУГИ ДЛЯ ВАШЕГО ХОЗЯЙСТВА',
    servicesTitle: 'Для каждого этапа —', servicesAccent: 'своё решение.',
    servicesDesc: 'От выращивания урожая до встречи с покупателем — находите основные услуги в единой системе.',
    serviceCards: [
        ['Аренда техники', 'Тракторы, комбайны и оборудование для полевых работ.', 'Техника'],
        ['Склады и хранение', 'Подходящие склады и холодильные камеры для продукции.', 'Хранение'],
        ['Транспорт и логистика', 'Доставка продукции в нужное место.', 'Логистика'],
        ['Торговля и экспорт', 'Контакты с местными и зарубежными покупателями.', 'Торговля']
    ],
    explore: 'Подробнее',
    flowEye: 'КАК ЭТО РАБОТАЕТ?',
    flowTitle: 'Четыре шага.', flowAccent: 'Один понятный процесс.',
    flowDesc: 'Прокрутите страницу. Сцена останется на месте, а этапы будут плавно сменять друг друга.',
    flowSteps: [
        ['Определите потребность', 'Выберите нужную услугу: техника, склад, транспорт или поиск покупателей.', 'Начало'],
        ['Найдите подходящий вариант', 'Отфильтруйте предложения демонстрационного каталога по региону и типу услуги.', 'Поиск'],
        ['Свяжитесь с партнёром', 'Оставьте заявку и обсудите следующие шаги с командой или поставщиком услуг.', 'Сотрудничество'],
        ['Выведите продукцию на рынок', 'Планируйте хранение, доставку и продажу как единую цепочку.', 'Результат']
    ],
    flowCount: 'ЭТАП', flowHint: 'Прокрутите для продолжения',
    catalogEye: 'ВОЗМОЖНОСТИ ПЛАТФОРМЫ',
    catalogTitle: 'Найдите то,', catalogAccent: 'что вам нужно.',
    catalogDesc: 'Ниже представлены примеры объявлений, демонстрирующие работу платформы. Пока это не реальные предложения для бронирования.',
    demoBadge: 'ДЕМОКАТАЛОГ',
    searchLabel: 'Поиск услуг', searchPlaceholder: 'Услуга или регион…',
    categoryLabel: 'Тип услуги', regionLabel: 'Регион', allRegions: 'Все регионы',
    categoryNames: ['Все', 'Склады', 'Техника', 'Транспорт', 'Экспорт'],
    locations: ['Ташкент', 'Самарканд', 'Фергана', 'Бухара', 'Нукус'],
    listingTitles: ['Холодильный склад', 'Тракторы и оборудование', 'Рефрижераторный транспорт', 'Экспортное партнёрство', 'Уборочная техника', 'Сортировка и упаковка'],
    listingDescriptions: ['Хранение фруктов и овощей', 'Оборудование для обработки земли', 'Перевозки с контролем температуры', 'Поиск и взаимодействие с покупателями', 'Комбайны и вспомогательная техника', 'Подготовка продукции к продаже'],
    listingCTA: 'Оставить заявку', zeroResults: 'Подходящих вариантов нет. Измените запрос или фильтры.',
    pricingEye: 'ПРОЗРАЧНЫЕ УСЛОВИЯ', pricingTitle: 'Расчёты тоже', pricingAccent: 'должны быть простыми.',
    pricingDesc: 'Посмотрите пример расчёта комиссии 3% для планируемой модели маркетплейса. Итоговые условия определяются при сотрудничестве.',
    amountLabel: 'Стоимость услуги', platformFee: 'Комиссия платформы · 3%', netAmount: 'Оставшаяся сумма',
    pricingNote: 'Это демонстрационный калькулятор, а не оплата или официальное ценовое предложение.',
    contactEye: 'ДАВАЙТЕ РАБОТАТЬ ВМЕСТЕ', contactTitle: 'Ваш следующий шаг', contactAccent: 'начинается здесь.',
    contactDesc: 'Вы фермер, владелец склада или поставщик услуг? Напишите нам — обсудим возможности сотрудничества.',
    formName: 'Имя и фамилия', formNamePlace: 'Ваше имя и фамилия', formPhone: 'Номер телефона', formPhonePlace: '+998 90 123 45 67',
    formRegion: 'Ваш регион', formRegionPlace: 'Область или город', formRole: 'Вид деятельности',
    roles: ['Фермер', 'Владелец склада', 'Владелец техники', 'Логистическая компания', 'Покупатель / экспортёр', 'Другое'],
    formService: 'Интересующая услуга', formServicePlace: 'Выберите услугу',
    formMessage: 'Комментарий', formMessagePlace: 'Кратко опишите ваш запрос (необязательно)',
    formSubmit: 'Отправить заявку', formSending: 'Отправка…',
    formSuccess: 'Заявка получена. Мы свяжемся с вами в ближайшее время.',
    formError: 'Не удалось отправить заявку. Попробуйте ещё раз позже.',
    formInvalid: 'Пожалуйста, правильно укажите имя и номер телефона.',
    formOffline: 'В деморежиме заявка не сохраняется. Для сохранения запустите сайт с API-сервером.',
    privacy: 'Ваши данные используются только для связи с вами.',
    faqEye: 'ЧАСТЫЕ ВОПРОСЫ', faqTitle: 'Простые ответы', faqAccent: 'на ваши вопросы.',
    faqs: [
        ['Что такое AGROHUB?', 'AGROHUB — платформа, призванная объединить фермеров и поставщиков сельскохозяйственных услуг.'],
        ['Можно ли забронировать услугу прямо сейчас?', 'Каталог пока работает в демонстрационном режиме. Прямое бронирование и онлайн-оплата ещё недоступны.'],
        ['Какая комиссия?', 'Планируемая комиссия проекта — 3%. Окончательные условия уточняются для каждой услуги.']
    ],
    footerLine: 'От поля до рынка — в одной системе.', footerNotes: 'Демо-платформа · Узбекистан', footerRights: 'Все права защищены.', backTop: 'Наверх',
};
const en = {
    nav: ['Platform', 'Services', 'How it works', 'Directory', 'Contact'],
    menu: 'Menu', menuClose: 'Close menu', locale: 'Website language',
    heroEyebrow: 'A DIGITAL PLATFORM FOR AGRICULTURE',
    heroTitle: 'From farm to market.', heroAccent: 'All in one place.',
    heroDesc: 'Finding equipment, storage, transport and buyers should be easier. We connect farmers and service providers on one platform.',
    heroPrimary: 'Explore services', heroSecondary: 'How it works',
    heroFoot: 'One platform. More possibilities.',
    heroBubbleTitle: 'With AGROHUB', heroBubbleText: 'a simpler way forward for agriculture',
    scroll: 'Scroll to explore',
    pillarLabels: ['Equipment rental', 'Storage facilities', 'Transport', 'Trade and export'],
    eyebrowWhy: 'WHY AGROHUB?',
    whyTitle: 'A farmer’s time', whyAccent: 'is invaluable.',
    whyIntro: 'Growing a crop is demanding enough. Finding the right services should not add another layer of complexity.',
    whyCards: [
        ['One place', 'Discover essential agricultural services on one platform.'],
        ['Simple search', 'Filter options by location and what you need.'],
        ['Clear next steps', 'An understandable path from finding a service to contacting a partner.']
    ],
    servicesEye: 'SERVICES THAT WORK FOR YOU',
    servicesTitle: 'The right solution', servicesAccent: 'at every stage.',
    servicesDesc: 'From growing a crop to reaching a buyer, find essential services within one ecosystem.',
    serviceCards: [
        ['Equipment rental', 'Tractors, harvesters and equipment for fieldwork.', 'Equipment'],
        ['Storage facilities', 'Suitable warehouses and cold rooms for your produce.', 'Storage'],
        ['Transport and logistics', 'Services to get your produce where it needs to go.', 'Logistics'],
        ['Trade and export', 'Connections with local and international buyers.', 'Trade']
    ],
    explore: 'Explore',
    flowEye: 'HOW IT WORKS',
    flowTitle: 'Four steps.', flowAccent: 'One clear process.',
    flowDesc: 'Keep scrolling. The scene stays in place while the journey unfolds, one step at a time.',
    flowSteps: [
        ['Tell us what you need', 'Choose a service: equipment, storage, transport or connections with buyers.', 'Start'],
        ['Find the right fit', 'Browse sample listings by region and service category.', 'Discover'],
        ['Connect with a partner', 'Send an enquiry and discuss the next steps with the team or service provider.', 'Connect'],
        ['Bring produce to market', 'Plan storage, delivery and sales as one connected journey.', 'Grow']
    ],
    flowCount: 'STEP', flowHint: 'Scroll to continue',
    catalogEye: 'EXPLORE THE PLATFORM',
    catalogTitle: 'Find a service', catalogAccent: 'that fits.',
    catalogDesc: 'These example listings demonstrate how the platform works. They are not live bookings or verified service offers yet.',
    demoBadge: 'DEMO DIRECTORY',
    searchLabel: 'Search services', searchPlaceholder: 'Service or location…',
    categoryLabel: 'Service type', regionLabel: 'Region', allRegions: 'All regions',
    categoryNames: ['All', 'Storage', 'Equipment', 'Transport', 'Export'],
    locations: ['Tashkent', 'Samarkand', 'Fergana', 'Bukhara', 'Nukus'],
    listingTitles: ['Refrigerated storage', 'Tractors and implements', 'Refrigerated transport', 'Export partnerships', 'Harvesting equipment', 'Sorting and packing'],
    listingDescriptions: ['Fruit and vegetable storage', 'Machinery for soil preparation', 'Temperature-controlled transport', 'Connecting with prospective buyers', 'Harvesters and supporting machinery', 'Preparing produce for sale'],
    listingCTA: 'Send an enquiry', zeroResults: 'No matching services found. Try another search or filter.',
    pricingEye: 'CLEAR AND TRANSPARENT', pricingTitle: 'Straightforward', pricingAccent: 'numbers.',
    pricingDesc: 'Explore a sample 3% commission calculation for the planned marketplace model. Final terms will be agreed with service partners.',
    amountLabel: 'Service value', platformFee: 'Platform commission · 3%', netAmount: 'Remaining amount',
    pricingNote: 'This is an illustrative calculator, not a payment feature or a binding quote.',
    contactEye: 'LET’S WORK TOGETHER', contactTitle: 'Your next step', contactAccent: 'starts here.',
    contactDesc: 'Are you a farmer, storage owner or service provider? Get in touch and explore opportunities to collaborate.',
    formName: 'Full name', formNamePlace: 'Your full name', formPhone: 'Phone number', formPhonePlace: '+998 90 123 45 67',
    formRegion: 'Your region', formRegionPlace: 'Region or city', formRole: 'Your role',
    roles: ['Farmer', 'Storage owner', 'Equipment owner', 'Logistics provider', 'Buyer / exporter', 'Other'],
    formService: 'Interested service', formServicePlace: 'Choose a service',
    formMessage: 'Additional details', formMessagePlace: 'Tell us what you need (optional)',
    formSubmit: 'Send enquiry', formSending: 'Sending…',
    formSuccess: 'Your enquiry has been received. We will be in touch soon.',
    formError: 'We could not send your enquiry. Please try again later.',
    formInvalid: 'Please enter a valid name and phone number.',
    formOffline: 'Enquiries are not saved in demo mode. Run the site with its API server to save them.',
    privacy: 'Your details are used only to contact you about your enquiry.',
    faqEye: 'FREQUENTLY ASKED QUESTIONS', faqTitle: 'Clear answers', faqAccent: 'to common questions.',
    faqs: [
        ['What is AGROHUB?', 'AGROHUB is a platform designed to connect farmers with agricultural service providers.'],
        ['Can I book a service right now?', 'The directory currently contains sample listings. Direct booking and online payments are not available yet.'],
        ['What is the commission?', 'The planned platform commission is 3%. Final terms will be confirmed for each service.']
    ],
    footerLine: 'From farm to market, in one place.', footerNotes: 'Demo platform · Uzbekistan', footerRights: 'All rights reserved.', backTop: 'Back to top',
};
const translations = { uz, ru, en };
const CATEGORY_IDS = ['all', 'storage', 'equipment', 'transport', 'export'];
const REGIONS = ['Toshkent', 'Samarqand', 'Farg‘ona', 'Buxoro', 'Nukus'];

/** Do not rely on initDataUnsafe for authentication. Only signed initData goes to the API. */
function telegramApp() {
    var _a;
    const app = (_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp;
    if (!app || typeof app.ready !== 'function')
        return null;
    // The SDK can exist in a normal browser, but no Telegram session has been established.
    const parameters = `${window.location.search}&${window.location.hash}`;
    return app.initData || (app.platform && app.platform !== 'unknown') || /tgWebApp(Data|Platform|Version|ThemeParams)/.test(parameters) ? app : null;
}
function telegramInitData() {
    var _a;
    return ((_a = telegramApp()) === null || _a === void 0 ? void 0 : _a.initData) || '';
}
/** Call once, inside the React app. No UI elements are added. */
function mountTelegram() {
    var _a, _b, _c, _d, _e;
    const app = telegramApp();
    if (!app)
        return () => { };
    const root = document.documentElement;
    root.classList.add('agrohub-in-telegram');
    const syncInsets = () => {
        const inset = app.contentSafeAreaInset || app.safeAreaInset || {};
        // Nonnegative numeric values only, never a raw CSS string from an external source.
        const safe = (v) => Math.max(0, Math.min(100, Number(v) || 0));
        root.style.setProperty('--agro-tg-top', `${safe(inset.top)}px`);
        root.style.setProperty('--agro-tg-bottom', `${safe(inset.bottom)}px`);
    };
    syncInsets();
    (_a = app.onEvent) === null || _a === void 0 ? void 0 : _a.call(app, 'safeAreaChanged', syncInsets);
    (_b = app.onEvent) === null || _b === void 0 ? void 0 : _b.call(app, 'contentSafeAreaChanged', syncInsets);
    try {
        (_c = app.setHeaderColor) === null || _c === void 0 ? void 0 : _c.call(app, '#18372a');
    }
    catch { /* older Telegram clients */ }
    try {
        (_d = app.setBackgroundColor) === null || _d === void 0 ? void 0 : _d.call(app, '#f7f8f5');
    }
    catch { /* older Telegram clients */ }
    try {
        (_e = app.setBottomBarColor) === null || _e === void 0 ? void 0 : _e.call(app, '#f7f8f5');
    }
    catch { /* older Telegram clients */ }
    app.expand();
    // Reveal the WebView after React has committed the first interface.
    app.ready();
    return () => {
        var _a, _b;
        (_a = app.offEvent) === null || _a === void 0 ? void 0 : _a.call(app, 'safeAreaChanged', syncInsets);
        (_b = app.offEvent) === null || _b === void 0 ? void 0 : _b.call(app, 'contentSafeAreaChanged', syncInsets);
        root.classList.remove('agrohub-in-telegram');
        root.style.removeProperty('--agro-tg-top');
        root.style.removeProperty('--agro-tg-bottom');
    };
}

const images = ['/images/landscape.webp', '/images/machines.webp', '/images/warehouse.webp', '/images/export.webp'];
const smallImages = ['/images/landscape-sm.webp', '/images/machines-sm.webp', '/images/warehouse-sm.webp', '/images/export-sm.webp'];
const listingData = [
    { category: 'storage', region: 0, photo: smallImages[2], title: 0 },
    { category: 'equipment', region: 1, photo: smallImages[1], title: 1 },
    { category: 'transport', region: 2, photo: smallImages[2], title: 2 },
    { category: 'export', region: 0, photo: smallImages[3], title: 3 },
    { category: 'equipment', region: 3, photo: smallImages[1], title: 4 },
    { category: 'storage', region: 4, photo: smallImages[2], title: 5 }
];
const stageImageIndices = [0, 1, 2, 3];
const formatMoney = (value) => new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 }).format(value);
function Icon({ name, size = 20 }) {
    var _a;
    const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.65, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
    const paths = {
        arrow: React.createElement("g", null,
            React.createElement("path", { d: "M4 12h16M13 5l7 7-7 7" })),
        diagon: React.createElement("g", null,
            React.createElement("path", { d: "M6 18 18 6M8 6h10v10" })),
        menu: React.createElement("g", null,
            React.createElement("path", { d: "M4 7h16M4 12h16M4 17h16" })),
        close: React.createElement("g", null,
            React.createElement("path", { d: "M5 5 19 19M19 5 5 19" })),
        search: React.createElement("g", null,
            React.createElement("circle", { cx: "10.5", cy: "10.5", r: "6.5" }),
            React.createElement("path", { d: "m16 16 5 5" })),
        chevron: React.createElement("g", null,
            React.createElement("path", { d: "m6 9 6 6 6-6" })),
        pin: React.createElement("g", null,
            React.createElement("path", { d: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z" }),
            React.createElement("circle", { cx: "12", cy: "10", r: "2.5" })),
        check: React.createElement("g", null,
            React.createElement("path", { d: "m5 12 5 5L20 6" })),
        leaf: React.createElement("g", null,
            React.createElement("path", { d: "M20 4C11 4 5 7 5 14a6 6 0 0 0 6 6c7 0 10-8 9-16Z" }),
            React.createElement("path", { d: "M5 20c1-6 6-10 12-12" })),
        grid: React.createElement("g", null,
            React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
            React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
            React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
            React.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })),
        clock: React.createElement("g", null,
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("path", { d: "M12 7v5l3 2" })),
        link: React.createElement("g", null,
            React.createElement("path", { d: "M10 13a5 5 0 0 0 7 .2l3-3a5 5 0 0 0-7-7l-2 2" }),
            React.createElement("path", { d: "M14 11a5 5 0 0 0-7-.2l-3 3a5 5 0 1 0 7 7l2-2" })),
    };
    return React.createElement("svg", { ...props }, (_a = paths[name]) !== null && _a !== void 0 ? _a : paths.arrow);
}
const initialForm = { fullName: '', phone: '', region: '', role: 'Fermer', service: '', message: '', website: '' };
function App() {
    const [lang, setLang] = useState('uz');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeStage, setActiveStage] = useState(0);
    const [category, setCategory] = useState('all');
    const [region, setRegion] = useState('all');
    const [query, setQuery] = useState('');
    const [amount, setAmount] = useState(3000000);
    const [expandedFaq, setExpandedFaq] = useState(0);
    const [form, setForm] = useState(initialForm);
    const [sendState, setSendState] = useState('idle');
    const storyRef = useRef(null);
    const stepRef = useRef(0);
    const t = translations[lang];
    // Telegram enhancements only: preserve the full website design and navigation.
    useEffect(() => mountTelegram(), []);
    useEffect(() => {
        const app = telegramApp();
        const back = app === null || app === void 0 ? void 0 : app.BackButton;
        if (!back)
            return;
        const closeMenu = () => setMobileOpen(false);
        if (mobileOpen) {
            back.show();
            back.onClick(closeMenu);
        }
        else {
            back.hide();
        }
        return () => { if (mobileOpen)
            back.offClick(closeMenu); };
    }, [mobileOpen]);
    useEffect(() => {
        try {
            const saved = localStorage.getItem('agrohub-lang');
            if (saved === 'uz' || saved === 'ru' || saved === 'en')
                setLang(saved);
        }
        catch { }
    }, []);
    useEffect(() => {
        document.documentElement.lang = lang;
        document.title = lang === 'uz' ? 'AGROHUB — Daladan bozorgacha' : lang === 'ru' ? 'AGROHUB — От поля до рынка' : 'AGROHUB — From farm to market';
        const meta = document.querySelector('meta[name=description]');
        if (meta)
            meta.content = lang === 'uz'
                ? 'AGROHUB — fermerlar, texnika, omborlar, logistika va xaridorlarni birlashtiruvchi raqamli platforma.'
                : lang === 'ru' ? 'AGROHUB — цифровая платформа для фермеров, техники, хранения, логистики и торговли.'
                    : 'AGROHUB — a digital platform connecting farmers, equipment, storage, logistics and buyers.';
        try {
            localStorage.setItem('agrohub-lang', lang);
        }
        catch { }
    }, [lang]);
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const els = document.querySelectorAll('[data-reveal]');
        if (!('IntersectionObserver' in window) || reduced) {
            els.forEach(e => e.classList.add('shown'));
            return;
        }
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('shown');
                io.unobserve(e.target);
            }
        }), { threshold: 0.07, rootMargin: '0px 0px -35px 0px' });
        els.forEach(e => io.observe(e));
        return () => io.disconnect();
    }, []);
    useEffect(() => {
        let request = 0;
        const handle = () => {
            if (request)
                return;
            request = requestAnimationFrame(() => {
                request = 0;
                const el = storyRef.current;
                if (!el)
                    return;
                const rect = el.getBoundingClientRect();
                const distance = Math.max(1, rect.height - window.innerHeight);
                const progress = Math.max(0, Math.min(0.99999, -rect.top / distance));
                const next = Math.min(3, Math.floor(progress * 4));
                if (next !== stepRef.current) {
                    stepRef.current = next;
                    setActiveStage(next);
                }
                el.style.setProperty('--scene-progress', String(progress));
                const hero = document.querySelector('.hero-photo img');
                if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    const y = Math.min(window.scrollY, window.innerHeight);
                    hero.style.transform = `scale(1.025) translate3d(0,${(y * 0.09).toFixed(1)}px,0)`;
                }
            });
        };
        handle();
        window.addEventListener('scroll', handle, { passive: true });
        window.addEventListener('resize', handle);
        return () => { window.removeEventListener('scroll', handle); window.removeEventListener('resize', handle); cancelAnimationFrame(request); };
    }, []);
    const items = useMemo(() => listingData.filter(item => {
        if (category !== 'all' && item.category !== category)
            return false;
        if (region !== 'all' && REGIONS[item.region] !== region)
            return false;
        const hay = [t.listingTitles[item.title], t.listingDescriptions[item.title], t.locations[item.region], t.categoryNames[CATEGORY_IDS.indexOf(item.category)]].join(' ').toLocaleLowerCase(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ');
        return hay.includes(query.trim().toLocaleLowerCase(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ'));
    }), [category, region, query, lang]);
    const navigate = (anchor, service) => {
        var _a;
        setMobileOpen(false);
        if (service !== undefined)
            setForm(prev => ({ ...prev, service }));
        (_a = document.getElementById(anchor)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    const updateForm = (key, value) => { setForm(p => ({ ...p, [key]: value })); setSendState('idle'); };
    const submit = async (e) => {
        var _a;
        e.preventDefault();
        if (sendState === 'sending')
            return;
        if (form.fullName.trim().length < 2 || !/^\+?[\d\s()\-]{9,20}$/.test(form.phone)) {
            setSendState('invalid');
            return;
        }
        setSendState('sending');
        try {
            if (location.protocol === 'file:') {
                setSendState('offline');
                return;
            }
            const initData = telegramInitData();
            const headers = { 'Content-Type': 'application/json' };
            if (initData)
                headers['X-Telegram-Init-Data'] = initData;
            const response = await fetch('/api/leads', { method: 'POST', headers, body: JSON.stringify(form) });
            if (!((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
                setSendState('offline');
                return;
            }
            const data = await response.json();
            if (response.ok && data.ok) {
                setSendState('success');
                setForm({ ...initialForm });
            }
            else
                setSendState('error');
        }
        catch {
            setSendState('offline');
        }
    };
    const statusMessage = sendState === 'success' ? t.formSuccess : sendState === 'invalid' ? t.formInvalid : sendState === 'offline' ? t.formOffline : sendState === 'error' ? t.formError : '';
    return React.createElement("div", { className: "site-shell" },
        React.createElement("header", { className: "site-header", id: "top" },
            React.createElement("div", { className: "header-inner" },
                React.createElement("a", { className: "brand", href: "#top", onClick: e => { e.preventDefault(); navigate('top'); }, "aria-label": "AGROHUB" },
                    React.createElement("span", { className: "brand-symbol" },
                        React.createElement(Icon, { name: "leaf", size: 22 })),
                    React.createElement("span", null,
                        "AGRO",
                        React.createElement("span", { className: "brand-light" }, "HUB"))),
                React.createElement("nav", { className: `desktop-nav ${mobileOpen ? 'mobile-visible' : ''}`, "aria-label": t.menu }, ['why', 'services', 'journey', 'catalog', 'contact'].map((id, i) => React.createElement("a", { href: '#' + id, key: id, onClick: e => { e.preventDefault(); navigate(id); } }, t.nav[i]))),
                React.createElement("div", { className: "header-actions" },
                    React.createElement("div", { className: "language-switch", role: "group", "aria-label": t.locale }, ['uz', 'ru', 'en'].map(code => React.createElement("button", { type: "button", className: lang === code ? 'selected' : '', key: code, onClick: () => setLang(code), "aria-pressed": lang === code }, code.toUpperCase()))),
                    React.createElement("button", { className: "menu-toggle", "aria-label": mobileOpen ? t.menuClose : t.menu, "aria-expanded": mobileOpen, onClick: () => setMobileOpen(!mobileOpen) },
                        React.createElement(Icon, { name: mobileOpen ? 'close' : 'menu', size: 23 }))))),
        React.createElement("main", null,
            React.createElement("section", { className: "hero", "aria-labelledby": "hero-title" },
                React.createElement("div", { className: "hero-photo" },
                    React.createElement("picture", null,
                        React.createElement("source", { media: "(max-width: 640px)", srcSet: smallImages[0] }),
                        React.createElement("img", { src: images[0], alt: "", fetchPriority: "high" }))),
                React.createElement("div", { className: "hero-filter" }),
                React.createElement("div", { className: "hero-content container" },
                    React.createElement("div", { className: "hero-main", "data-reveal": true },
                        React.createElement("p", { className: "overline hero-overline" },
                            React.createElement("span", { className: "mini-dot" }),
                            t.heroEyebrow),
                        React.createElement("h1", { id: "hero-title" },
                            t.heroTitle,
                            React.createElement("span", null, t.heroAccent)),
                        React.createElement("p", { className: "hero-description" }, t.heroDesc),
                        React.createElement("div", { className: "hero-buttons" },
                            React.createElement("button", { className: "button button-solid", onClick: () => navigate('services') },
                                t.heroPrimary,
                                React.createElement(Icon, { name: "diagon", size: 17 })),
                            React.createElement("button", { className: "button button-outline", onClick: () => navigate('journey') },
                                t.heroSecondary,
                                React.createElement(Icon, { name: "arrow", size: 17 })))),
                    React.createElement("div", { className: "hero-glass", "aria-hidden": "true" },
                        React.createElement("div", { className: "hero-glass-mark" },
                            React.createElement(Icon, { name: "leaf", size: 25 })),
                        React.createElement("div", null,
                            React.createElement("small", null, t.heroBubbleTitle),
                            React.createElement("strong", null, t.heroBubbleText))),
                    React.createElement("div", { className: "hero-bottom" },
                        React.createElement("span", { className: "hero-bottom-line" }),
                        React.createElement("span", null, t.heroFoot),
                        React.createElement("span", { className: "scroll-hint" },
                            t.scroll,
                            React.createElement("span", { className: "scroll-tick" }))))),
            React.createElement("section", { className: "pillars", "aria-label": t.heroFoot },
                React.createElement("div", { className: "container pillar-list" }, t.pillarLabels.map((label, i) => React.createElement("button", { key: i, type: "button", onClick: () => navigate('services', translations.uz.serviceCards[i === 0 ? 0 : i === 1 ? 1 : i === 2 ? 2 : 3][0]) },
                    React.createElement("span", { className: "pillar-number" },
                        "0",
                        i + 1),
                    React.createElement("span", null, label),
                    React.createElement(Icon, { name: "diagon", size: 16 }))))),
            React.createElement("section", { className: "why section-space", id: "why" },
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "why-top", "data-reveal": true },
                        React.createElement("p", { className: "overline dark-overline" }, t.eyebrowWhy),
                        React.createElement("div", null,
                            React.createElement("h2", { className: "section-title" },
                                t.whyTitle,
                                React.createElement("br", null),
                                React.createElement("span", null, t.whyAccent)),
                            React.createElement("p", { className: "section-description" }, t.whyIntro))),
                    React.createElement("div", { className: "why-grid" }, t.whyCards.map(([title, description], i) => React.createElement("article", { className: "reason", key: i, "data-reveal": true },
                        React.createElement("span", { className: "reason-index" },
                            "0",
                            i + 1),
                        React.createElement("div", { className: "reason-line" }),
                        React.createElement("h3", null, title),
                        React.createElement("p", null, description)))))),
            React.createElement("section", { className: "services section-space", id: "services" },
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "section-heading", "data-reveal": true },
                        React.createElement("div", null,
                            React.createElement("p", { className: "overline dark-overline" }, t.servicesEye),
                            React.createElement("h2", { className: "section-title" },
                                t.servicesTitle,
                                React.createElement("br", null),
                                React.createElement("span", null, t.servicesAccent))),
                        React.createElement("p", { className: "section-description" }, t.servicesDesc)),
                    React.createElement("div", { className: "service-grid" }, t.serviceCards.map(([title, description, label], i) => React.createElement("article", { className: "service-card", key: i, "data-reveal": true },
                        React.createElement("div", { className: "service-photo" },
                            React.createElement("img", { loading: "lazy", src: images[[1, 2, 2, 3][i]], alt: "" }),
                            React.createElement("span", { className: "service-pill" }, label)),
                        React.createElement("div", { className: "service-detail" },
                            React.createElement("div", null,
                                React.createElement("span", { className: "service-index" },
                                    "0",
                                    i + 1,
                                    " / 04"),
                                React.createElement("h3", null, title),
                                React.createElement("p", null, description)),
                            React.createElement("button", { className: "round-arrow", "aria-label": `${t.explore}: ${title}`, onClick: () => navigate('contact', translations.uz.serviceCards[i][0]) },
                                React.createElement(Icon, { name: "diagon", size: 19 })))))))),
            React.createElement("section", { className: "journey", id: "journey" },
                React.createElement("div", { className: "journey-intro container", "data-reveal": true },
                    React.createElement("p", { className: "overline dark-overline" }, t.flowEye),
                    React.createElement("h2", { className: "section-title" },
                        t.flowTitle,
                        React.createElement("br", null),
                        React.createElement("span", null, t.flowAccent)),
                    React.createElement("p", { className: "section-description" }, t.flowDesc)),
                React.createElement("div", { className: "journey-track", ref: storyRef },
                    React.createElement("div", { className: "journey-sticky" },
                        React.createElement("div", { className: "journey-stage container" },
                            React.createElement("div", { className: "journey-copy" },
                                React.createElement("p", { className: "overline stage-overline" },
                                    React.createElement("span", { className: "mini-dot" }),
                                    t.flowCount,
                                    " 0",
                                    activeStage + 1,
                                    " / 04"),
                                React.createElement("div", { className: "journey-words", "aria-live": "polite", key: lang + '-' + activeStage },
                                    React.createElement("span", { className: "journey-status" }, t.flowSteps[activeStage][2]),
                                    React.createElement("h3", null, t.flowSteps[activeStage][0]),
                                    React.createElement("p", null, t.flowSteps[activeStage][1])),
                                React.createElement("div", { className: "journey-progress", "aria-label": `${t.flowCount} ${activeStage + 1}/4` },
                                    React.createElement("div", { className: "journey-progress-bar" },
                                        React.createElement("span", { style: { width: `${(activeStage + 1) * 25}%` } })),
                                    React.createElement("div", { className: "journey-progress-label" },
                                        React.createElement("span", null,
                                            "0",
                                            activeStage + 1),
                                        React.createElement("span", null, "04"))),
                                React.createElement("small", { className: "journey-instruction" },
                                    t.flowHint,
                                    " \u2193")),
                            React.createElement("div", { className: "journey-visual", "aria-hidden": "true" },
                                React.createElement("div", { className: "scene-images" }, stageImageIndices.map((photo, i) => React.createElement("img", { className: activeStage === i ? 'active' : '', src: images[photo], alt: "", key: i, loading: "lazy" }))),
                                React.createElement("div", { className: "scene-shade" }),
                                React.createElement("div", { className: "scene-orbit scene-orbit-1" }),
                                React.createElement("div", { className: "scene-orbit scene-orbit-2" }),
                                React.createElement("span", { className: "scene-caption" },
                                    "AGROHUB / 0",
                                    activeStage + 1)))))),
            React.createElement("section", { className: "catalog section-space", id: "catalog" },
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "section-heading", "data-reveal": true },
                        React.createElement("div", null,
                            React.createElement("p", { className: "overline dark-overline" }, t.catalogEye),
                            React.createElement("h2", { className: "section-title" },
                                t.catalogTitle,
                                React.createElement("br", null),
                                React.createElement("span", null, t.catalogAccent))),
                        React.createElement("p", { className: "section-description" }, t.catalogDesc)),
                    React.createElement("div", { className: "catalog-toolbar", "data-reveal": true },
                        React.createElement("div", { className: "catalog-demo" },
                            React.createElement("span", { className: "small-signal" }),
                            t.demoBadge),
                        React.createElement("label", { className: "catalog-search" },
                            React.createElement(Icon, { name: "search", size: 19 }),
                            React.createElement("span", { className: "sr-only" }, t.searchLabel),
                            React.createElement("input", { value: query, onChange: e => setQuery(e.target.value), placeholder: t.searchPlaceholder })),
                        React.createElement("label", { className: "catalog-region" },
                            React.createElement("span", { className: "sr-only" }, t.regionLabel),
                            React.createElement("select", { value: region, onChange: e => setRegion(e.target.value) },
                                React.createElement("option", { value: "all" }, t.allRegions),
                                REGIONS.map((r, i) => React.createElement("option", { value: r, key: r }, t.locations[i]))),
                            React.createElement(Icon, { name: "chevron", size: 15 }))),
                    React.createElement("div", { className: "catalog-tabs", role: "group", "aria-label": t.categoryLabel }, CATEGORY_IDS.map((id, i) => React.createElement("button", { type: "button", key: id, className: category === id ? 'active' : '', onClick: () => setCategory(id), "aria-pressed": category === id }, t.categoryNames[i]))),
                    items.length ? React.createElement("div", { className: "catalog-grid" }, items.map(list => React.createElement("article", { className: "listing", key: list.title },
                        React.createElement("div", { className: "listing-image" },
                            React.createElement("img", { loading: "lazy", src: list.photo, alt: "" })),
                        React.createElement("div", { className: "listing-body" },
                            React.createElement("p", { className: "listing-region" },
                                React.createElement(Icon, { name: "pin", size: 14 }),
                                t.locations[list.region]),
                            React.createElement("h3", null, t.listingTitles[list.title]),
                            React.createElement("p", null, t.listingDescriptions[list.title]),
                            React.createElement("button", { onClick: () => navigate('contact', translations.uz.serviceCards[list.category === 'storage' ? 1 : list.category === 'equipment' ? 0 : list.category === 'transport' ? 2 : 3][0]) },
                                t.listingCTA,
                                " ",
                                React.createElement(Icon, { name: "arrow", size: 16 })))))) : React.createElement("p", { className: "zero-results", role: "status" }, t.zeroResults))),
            React.createElement("section", { className: "pricing section-space", id: "calculator" },
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "pricing-box", "data-reveal": true },
                        React.createElement("div", { className: "pricing-content" },
                            React.createElement("p", { className: "overline dark-overline" }, t.pricingEye),
                            React.createElement("h2", { className: "section-title" },
                                t.pricingTitle,
                                React.createElement("br", null),
                                React.createElement("span", null, t.pricingAccent)),
                            React.createElement("p", { className: "section-description" }, t.pricingDesc)),
                        React.createElement("div", { className: "pricing-calculator" },
                            React.createElement("label", { htmlFor: "amount" }, t.amountLabel),
                            React.createElement("div", { className: "value-big" },
                                formatMoney(amount),
                                " ",
                                React.createElement("span", null, "UZS")),
                            React.createElement("input", { id: "amount", type: "range", min: "500000", max: "20000000", step: "100000", value: amount, onChange: e => setAmount(Number(e.target.value)) }),
                            React.createElement("div", { className: "price-row" },
                                React.createElement("span", null, t.platformFee),
                                React.createElement("strong", null,
                                    formatMoney(amount * 0.03),
                                    " UZS")),
                            React.createElement("div", { className: "price-row" },
                                React.createElement("span", null, t.netAmount),
                                React.createElement("strong", null,
                                    formatMoney(amount * 0.97),
                                    " UZS")),
                            React.createElement("p", { className: "price-note" }, t.pricingNote))))),
            React.createElement("section", { className: "faq section-space", id: "faq" },
                React.createElement("div", { className: "container faq-layout" },
                    React.createElement("div", { "data-reveal": true },
                        React.createElement("p", { className: "overline dark-overline" }, t.faqEye),
                        React.createElement("h2", { className: "section-title" },
                            t.faqTitle,
                            React.createElement("br", null),
                            React.createElement("span", null, t.faqAccent))),
                    React.createElement("div", { className: "faq-entries" }, t.faqs.map(([q, a], i) => React.createElement("div", { className: `faq-entry ${expandedFaq === i ? 'expanded' : ''}`, key: i },
                        React.createElement("button", { onClick: () => setExpandedFaq(expandedFaq === i ? null : i), "aria-expanded": expandedFaq === i, "aria-controls": `faq-a-${i}` },
                            React.createElement("span", null, q),
                            React.createElement(Icon, { name: "chevron", size: 19 })),
                        React.createElement("div", { id: `faq-a-${i}`, hidden: expandedFaq !== i },
                            React.createElement("p", null, a))))))),
            React.createElement("section", { className: "contact section-space", id: "contact" },
                React.createElement("div", { className: "container contact-layout" },
                    React.createElement("div", { className: "contact-intro", "data-reveal": true },
                        React.createElement("p", { className: "overline" }, t.contactEye),
                        React.createElement("h2", null,
                            t.contactTitle,
                            React.createElement("br", null),
                            React.createElement("span", null, t.contactAccent)),
                        React.createElement("p", null, t.contactDesc),
                        React.createElement("div", { className: "contact-image" },
                            React.createElement("img", { loading: "lazy", src: images[0], alt: "" }))),
                    React.createElement("form", { className: "contact-form", onSubmit: submit, "data-reveal": true },
                        React.createElement("div", { className: "form-grid" },
                            React.createElement("label", null,
                                t.formName,
                                React.createElement("input", { required: true, minLength: 2, maxLength: 100, value: form.fullName, onChange: e => updateForm('fullName', e.target.value), placeholder: t.formNamePlace })),
                            React.createElement("label", null,
                                t.formPhone,
                                React.createElement("input", { type: "tel", required: true, value: form.phone, onChange: e => updateForm('phone', e.target.value), placeholder: t.formPhonePlace })),
                            React.createElement("label", null,
                                t.formRegion,
                                React.createElement("input", { value: form.region, maxLength: 80, onChange: e => updateForm('region', e.target.value), placeholder: t.formRegionPlace })),
                            React.createElement("label", null,
                                t.formRole,
                                React.createElement("select", { value: form.role, onChange: e => updateForm('role', e.target.value) }, translations.uz.roles.map((role, i) => React.createElement("option", { key: role, value: role }, t.roles[i]))))),
                        React.createElement("label", null,
                            t.formService,
                            React.createElement("select", { value: form.service, onChange: e => updateForm('service', e.target.value) },
                                React.createElement("option", { value: "" }, t.formServicePlace),
                                translations.uz.serviceCards.map((service, i) => React.createElement("option", { value: service[0], key: i }, t.serviceCards[i][0])))),
                        React.createElement("label", null,
                            t.formMessage,
                            React.createElement("textarea", { rows: 3, maxLength: 1000, value: form.message, onChange: e => updateForm('message', e.target.value), placeholder: t.formMessagePlace })),
                        React.createElement("div", { className: "bot-field", "aria-hidden": "true" },
                            React.createElement("input", { tabIndex: -1, autoComplete: "off", value: form.website, onChange: e => updateForm('website', e.target.value) })),
                        React.createElement("button", { type: "submit", disabled: sendState === 'sending', className: "button button-solid submit-button" },
                            sendState === 'sending' ? t.formSending : t.formSubmit,
                            React.createElement(Icon, { name: "arrow", size: 17 })),
                        statusMessage && React.createElement("p", { className: `form-status ${sendState === 'success' ? 'success' : 'warning'}`, role: "status" }, statusMessage),
                        React.createElement("p", { className: "form-privacy" },
                            React.createElement(Icon, { name: "check", size: 15 }),
                            t.privacy))))),
        React.createElement("footer", { className: "footer" },
            React.createElement("div", { className: "container footer-top" },
                React.createElement("a", { className: "brand footer-brand", href: "#top", onClick: e => { e.preventDefault(); navigate('top'); } },
                    React.createElement("span", { className: "brand-symbol" },
                        React.createElement(Icon, { name: "leaf", size: 22 })),
                    React.createElement("span", null,
                        "AGRO",
                        React.createElement("span", { className: "brand-light" }, "HUB"))),
                React.createElement("p", null, t.footerLine),
                React.createElement("button", { onClick: () => navigate('top') },
                    t.backTop,
                    " \u2191")),
            React.createElement("div", { className: "container footer-bottom" },
                React.createElement("span", null,
                    "\u00A9 ",
                    new Date().getFullYear(),
                    " AGROHUB. ",
                    t.footerRights),
                React.createElement("span", null, t.footerNotes))));
}

window.AGROHUB_APP=OfflineHooks.App;
