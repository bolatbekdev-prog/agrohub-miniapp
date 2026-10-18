import {validateLead} from './validation.mjs';
import {verifyTelegramInitData} from './telegram-verify.mjs';
/** Vercel API handler. Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. */
export default async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Faqat POST qabul qilinadi.'});}
 if(Number(req.headers['content-length']||0)>16384)return res.status(413).json({error:'So‘rov hajmi katta.'});
 // Telegram identity is accepted only after HMAC verification using the server-side bot token.
 const rawInitData=req.headers['x-telegram-init-data'];
 let telegramUser=null;
 if(rawInitData){
  const auth=verifyTelegramInitData(rawInitData,process.env.TELEGRAM_BOT_TOKEN);
  if(!auth.ok)return res.status(auth.reason==='bot_not_configured'?503:401).json({error:'Telegram sessiyasi tekshirilmadi.'});
  telegramUser=auth.user;
 }
 const parsed=validateLead(req.body);
 if(parsed.spam)return res.status(200).json({ok:true});
 if(parsed.error)return res.status(400).json({error:parsed.error});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return res.status(503).json({error:'Ariza saqlash xizmati hali sozlanmagan.'});
 try{
  const r=await fetch(url.replace(/\/$/,'')+'/rest/v1/leads',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({...parsed.value,...(telegramUser?{telegram_user_id:telegramUser.id}:{})}),signal:AbortSignal.timeout(8000)});
  if(!r.ok){console.error('Supabase error status',r.status);return res.status(502).json({error:'Arizani saqlab bo‘lmadi.'});}
  return res.status(201).json({ok:true});
 }catch(e){console.error('Supabase API error',e?.name);return res.status(502).json({error:'Ulanishda xatolik.'});}
}
