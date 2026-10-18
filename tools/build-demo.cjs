const fs=require('fs'),path=require('path');
const dir=path.resolve(__dirname,'..');const off=path.join(dir,'offline');
const images=fs.readdirSync(path.join(off,'images')).filter(x=>x.endsWith('.webp'));
let app=fs.readFileSync(path.join(off,'app.js'),'utf8');
for(const name of images){let base64=fs.readFileSync(path.join(off,'images',name)).toString('base64');app=app.replaceAll('/images/'+name,'data:image/webp;base64,'+base64);}
const svg=fs.readFileSync(path.join(off,'favicon.svg'),'utf8').replace(/"/g,"'");
let css=fs.readFileSync(path.join(off,'styles.css'),'utf8');
const a=fs.readFileSync(path.join(off,'vendor/react.production.min.js'),'utf8');
const b=fs.readFileSync(path.join(off,'vendor/react-dom.production.min.js'),'utf8');
let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
html=html.replace(/<link rel="preconnect"[^>]*\/>/g,'').replace(/<link href="https:\/\/fonts.googleapis.com[^>]+>/g,'');
html=html.replace(/<link rel="icon"[^>]*\/>/,'').replace('</head>',`<style>${css}</style></head>`);
html=html.replace('<script type="module" src="/src/main.tsx"></script>',`<script>${a}</script><script>${b}</script><script>${app}</script><script>ReactDOM.render(React.createElement(window.AGROHUB_APP),document.getElementById('root'));</script>`);
fs.writeFileSync(path.join(dir,'AGROHUB_Interactive_Demo.html'),html);
console.log('Standalone demo',Math.round(Buffer.byteLength(html)/1024),'KiB');
