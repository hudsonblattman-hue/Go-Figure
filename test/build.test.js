import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildSite} from '../scripts/build.mjs';

test('a change to an imported module or stylesheet gets a fresh browser URL',async()=>{
 const work=resolve(dirname(fileURLToPath(import.meta.url)),'../work');
 await mkdir(work,{recursive:true});
 const temporary=await mkdtemp(join(work,'build-test-'));
 try{
  const source=join(temporary,'public'),destination=join(temporary,'dist');
  await mkdir(join(source,'assets'),{recursive:true});
  await writeFile(join(source,'assets','sample.txt'),'asset');
  await writeFile(join(source,'index.html'),'<link rel="stylesheet" href="style.css"><script type="module" src="app.js"></script>');
  await writeFile(join(source,'app.js'),"import {value} from './game.js'; console.log(value);");
  await writeFile(join(source,'game.js'),'export const value="old game";');
  await writeFile(join(source,'style.css'),'body{color:black}');
  const first=await buildSite({source,destination});
  assert.deepEqual(await buildSite({source,destination}),first);
  await writeFile(join(source,'game.js'),'export const value="revised game";');
  await writeFile(join(source,'style.css'),'body{color:green}');
  const revised=await buildSite({source,destination});
  assert.notEqual(revised.script,first.script);
  assert.notEqual(revised.style,first.style);
  assert.notEqual(revised.version,first.version);
  const html=await readFile(join(destination,'index.html'),'utf8');
  assert.ok(html.includes(revised.script)&&html.includes(revised.style));
  assert.ok(!html.includes(first.script)&&!html.includes(first.style));
  assert.ok((await readFile(join(destination,revised.script),'utf8')).includes('revised game'));
  assert.equal(await readFile(join(destination,'assets','sample.txt'),'utf8'),'asset');
 }finally{await rm(temporary,{recursive:true,force:true});}
});
