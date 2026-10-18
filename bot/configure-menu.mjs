/** One-time configuration of the existing Telegram bot's menu button.
 * Does not use getUpdates, change existing webhook handlers or expose the token to users.
 * Run: TELEGRAM_BOT_TOKEN=... MINI_APP_URL=https://... node bot/configure-menu.mjs
 */
const token=process.env.TELEGRAM_BOT_TOKEN;
const url=process.env.MINI_APP_URL;
if (!token || !url) {
  console.error('TELEGRAM_BOT_TOKEN va MINI_APP_URL qiymatlari kerak.');
  process.exit(1);
}
let parsed;
try {parsed=new URL(url);} catch {console.error('MINI_APP_URL to‘g‘ri HTTPS havola bo‘lishi kerak.');process.exit(1);}
if (parsed.protocol !== 'https:') {
  console.error('Mini App uchun HTTPS domen talab qilinadi.');
  process.exit(1);
}
const response=await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`,{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({menu_button:{type:'web_app',text:'AGROHUB',web_app:{url:parsed.toString()}}})
});
const data=await response.json();
if (!response.ok || !data.ok) {
  console.error('Telegram menu button ulanmadi:',data.description||response.status);
  process.exit(1);
}
console.log('Bot menyusida AGROHUB Mini App tugmasi faollashtirildi.');
