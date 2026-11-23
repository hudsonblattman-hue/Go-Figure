import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {cp,mkdir,readFile,rm,writeFile} from 'node:fs/promises';
import {basename,dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const hash=content=>createHash('sha256').update(content).digest('hex').slice(0,12);

export async function buildSite({source=join(root,'public'),destination=join(root,'dist')}={}){
 await rm(destination,{recursive:true,force:true});
 await mkdir(join(destination,'assets'),{recursive:true});
 const result=await build({
  entryPoints:{app:join(source,'app.js')},
  outdir:join(destination,'assets'),
  entryNames:'[name]-[hash]',
  bundle:true,
  format:'esm',
  target:'es2022',
  minify:true,
  metafile:true
 });
 const script='assets/'+basename(Object.keys(result.metafile.outputs).find(path=>path.endsWith('.js')));
 const css=await readFile(join(source,'style.css'),'utf8');
 const style=`assets/style-${hash(css)}.css`;
 await writeFile(join(destination,style),css);
 await cp(join(source,'assets'),join(destination,'assets'),{recursive:true});
 const original=await readFile(join(source,'index.html'),'utf8');
 if(!original.includes('src="app.js"')||!original.includes('href="style.css"'))throw new Error('Missing game entrypoints in index.html');
 const html=original.replace('src="app.js"',`src="${script}"`).replace('href="style.css"',`href="${style}"`);
 await writeFile(join(destination,'index.html'),html);
 const release={version:hash(html),script,style};
 await writeFile(join(destination,'release.json'),JSON.stringify(release)+'\n');
 // Old cached HTML may still ask for the original, unversioned entrypoints.
 await writeFile(join(destination,'style.css'),css);
 await writeFile(join(destination,'app.js'),`
const response=await fetch(new URL('release.json?fresh='+Date.now(),import.meta.url),{cache:'no-store'});
if(!response.ok)throw new Error('Could not load the latest game');
const release=await response.json();
document.querySelector('link[rel="stylesheet"]').href=new URL(release.style,import.meta.url).href;
await import(new URL(release.script,import.meta.url).href);
`);
 return release;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const release=await buildSite();
 console.log(`Built Go Figure release ${release.version}`);
}
