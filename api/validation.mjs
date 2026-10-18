const roles = new Set(['Fermer','Ombor egasi','Texnika egasi','Logistika xizmati','Xaridor / eksportchi','Boshqa']);
const s=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';
export function validateLead(data){
  if(!data||typeof data!=='object'||Array.isArray(data))return {error:'Ma’lumot formati noto‘g‘ri.'};
  if(s(data.website,50))return {spam:true};
  const fullName=s(data.fullName,100),phone=s(data.phone,30),region=s(data.region,80),role=s(data.role,50),service=s(data.service,120),message=s(data.message,1000);
  if(fullName.length<2 || fullName.length>100)return {error:'Ism-familiyani to‘g‘ri kiriting.'};
  if(!/^\+?[\d\s()\-]{9,20}$/.test(phone))return {error:'Telefon raqami noto‘g‘ri.'};
  if(!roles.has(role))return {error:'Faoliyat turi noto‘g‘ri.'};
  return {value:{full_name:fullName,phone,region,role,service,message}};
}
