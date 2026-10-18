const fs=require('fs');const path=require('path');
let ts; try{ts=require('typescript')}catch{ts=require('/usr/local/slides_js/node_modules/typescript')}
const base=path.resolve(__dirname,'..'),out=path.join(base,'offline');
fs.mkdirSync(out,{recursive:true});
const copy=(from,to)=>fs.cpSync(path.join(base,from),path.join(out,to),{recursive:true,force:true});
copy('public/images','images');copy('public/vendor','vendor');copy('public/favicon.svg','favicon.svg');copy('src/styles.css','styles.css');
let combined=fs.readFileSync(path.join(base,'tools/hooks-compat.txt'),'utf8')+'\n';
for(const file of ['copy.ts','telegram.ts','App.tsx']){
 let code=fs.readFileSync(path.join(base,'src',file),'utf8');
 code=code.replace(/^import[^;]*;\s*/gm,'').replace(/^export default App;\s*/gm,'').replace(/^export /gm,'');
 let result=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2019,jsx:ts.JsxEmit.React,module:ts.ModuleKind.None},reportDiagnostics:true});
 if(result.diagnostics?.some(x=>x.category===ts.DiagnosticCategory.Error))throw Error(result.diagnostics.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('\n'));
 combined+=result.outputText+'\n';
}
combined+='window.AGROHUB_APP=OfflineHooks.App;\n';
fs.writeFileSync(path.join(out,'app.js'),combined);
let html=fs.readFileSync(path.join(base,'index.html'),'utf8').replace('<script type="module" src="/src/main.tsx"></script>','<link rel="stylesheet" href="/styles.css"/><script src="/vendor/react.production.min.js"></script><script src="/vendor/react-dom.production.min.js"></script><script src="/app.js"></script><script>ReactDOM.render(React.createElement(window.AGROHUB_APP),document.getElementById("root"));</script>');
fs.writeFileSync(path.join(out,'index.html'),html);
console.log('Offline site compiled:',out);
