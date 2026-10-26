// Antique: one Cloudflare Worker file (JavaScript only).
// Needs: secret GEMINI_API_KEY (free, from aistudio.google.com/app/apikey).
// Optional: Workers AI binding named AI (backup model).
// Optional email login: Settings > Domains & Routes > workers.dev > enable Cloudflare Access.
// Paid plans: paste payment links into the link:"" fields of PLANS inside the page.

const SYSTEM_PROMPT =
  "You are Antique, a friendly AI assistant. Help with questions, writing, ideas, " +
  "antiques and everyday tech problems. Explain things in simple, clear words. " +
  "If asked who you are, say you are Antique. " +
  "For contact, give the.antique.cloud@outlook.com.";

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Antique</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">
<style>
:root{--bg:#212121;--sb:#171717;--tx:#ececec;--mu:#9b9b9b;--in:#2f2f2f;--ln:#3a3a3a;--hv:#2a2a2a;--bt:#ececec;--bn:#212121}
@media(prefers-color-scheme:light){:root:not([data-theme="dark"]){--bg:#fff;--sb:#f9f9f9;--tx:#0d0d0d;--mu:#6b6b6b;--in:#f4f4f4;--ln:#e5e5e5;--hv:#ececec;--bt:#0d0d0d;--bn:#fff}}
:root[data-theme="light"]{--bg:#fff;--sb:#f9f9f9;--tx:#0d0d0d;--mu:#6b6b6b;--in:#f4f4f4;--ln:#e5e5e5;--hv:#ececec;--bt:#0d0d0d;--bn:#fff}
*{box-sizing:border-box}html,body{height:100%;margin:0}
body{background:var(--bg);color:var(--tx);font-family:"Patrick Hand","Comic Sans MS","Segoe Print",cursive;font-size:1.15rem;line-height:1.5}
button{font:inherit;color:inherit;cursor:pointer}
.app{display:flex;height:100%}
aside{width:260px;flex-shrink:0;background:var(--sb);display:flex;flex-direction:column;padding:10px}
.nw{display:flex;gap:8px;align-items:center;width:100%;padding:10px 12px;background:none;border:0;border-radius:10px;text-align:left}
.nw:hover,.it:hover{background:var(--hv)}
#q{width:100%;margin:4px 0 8px;padding:9px 12px;font:inherit;font-size:14px;background:var(--in);color:var(--tx);border:0;border-radius:10px;outline:0}
.lb{color:var(--mu);font-size:12px;padding:8px 12px}
#list{flex:1;overflow-y:auto}
.it{display:block;width:100%;padding:8px 12px;background:none;border:0;border-radius:10px;text-align:left;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.it.on{background:var(--hv)}
.bot{border-top:1px solid var(--ln);padding-top:8px;display:flex;gap:6px}
.bot button{flex:1;padding:8px;background:none;border:1px solid var(--ln);border-radius:10px;font-size:13px}
main{flex:1;min-width:0;display:flex;flex-direction:column}
header{display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:18px}
#mn{display:none;background:none;border:0;font-size:20px}
.stage{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;padding:0 16px 10px}
#log{flex:1;width:100%;max-width:760px;overflow-y:auto;padding:10px 0}
#hero{display:none;font-size:clamp(26px,4vw,32px);font-weight:600;margin:0 0 24px;text-align:center}
body.empty .stage{justify-content:center}body.empty #log{display:none;flex:0}body.empty #hero{display:block}
.m{margin:0 0 22px;display:flex;flex-direction:column}
.m.u{align-items:flex-end}
.m.u .b{background:var(--in);border-radius:20px;padding:10px 18px;max-width:80%}
.m.a .b{max-width:100%}
.b pre{background:var(--sb);border:1px solid var(--ln);border-radius:12px;padding:12px;overflow-x:auto;font-size:14px}
.cp{align-self:flex-start;margin-top:4px;padding:2px 8px;background:none;border:0;color:var(--mu);font-size:13px}
.dock{width:100%;max-width:760px;background:var(--in);border-radius:28px;padding:10px 12px 10px 20px;display:flex;align-items:flex-end;gap:10px}
textarea{flex:1;resize:none;border:0;outline:0;background:none;color:var(--tx);font:inherit;max-height:200px;padding:6px 0}
#go{width:36px;height:36px;border-radius:50%;border:0;background:var(--bt);color:var(--bn);font-size:18px;font-weight:bold;flex-shrink:0}
.pills{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:14px}
body:not(.empty) .pills{display:none}
.pill{padding:8px 16px;background:none;border:1px solid var(--ln);border-radius:999px;font-size:14px}
.pill:hover{background:var(--hv)}
.note{color:var(--mu);font-size:12px;margin-top:10px;text-align:center}
.modes{display:flex;gap:4px;margin:6px 0}
.modes button{flex:1;padding:7px 4px;background:none;border:1px solid var(--ln);border-radius:10px;font-size:13px}
.modes button.on{background:var(--hv);font-weight:600}
.usr{display:flex;align-items:center;gap:10px;width:100%;padding:10px;background:none;border:0;border-top:1px solid var(--ln);text-align:left}
.usr:hover{background:var(--hv)}
.av{width:30px;height:30px;border-radius:50%;background:var(--bt);color:var(--bn);display:flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;z-index:10}
.ov[hidden]{display:none}
.md{position:relative;background:var(--bg);border:1px solid var(--ln);border-radius:16px;width:100%;max-width:460px;padding:24px}
.md h2{margin:0 0 8px;font-size:20px}
.x{position:absolute;top:8px;right:14px;background:none;border:0;font-size:26px}
.r{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--ln)}
.r input,.r select{padding:7px 10px;font:inherit;background:var(--in);color:var(--tx);border:1px solid var(--ln);border-radius:8px;max-width:55%}
.pb{padding:7px 14px;background:none;border:1px solid var(--ln);border-radius:8px}
.prem{display:flex;justify-content:space-between;align-items:center;width:100%;padding:10px 12px;margin-bottom:6px;background:none;border:1px solid var(--ln);border-radius:10px}
.prem:hover{background:var(--hv)}
.soon{font-size:12px;color:var(--mu);border:1px solid var(--ln);border-radius:999px;padding:0 8px}
#wish{display:none;color:var(--mu);font-size:1.25rem;margin-bottom:4px;text-align:center}
body.empty #wish{display:block}
@media(max-width:760px){aside{position:fixed;top:0;bottom:0;left:0;z-index:5;transform:translateX(-100%);transition:transform .2s}body.o aside{transform:none}#mn{display:block}}
</style>
</head>
<body class="empty">
<div class="app">
<aside>
<button class="nw" id="nw">&#9998; New chat</button>
<div class="modes" id="modes"><button data-m="chat" class="on">Chat</button><button data-m="code">&lt;/&gt; Code</button><button data-m="cowork">Cowork</button></div>
<input id="q" placeholder="Search chats" aria-label="Search chats">
<div class="lb">Chats</div><div id="list"></div>
<button class="prem" id="prem">&#9733; Premium <span class="soon">Coming soon</span></button>
<button class="usr" id="usr" aria-label="Settings"><span class="av" id="av">A</span><span id="un">Antique</span></button>
</aside>
<main>
<header><button id="mn" aria-label="Menu">&#9776;</button><span id="hd">Antique</span></header>
<div class="stage">
<div id="wish"></div>
<div id="hero">What can I help with?</div>
<div id="log"></div>
<div class="dock"><textarea id="box" rows="1" placeholder="Message Antique" aria-label="Message"></textarea><button id="go" aria-label="Send">&uarr;</button></div>
<div class="pills">
<button class="pill" data-p="Help me write ">Write</button>
<button class="pill" data-p="Teach me about ">Learn</button>
<button class="pill" data-p="Help me with this code: ">Code</button>
<button class="pill" data-p="I need advice on ">Advice</button>
</div>
<div class="note">Antique can make mistakes. Check important info.</div>
</div>
</main>
</div>
<div class="ov" id="pmv" hidden><div class="md"><button class="x" id="px" aria-label="Close">&times;</button><h2>Premium</h2><p>Premium is coming soon, with stronger answers, longer replies and more room to chat. Check back later.</p></div></div>
<div class="ov" id="ov" hidden><div class="md">
<button class="x" id="x" aria-label="Close">&times;</button><h2>Settings</h2>
<div class="r"><label for="sn">Your name</label><input id="sn" maxlength="20" placeholder="Your name"></div>
<div class="r"><label for="st">Theme</label><select id="st"><option value="auto">Auto</option><option value="dark">Dark</option><option value="light">Light</option></select></div>
<div class="r"><label for="ss">Text size</label><select id="ss"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
<div class="r"><span>Clear all chats</span><button class="pb" id="cl">Clear</button></div>
</div></div>
<script>
var K="antique_v2",chats=[],cur=null,busy=false,T=String.fromCharCode(96,96,96);
function $(i){return document.getElementById(i)}
try{chats=JSON.parse(localStorage.getItem(K)||"[]")}catch(e){}
function save(){try{localStorage.setItem(K,JSON.stringify(chats.slice(0,40)))}catch(e){}}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function fmt(t){var p=t.split(T),h="";for(var i=0;i<p.length;i++){if(i%2)h+="<pre><code>"+esc(p[i].replace(/^[a-zA-Z0-9]*\\n/,""))+"</code></pre>";else h+=esc(p[i]).replace(/\\n/g,"<br>")}return h}
function bub(r,c){var d=document.createElement("div");d.className="m "+r;var b=document.createElement("div");b.className="b";b.innerHTML=fmt(c);d.appendChild(b);
 if(r==="a"){var k=document.createElement("button");k.className="cp";k.textContent="Copy";k.onclick=function(){navigator.clipboard.writeText(c).then(function(){k.textContent="Copied";setTimeout(function(){k.textContent="Copy"},1200)})};d.appendChild(k)}
 $("log").appendChild(d);$("log").scrollTop=$("log").scrollHeight;return d}
function grow(){var b=$("box");b.style.height="auto";b.style.height=b.scrollHeight+"px"}
function draw(){var l=$("list"),q=$("q").value.toLowerCase();l.innerHTML="";
 chats.forEach(function(c){if(q&&c.t.toLowerCase().indexOf(q)<0)return;var b=document.createElement("button");b.className="it"+(cur&&cur.id===c.id?" on":"");b.textContent=c.t;
  b.onclick=function(){cur=c;$("log").innerHTML="";c.m.forEach(function(m){bub(m.r==="user"?"u":"a",m.c)});document.body.classList.remove("empty","o");draw()};l.appendChild(b)})}
function fresh(){cur=null;$("log").innerHTML="";document.body.classList.add("empty");document.body.classList.remove("o");$("box").focus();draw()}
function send(){var v=$("box").value.trim();if(!v||busy)return;
 if(!cur){cur={id:Date.now(),t:v.slice(0,40),m:[]};chats.unshift(cur)}
 $("box").value="";grow();document.body.classList.remove("empty");
 cur.m.push({r:"user",c:v});bub("u",v);
 var w=document.createElement("div");w.className="m a";w.innerHTML='<div class="b" style="color:var(--mu)">Thinking...</div>';$("log").appendChild(w);$("log").scrollTop=$("log").scrollHeight;
 busy=true;draw();
 fetch("/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:mode,messages:cur.m.map(function(m){return{role:m.r,content:m.c}})})})
 .then(function(r){return r.json()})
 .then(function(d){w.remove();if(d.reply){cur.m.push({r:"assistant",c:d.reply});bub("a",d.reply)}else{cur.m.pop();bub("a",d.error||"Something went wrong.")}})
 .catch(function(){w.remove();cur.m.pop();bub("a","Could not reach Antique. Check your connection and try again.")})
 .then(function(){busy=false;save();draw()})}
$("go").onclick=send;$("nw").onclick=fresh;$("q").oninput=draw;
$("mn").onclick=function(){document.body.classList.toggle("o")};
$("box").oninput=grow;
$("box").onkeydown=function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}};
document.querySelectorAll(".pill").forEach(function(p){p.onclick=function(){$("box").value=p.getAttribute("data-p");grow();$("box").focus()}});
$("cl").onclick=function(){if(confirm("Delete all chats in this browser?")){chats=[];save();fresh()}};
var S={},mode="chat";
try{S=JSON.parse(localStorage.getItem("antique_set")||"{}")}catch(e){}
try{mode=localStorage.getItem("antique_mode")||"chat"}catch(e){}
function sset(){try{localStorage.setItem("antique_set",JSON.stringify(S))}catch(e){}}
function apply(){var r=document.documentElement;
 if(S.theme==="dark"||S.theme==="light")r.setAttribute("data-theme",S.theme);else r.removeAttribute("data-theme");
 r.style.fontSize=({small:"90%",large:"115%"})[S.size]||"100%";
 var hr=new Date().getHours();$("wish").textContent=(hr<12?"Good morning":hr<17?"Good afternoon":"Good evening")+(S.name?", "+S.name:"")+"!";
 var n=S.name||"Antique";$("un").textContent=n;$("av").textContent=n[0].toUpperCase();
 $("hero").textContent="What can I help with?";
 $("hd").textContent={chat:"Antique",code:"Antique \\u00b7 Code",cowork:"Antique \\u00b7 Cowork"}[mode];
 $("box").placeholder={chat:"Message Antique",code:"Describe the code you need, or paste your code",cowork:"Describe the task you want help with"}[mode]}
document.querySelectorAll("#modes button").forEach(function(b){b.onclick=function(){mode=b.dataset.m;document.querySelectorAll("#modes button").forEach(function(x){x.classList.toggle("on",x===b)});try{localStorage.setItem("antique_mode",mode)}catch(e){}apply()}});
document.querySelectorAll("#modes button").forEach(function(x){x.classList.toggle("on",x.dataset.m===mode)});
$("usr").onclick=function(){$("sn").value=S.name||"";$("st").value=S.theme||"auto";$("ss").value=S.size||"medium";$("ov").hidden=false;document.body.classList.remove("o")};
$("x").onclick=function(){$("ov").hidden=true};
$("ov").onclick=function(e){if(e.target===$("ov"))$("ov").hidden=true};
$("sn").oninput=function(e){S.name=e.target.value.trim();sset();apply()};
$("st").onchange=function(e){S.theme=e.target.value;sset();apply()};
$("ss").onchange=function(e){S.size=e.target.value;sset();apply()};
var oc=$("cl").onclick;$("cl").onclick=function(){oc();$("ov").hidden=true};
document.addEventListener("keydown",function(e){if(e.key==="Escape")$("ov").hidden=true});
$("prem").onclick=function(){$("pmv").hidden=false;document.body.classList.remove("o")};
$("px").onclick=function(){$("pmv").hidden=true};
$("pmv").onclick=function(e){if(e.target===$("pmv"))$("pmv").hidden=true};
apply();draw();
</script>
</body>
</html>
`;

const MODES = {
  chat: "",
  code: " You are in Code mode. Act as a careful programming helper. Ask for the language if it is unclear, give complete working code in fenced code blocks, then explain briefly how it works and how to run it.",
  cowork: " You are in Cowork mode. Act like a helpful coworker on a task. Restate the goal in one line, ask at most one question if something important is missing, then break the work into clear steps and produce the finished draft or checklist."
};
function sysFor(mode) { return SYSTEM_PROMPT + (MODES[mode] || ""); }

async function askGemini(env, messages, mode) {
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const r = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sysFor(mode) }] },
        contents: messages.map(function (m) {
          return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] };
        })
      })
    }
  );
  const data = await r.json();
  if (!r.ok) throw new Error((data.error && data.error.message) || String(r.status));
  const c = data.candidates && data.candidates[0];
  const parts = (c && c.content && c.content.parts) || [];
  return parts.map(function (p) { return p.text || ""; }).join("") || "No answer. Try again.";
}

async function askFree(env, messages, mode) {
  if (!env.AI) throw new Error("The AI binding is missing.");
  const out = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [{ role: "system", content: sysFor(mode) }].concat(messages),
    max_tokens: 800
  });
  return out.response || "No answer. Try again.";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const email = (request.headers.get("Cf-Access-Authenticated-User-Email") || "").toLowerCase();

    if (url.pathname === "/me") return Response.json({ email: email });

    if (url.pathname === "/check") {
      return Response.json({
        gemini_key_found: !!env.GEMINI_API_KEY,
        ai_binding_found: !!env.AI
      });
    }

    if (url.pathname === "/chat" && request.method === "POST") {
      let why = "";
      try {
        const body = await request.json();
        const messages = (body.messages || []).slice(-20);

        if (env.GEMINI_API_KEY) {
          try {
            return Response.json({ reply: await askGemini(env, messages, body.mode) });
          } catch (e) {
            why = "Gemini error: " + e.message;
          }
        } else {
          why = "The secret GEMINI_API_KEY was not found in this Worker.";
        }

        if (env.AI) {
          return Response.json({ reply: await askFree(env, messages, body.mode) });
        }
        why = why + " The AI binding was also not found.";
      } catch (e) {
        why = why || String(e.message);
      }
      return Response.json({ error: why });
    }

    return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
};
