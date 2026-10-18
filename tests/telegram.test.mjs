import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {verifyTelegramInitData} from '../api/telegram-verify.mjs';

const token='123456:TEST_SECRET_BOT_TOKEN';
const now=1770000000;
const sample={auth_date:String(now-120),query_id:'AAEFAKE',user:JSON.stringify({id:123456789,first_name:'Fermer',username:'fermer_test'})};
function sign(fields=sample){
 const str=Object.entries(fields).sort(([a],[b])=>a.localeCompare(b,'en')).map(([k,v])=>`${k}=${v}`).join('\n');
 const secret=createHmac('sha256','WebAppData').update(token).digest();
 const hash=createHmac('sha256',secret).update(str).digest('hex');
 return new URLSearchParams({...fields,hash}).toString();
}
test('signed Telegram initData accepted',()=>{
 const result=verifyTelegramInitData(sign(),token,now);
 assert.equal(result.ok,true);assert.equal(result.user.id,123456789);
});
test('tampering invalidates signature',()=>assert.equal(verifyTelegramInitData(sign().replace('Fermer','Hacker'),token,now).ok,false));
test('expired initData rejected',()=>assert.equal(verifyTelegramInitData(sign({...sample,auth_date:String(now-86401)}),token,now).reason,'expired'));
test('missing token rejected',()=>assert.equal(verifyTelegramInitData(sign(),'',now).reason,'bot_not_configured'));
test('duplicate fields rejected',()=>assert.equal(verifyTelegramInitData(sign()+'&auth_date=7',token,now).reason,'invalid_fields'));
test('missing hash rejected',()=>assert.equal(verifyTelegramInitData('auth_date=1',token,now).ok,false));
