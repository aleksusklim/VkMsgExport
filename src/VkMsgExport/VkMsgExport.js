"use strict";

(function(){

function ParseBunch(Text){
	var Arr=[];
	var Res=('\n'+Text+'\n')
		.replace(/\n~{/g,'\n\ufffd{')
		.replace(/}~\n/g,'}\ufffd\n')
		.match(/\n\ufffd[^\ufffd]+/g);
	if(!Res)
			return Arr;
	var Len=Res.length;
	for(var Idx=0;Idx<Len;Idx++){
		try{
			Arr.push(JSON.parse(Res[Idx].substr(2)));
		}catch(e){};
	}
	return Arr;
}

function StringifyBunch(Mess){
	if(Mess.length<1)
		return '';
	Mess=Mess.map(function(Obj){
			return JSON.stringify(Obj);
		});
	return '~'+Mess.join('~\n~')+'~';	
}

function getallmessages(f){
var i,d,o,s;
d=showids.tree[f];
if(!d)return[];
s=[];
i=0;
while(d[i]!==undefined){
try{
o=JSON.parse(d[i].replace(/.*?{"response":{/,'{"response":{').replace(/\ufffd/g,'\uffff'));
o.response.count;
}catch(_){
window.prompt('Error in file:',f+'\\'+i+'.txt');
return;
}
s.push(o);
i++;
}
return s;
}

function extractmessages(d){
var m,i,l,a,j,k;
m=[];
l=d.length;
for(i=0;i<l;i++){
a=d[i].response.items;
k=a.length;
for(j=0;j<k;j++)m.push(a[j]);
}
return m;
}

function showids(z,y){
var m,i,l,j,k,v,d,f,s,q,h,n,g,p,D,F,B,C,S,Z,P;
h=function(t){var c=String.fromCharCode(1);return t.replace(/&#/g,c).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(new RegExp(c,'g'),'&#').replace(/\n/g,'<br>');}
if(!z)return;
if(showids.lst==z)z=0;
showids.chats={};
m=showids.ids;
Z=0;
s='';
l=m.length;
if(l<1)return;
D=[];
S=[];
C=[];
P={};
for(i=0;i<l;i+=3){
v=m[i];
n=m[i+1];
g=m[i+2];
p={};
for(j=n.length;j--;)p[n[j].id]=n[j];
for(j=g.length;j--;)p[g[j].id]=g[j];
k=v.length;
for(j=0;j<k;j++){
g=v[j];
if(g.date>Z)Z=g.date;
if(g.date<z)continue;
if(g.chat_id){
B=2000000000+g.chat_id;
showids.chats[B]=g.users_count;
C.push({id:B,name:'<u>'+g.users_count+'</u>\t<b>'+h(g.title)+'</b>'});
P[B]={i:B,t:0,s:'',n:h(g.title)};
}else{
B=g.user_id;
if(B>1000000000){
B=g.user_id-1000000000;
n=p[B];
B=-B;
S.push({id:B,name:'<u>'+h(n.screen_name)+'</u>\t<b>'+h(n.name)+'</b>'});
P[B]={i:B,t:2,s:h(n.screen_name),n:h(n.name)};
}else{
n=p[B];
D.push({id:B,name:'<u>'+h(n.screen_name?n.screen_name:('id'+B))+'</u>\t<b>'+h(n.first_name+' '+n.last_name)+'</b>'});
P[B]={i:B,t:1,s:h(n.screen_name?n.screen_name:('id'+B)),n:h(n.first_name+' '+n.last_name)};
}}}}
showids.lst=Z;
s='';
j=[C,D,S];
showids.all=j;
if(y)return;
for(k=0;k<3;k++){
B=j[k];
l=B.length;
s+='\n';
for(i=0;i<l;i++){
if(showids.tree['id_'+B[i].id])s+='\n<s>'+(B[i].id)+'</s>\t'+(B[i].name);
else s+='\n<i>'+(B[i].id)+'</i>\t'+(B[i].name);
}
}
document.getElementById('vkmsgexport').innerHTML='<style>html,body,#vkmsgexport{height:100%;overflow:hidden;}</style><span style="position:fixed;right:2%;top:2%;text-align:center;"><button onclick="VkMsgExport.updatefilter();">filter</button> <button onclick="VkMsgExport.goback();">back</button></span>';
f=document.createElement('iframe');
f.style.width='100%';
f.style.height='100%';
f.style.border='0';
f.contenteditable=true;
document.getElementById('vkmsgexport').appendChild(f);
s=btoa(unescape(encodeURIComponent('<!doctype html><html spellcheck="false"><head><meta charset="utf-8"><style>pre{font:normal 14pt Arial;margin:16px;border:0;outline:0;}body,html{margin:0;padding:0;}</style><script>function parselist(){var f,t;t="\\n"+document.getElementsByTagName("pre")[0].textContent+"\\n";t=t.replace(/[^0-9\\s-]/g,"").replace(/\\n+/g,"BAB").replace(/\\s+/g,"B").replace(/AB*([^BA]+)[^A]+/g,"$1C").replace(/[ABC]/g," ");window.prompt("Put this to users.txt",t.trim());}</'+'script></head><body spellcheck="false"><span style="position:fixed;right:2%;top:4%;text-align:center;"><button style="visibility:hidden">X</button><br><button onclick="parselist();">OK</button></span><pre contenteditable=true spellcheck="false">'+s+'</pre></body></html>')));
f.src='data:text/html;charset=utf-8;base64,'+s;
}

function showdlg(t,m,o){
var i,s,c,a;
if(!m)m=showdlg.last;
showdlg.last=m;
showids.defformat=t;
a=typeof(m);
if(a=='string'||a=='number')m=extractmessages(getallmessages('id_'+m));

m=showdlg.pretty(m,showids.idu,t);
c=showdlg.prettycss(t);

s='<span style="position:fixed;right:1%;top:1%;text-align:center;"><button onclick="VkMsgExport.goback();">back</button>';
s+='<select id="VkMsgExport_select" onchange="VkMsgExport.showdlg(document.getElementById(\'VkMsgExport_select\').selectedIndex-1);">'
s+='<option>- - '+VkMsgExport.aformat[t]+' - -</option>'
for(i=0;i<VkMsgExport.aformat.length;i++)
s+='<option>'+VkMsgExport.aformat[i]+'</option>';
s+='</select></span><div style="font:normal 14pt Arial;margin:16px;border:0;outline:0;" contenteditable=true spellcheck="false">'+m+'</div>'+c;

document.getElementById('vkmsgexport').innerHTML=s;
}

function customtext(){
var t,s,r;
s=document.getElementById('vkmsgexport_customtext').value;
r=ParseBunch(s);
/*
s=s.value;
t=s.replace(/\n/g,'').replace(/\ufffd+/g,'\n').trim();
t='['+t.replace(/\n/g,',')+']';
try{
r=JSON.parse(t);
}catch(e){
r=[];
}
*/
if(!r||!r.length){
return;
}

goback.lasttext=StringifyBunch(r);
showdlg(showids.defformat,r);
}

function revid(d){
var i,r={};
for(i=d.length;i--;)r[d[i].id]=d[i];
return r;
}

function ziploaded(a){
var i,j,n,b,f,k,v,u;
f={};
for(i=a.length;i--;)if(a[i].data.length>0){
n='/'+a[i].name;
j=n.lastIndexOf('.');
if(j<1||n.substr(j)!='.txt')continue;
n=n.substr(0,j);
j=n.lastIndexOf('/');
b=n.substr(j+1);
n=n.substr(0,j);
j=n.lastIndexOf('/');
n=n.substr(j+1);
if(!f[n])f[n]={};
f[n][b]=a[i].data;
}
showids.tree=f;
document.getElementById('filewrapper').outerHTML='';
showids.ids=extractmessages(getallmessages('ids'));
u=extractmessages(getallmessages('idu'));
showids.idu=revid(u);
showids(-1,1);
a=showids.all;
b='<pre style="margin:24px;font:normal 14pt Arial;"><button onclick="VkMsgExport.showids(VkMsgExport.showids.lst);">'+(a[0].length)+' + '+(a[1].length)+' + '+(a[2].length)+'</button><br><br>';
b+='<select id="VkMsgExport_select" onchange="VkMsgExport.showids.defformat=this.selectedIndex;">'
for(i=0;i<VkMsgExport.aformat.length;i++)
b+='<option>'+VkMsgExport.aformat[i]+'</option>';
b+='</select>';

for(j=0;j<3;j++){
k=a[j].length;
b+='<br>';
for(i=0;i<k;i++){
v=a[j][i];
if(showids.tree['id_'+v.id]){
b+='<button onclick="VkMsgExport.showdlg(VkMsgExport.showids.defformat,'+v.id+');">'+v.id+'</button>\t'+v.name+'<br>';
}}}
b+='<br>';
b+='<textarea id="vkmsgexport_customtext" style="font:normal 10px Arial;white-space:pre;word-wrap:normal;overflow-wrap:normal;overflow-x:scroll;" wrap="off" rows="5" cols="40"></textarea><input style="margin:32px;" type="button" value="View!" onclick="VkMsgExport.customtext();">';
b+='<br><br><input type="button" onclick="VkMsgExport.recount();" id="vkmsgexport_recount" value=['+u.length+']></pre>';
showids.body=b;
goback();
}

function recount(){
var a,i,j,k,l,f,o,v,r,z,c,d,y,u,m,N,M,C,L,D,U,n;
//N=function(s,i,n){if(!n[s])n[s]={};n[s][i]=1;};
M=function(){
l=o.length;
for(k=0;k<l;k++){
v=o[k];
c++;
y=v.body.length;
z=v.from_id;
if(!u[z])u[z]=0;
u[z]++;
N[z]=1;
if(!C[z])C[z]=L[z]=0;
C[z]++;
L[z]+=y;
d+=y;

r=v.fwd_messages;
m=0;
while(r&&m<r.length){
N[r[m].user_id]=1;
if(r[m].fwd_messages)r=r.concat(r[m].fwd_messages);
m++;
}
}
};
a=showids.tree;
N={};
L={};
C={};
D={};
U={};
for(i in a)if(i.match(/id_-?[0-9]+/)){
c=d=0;
U[i]=u={};
for(j=0;f=a[i][j];j++){

try{
o=JSON.parse(f.replace(/.*?{"response":{/,'{"response":{').replace(/\ufffd/g,'\uffff'));
o.response.count;
}catch(_){
window.prompt('Error in file:',i+'\\'+j+'.txt');
return;
}
o=o.response.items;
M();
}

D[i]=[c,d];
}
o=ParseBunch(document.getElementById('vkmsgexport_customtext').value);
if(o.length)M();

l=20;
j=[[]];
k=[[]];
n=0;
for(i in N){
if(i==0)continue;
n++;
if(i<0)j[j.length-1].length<l?j[j.length-1].push(i):j.push([i]);
else k[k.length-1].length<l?k[k.length-1].push(i):k.push([i]);
}
for(i=j.length;i--;)j[i]=j[i].join(',');
for(i=k.length;i--;)k[i]=k[i].join(',');
i='*\n'+j.join('\n')+'\n'+k.join('\n')+'\n';
document.getElementById('vkmsgexport_customtext').value=i;
document.getElementById('vkmsgexport_recount').value=n;
}

function showversion(s){
document.getElementById('info').innerHTML=s?s:'Drop <b>messages.zip</b> here!';
document.getElementById('version').innerHTML=s?s:'VkMsgExport v0.3';
}

function startup(f,e){
zip.useWebWorkers=false;
e=function(){alert('ZIP error!');showversion();};
f=document.getElementById('zip');
f.addEventListener('change',function(){
showversion('Processing...');
setTimeout(function(){
zip.createReader(new zip.BlobReader(f.files[0]),function(z){
z.getEntries(function(e){
var a=[],g=function(m){
(m=e.pop()).getData(new zip.BlobWriter(),function(b,r){
r=new FileReader();r.onload=function(t){
var t=t.target.result;if(true||typeof(t)=='string'){a.push({name:m.filename,data:t});if(e.length>0)g();else{
ziploaded(a);
}}
};r.readAsText(b,'windows-1251');
});
};g();},e);
},e);
},1);
},false);
}

function updatefilter(){
showids(+prompt('Filter:',showids.lst));
}

function goback(){
var t;
document.getElementById('vkmsgexport').innerHTML=showids.body;
if(goback.lasttext){
t=document.getElementById('vkmsgexport_customtext');
if(t)t.value=goback.lasttext;
}
if(!showids.defformat)showids.defformat=0;
document.getElementById('VkMsgExport_select').selectedIndex=showids.defformat;

}

window.VkMsgExport=function(f,c,a){
showdlg.pretty=f;
showdlg.prettycss=c;
VkMsgExport.showids=showids;
VkMsgExport.updatefilter=updatefilter;
VkMsgExport.goback=goback;
VkMsgExport.showdlg=showdlg;
VkMsgExport.startup=startup;
VkMsgExport.recount=recount;
VkMsgExport.customtext=customtext;
VkMsgExport.aformat=a;
document.getElementsByTagName('html')[0].setAttribute('spellcheck',false);
document.body.setAttribute('spellcheck',false);
f=document.createElement('div');
document.body.appendChild(f);
f.outerHTML='<meta charset="windows-1251"><style>html,body,#vkmsgexport,table,tr,td,th{margin:0;padding:0;border:0;font-family:Arial;}</style><div id="vkmsgexport"><div style="position:relative;margin:16px;" id="filewrapper"><div style="height:256px;width:100%;background:#ddd;text-align:center;"><div style="padding-top:100px;text-align:center;" id="info"></b> here!</div></div><div style="position:absolute;top:0;left:0;border:2px dashed black;overflow:hidden;height:256px;width:100%;"><input type="file" accept="application/zip" id="zip" style="font:bold 256px serif;padding:256px;opacity:0;cursor:pointer;" size="256"></div></div><center><h2 id="version"></h2></center></div>';
showversion();
setTimeout(function(f){
f=document.createElement('script');
f.src='VkMsgExport/zip.js';
document.body.appendChild(f);
},1);
}

})();
