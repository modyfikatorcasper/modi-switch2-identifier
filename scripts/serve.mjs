import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const projectRoot=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const root=process.argv.includes('--dist')?path.join(projectRoot,'dist'):projectRoot;
const port=Number(process.env.PORT || 4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const relative=pathname.replace(/^\/+/, '') || 'index.html';
    const file=path.resolve(root,relative);
    if(!file.startsWith(root+path.sep)||relative.split(/[\\/]/).some(p=>p.startsWith('.')&&p!=='.nojekyll')){res.writeHead(403).end('Forbidden');return;}
    if(!(await stat(file)).isFile()){res.writeHead(404).end('Not found');return;}
    const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(body);
  } catch {res.writeHead(404).end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
