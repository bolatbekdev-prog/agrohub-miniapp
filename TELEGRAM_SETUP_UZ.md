# AGROHUB 5.0 — Telegram Mini App ulash

AGROHUB saytining dizayni, rasmlari, 3 ta tili, scroll animatsiyalari, xizmatlar katalogi va kalkulyatori **saqlangan**. Telegram ichida faqat kerakli integratsiyalar faollashadi.

## 1. Saytni HTTPS bilan joylashtiring

Telegram Mini App **ochiq HTTPS domenida** ishlashi kerak. Lokal `http://127.0.0.1:4173` faqat sinov uchun; `.zip` yoki `file://` Telegram Mini App URL sifatida ishlamaydi.

**Tavsiya: Vercel.** Loyihani GitHub yoki Vercel CLI orqali import qiling. Vercel `package.json` va `vercel.json` asosida Vite frontendni deploy qiladi.

- Framework: Vite
- Build command: `npm run build`
- Output: `dist`
- Environment: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (agar arizalarni saqlash kerak bo‘lsa)
- Environment: `TELEGRAM_BOT_TOKEN` (agar Telegram foydalanuvchi identifikatorini tekshirish va ariza bilan bog‘lash kerak bo‘lsa)
- `supabase.sql` ni Supabase SQL Editor orqali ishga tushiring.

Token va `SUPABASE_SERVICE_ROLE_KEY` ni hech qachon HTML/React/frontendga yozmang yoki boshqalarga yubormang. Ularni faqat hostingning **Environment Variables** bo‘limiga qo‘ying.

Frontendni backend ishlatmasdan sinash uchun `offline/` papkasini statik hostingga joylashtirish mumkin, ammo bunday holatda `/api/leads` so‘rovlarini qabul qiladigan backend bo‘lmaydi.

## 2. Mavjud Telegram botga ulang

Agar siz oldin ishlatgan **@Ferdoo_bot** botidan foydalanmoqchi bo‘lsangiz:

1. Telegramdagi rasmiy **@BotFather** chatini oching.
2. `/mybots` → kerakli botni tanlang.
3. `Bot Settings` → `Configure Mini App` → `Enable Mini App` (yoki mavjud interfeysdagi shunga mos bo‘lim).
4. Joylashtirilgan saytning **HTTPS** manzilini ko‘rsating, masalan `https://agrohub.example.com`.
5. `Bot Settings` → `Menu Button` yoki `/setmenubutton` orqali tugma nomini `AGROHUB` qilib, shu HTTPS URL ni kiriting.
6. Telegram'da botni ochib, `AGROHUB` / `Launch app` tugmasini bosing.

### Menu Button'ni avtomatik sozlash

Bot tokenini oshkor qilmasdan, **faqat o‘zingizning kompyuteringizda**:

```bash
export TELEGRAM_BOT_TOKEN='BOTFATHER_DAGI_TOKEN'
export MINI_APP_URL='https://sizning-agrohub-domeningiz.vercel.app'
node bot/configure-menu.mjs
```

Ushbu skript mavjud botning boshqa komandalarini, webhookini yoki serverini o‘zgartirmaydi: faqat menu button URL va nomini sozlaydi.

## 3. Telegram Mini App nima qila oladi?

- `Telegram.WebApp.ready()` orqali ochilish yuklash ekranini yakunlaydi.
- `expand()` orqali Telegram oynasini kengaytiradi.
- Telegram status/header va fon ranglarini AGROHUB dizayni bilan moslashtiradi.
- `safeAreaInset` / `contentSafeAreaInset` orqali telefon yuqori/pastki paneliga tegib ketishni oldini oladi.
- Mobil menyu ochilganda Telegram Back tugmasi uni yopadi.
- `Telegram.WebApp.initData` mavjud bo‘lsa, ariza API ga yuboriladi; server uni HMAC-SHA256 bilan `TELEGRAM_BOT_TOKEN` orqali tekshiradi.
- Telegram ichidan tashqarida xuddi eski v5 sayt sifatida ochiladi.

`initDataUnsafe`ga ishonib identifikatsiya qilinmaydi. Bot tokeni frontendga chiqmaydi. `sendData()` ishlatilmaydi: u faqat Telegram Keyboard Button orqali ishga tushirilgan Mini App'larda tegishli xizmat xabarini yuboradi, Menu Button uchun umumiy usul emas.

## 4. Test va o‘rnatish

```bash
npm install
npm run dev
npm test
npm run build
```

Vite paketlarini o‘rnatish uchun internet kerak. Offline frontendni Node bilan ko‘rish:

```bash
node server.mjs
```

So‘ng `http://127.0.0.1:4173` ochiladi. Bir faylli `AGROHUB_Interactive_Demo.html` oddiy brauzerda ko‘rish uchun; Telegram Mini App'da esa **host qilingan HTTPS sayt** ochilishi zarur.

## 5. Hozirgi cheklovlar

- Ushbu paket botga **avtomatik ulanib qolmaydi**: buning uchun hostingdagi haqiqiy URL va botni boshqarish huquqi kerak.
- Katalogdagi xizmatlar namuna ma'lumotlari, real buyurtmalar emas.
- Production arizalari uchun Supabase va Telegram token sozlanishi kerak.
- Real Telegram mobil ilovasidagi yakuniy sinov domen va bot ulangandan keyin bajariladi.
