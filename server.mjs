import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateLead} from './api/validation.mjs';
import {verifyTelegramInitData} from './api/telegram-verify.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const webroot=path.join(root,'offline');
const store=path.join(root,'data','leads.jsonl');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon'};
const recent=new Map();
const server=http.createServer(async(req,res)=>{
 const respond=(status,data,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff',...headers});res.end(JSON.stringify(data));};
 if(req.url?.split('?')[0]==='/api/leads'){
  if(req.method!=='POST')return respond(405,{error:'Faqat POST so‘rovi qabul qilinadi.'},{Allow:'POST'});
  const ip=req.socket.remoteAddress||'unknown';const now=Date.now();const entry=recent.get(ip)||[];const retained=entry.filter(t=>now-t<600000);
  if(retained.length>=10)return respond(429,{error:'Ko‘p so‘rov yuborildi. Keyinroq urinib ko‘ring.'});
  recent.set(ip,retained);
  let data='';
  for await (const chunk of req){data+=chunk;if(data.length>16384)return respond(413,{error:'So‘rov juda katta.'});}
  let json;try{json=JSON.parse(data)}catch{return respond(400,{error:'Noto‘g‘ri JSON.'})}
  let telegramUser=null;
  const rawInitData=req.headers['x-telegram-init-data'];
  if(rawInitData){
   const verified=verifyTelegramInitData(rawInitData,process.env.TELEGRAM_BOT_TOKEN);
   if(!verified.ok)return respond(verified.reason==='bot_not_configured'?503:401,{error:'Telegram sessiyasini tasdiqlab bo‘lmadi.'});
   telegramUser=verified.user;
  }
  const parsed=validateLead(json);if(parsed.spam)return respond(201,{ok:true});if(parsed.error)return respond(400,{error:parsed.error});
  try{await fs.mkdir(path.dirname(store),{recursive:true});await fs.appendFile(store,JSON.stringify({...parsed.value,...(telegramUser?{telegram_user_id:telegramUser.id}:{}),created_at:new Date().toISOString()})+'\n',{mode:0o600});retained.push(now);return respond(201,{ok:true})}catch{return respond(500,{error:'Saqlash amalga oshmadi.'})}
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end()}
 let requested;try{requested=decodeURIComponent(req.url?.split('?')[0]||'/')}catch{res.writeHead(400);return res.end()}
 const safe=requested==='/'?'index.html':requested.replace(/^\/+/, '');
 if(safe.includes('\0')||safe.split('/').includes('..')){res.writeHead(403);return res.end()}
 const target=path.resolve(webroot,safe);if(!target.startsWith(webroot+path.sep)){res.writeHead(403);return res.end()}
 try{const stat=await fs.stat(target);if(!stat.isFile())throw Error('not file');const data=await fs.readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':safe==='index.html'?'no-cache':'public, max-age=3600'});if(req.method==='HEAD')return res.end();res.end(data)}catch{res.writeHead(404);res.end('Not found')}
});
const port=Number(process.env.PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log(`AGROHUB local preview: http://127.0.0.1:${port}`));
