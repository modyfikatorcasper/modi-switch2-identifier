import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('npm start server serves source HTML, assets and JSON; hides repository configuration',async()=>{
  const server=spawn(process.execPath,[fileURLToPath(new URL('../scripts/serve.mjs',import.meta.url))],{env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
  try {
    const base=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Server startup timed out')),5000);
      server.once('error',error=>{clearTimeout(timer);reject(error);});
      server.once('exit',code=>{clearTimeout(timer);reject(new Error('Server exited: '+code));});
      server.stdout.on('data',buffer=>{const match=String(buffer).match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});
    });
    for(const path of ['/','/assets/app.js','/assets/styles.css','/data/observations.json','/docs/GUIDE.md']) {
      const res=await fetch(base+path);assert.equal(res.status,200,path);assert.ok((await res.text()).length>0);
    }
    assert.equal((await fetch(base+'/.github/workflows/pages.yml')).status,403);
    assert.equal((await fetch(base+'/no-such-file')).status,404);
    const res=await fetch(base+'/data/observations.json');assert.match(res.headers.get('content-type'),/application\/json/);
  } finally {server.kill();}
});
