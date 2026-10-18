import {createHmac, timingSafeEqual} from 'node:crypto';

/** Verify Telegram's signed WebApp.initData, never initDataUnsafe. */
export function verifyTelegramInitData(raw, botToken, nowSeconds=Math.floor(Date.now()/1000)) {
  if (typeof raw !== 'string' || !raw || raw.length > 8192) return {ok:false, reason:'missing_or_long'};
  if (typeof botToken !== 'string' || !botToken.trim()) return {ok:false, reason:'bot_not_configured'};

  const params = new URLSearchParams(raw);
  const fields = Array.from(params.entries());
  const keys = fields.map(([key])=>key);
  if (new Set(keys).size !== keys.length || !params.has('hash')) return {ok:false, reason:'invalid_fields'};

  const expectedHash = params.get('hash') || '';
  if (!/^[a-f0-9]{64}$/i.test(expectedHash)) return {ok:false, reason:'invalid_hash'};
  const authDate = Number(params.get('auth_date'));
  if (!Number.isSafeInteger(authDate) || authDate > nowSeconds + 300 || nowSeconds - authDate > 86400) {
    return {ok:false, reason:'expired'};
  }

  const checkString = fields.filter(([key])=>key !== 'hash')
    .sort(([a],[b])=>a.localeCompare(b,'en'))
    .map(([key,value])=>`${key}=${value}`)
    .join('\n');
  const secret = createHmac('sha256','WebAppData').update(botToken).digest();
  const actualHash = createHmac('sha256',secret).update(checkString).digest();
  if (!timingSafeEqual(Buffer.from(expectedHash,'hex'), actualHash)) return {ok:false, reason:'invalid_signature'};

  let user = null;
  const userText = params.get('user');
  if (userText) {
    try {
      const parsed=JSON.parse(userText);
      if (parsed && Number.isSafeInteger(parsed.id) && parsed.id > 0) {
        user={id:parsed.id, first_name:String(parsed.first_name||'').slice(0,128), username:String(parsed.username||'').slice(0,128)};
      }
    } catch { return {ok:false, reason:'malformed_user'}; }
  }
  return {ok:true,user,authDate};
}
