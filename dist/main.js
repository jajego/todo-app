(()=>{"use strict";var e={426:(e,t,n)=>{n.d(t,{Z:()=>a});var o=n(81),r=n.n(o),i=n(645),c=n.n(i)()(r());c.push([e.id,"* {\r\n    font-family: Arial, Helvetica, sans-serif;\r\n}\r\n\r\n.project-card {\r\n    background-color: aqua;\r\n}\r\n\r\n.item {\r\n    background-color: skyblue;\r\n}\r\n\r\nbody {\r\n    background-color: oldlace\r\n}\r\n\r\n#content {\r\n    background-color: antiquewhite;\r\n}\r\n#header {\r\n    width: 100%;\r\n    height: 50px;\r\n    background-color: rgb(214, 234, 252);\r\n}\r\n\r\n\r\n\r\n.active {\r\n    display: block;\r\n    width: 500px;\r\n    height: 200px;\r\n    background-color: blueviolet;\r\n    border: 1px solid brown;\r\n}\r\n\r\n.clear-local-storage-btn {\r\n    background-color: rebeccapurple;\r\n    color: white;\r\n}",""]);const a=c},645:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",o=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),o&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),o&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,o,r,i){"string"==typeof e&&(e=[[null,e,void 0]]);var c={};if(o)for(var a=0;a<this.length;a++){var l=this[a][0];null!=l&&(c[l]=!0)}for(var d=0;d<e.length;d++){var s=[].concat(e[d]);o&&c[s[0]]||(void 0!==i&&(void 0===s[5]||(s[1]="@layer".concat(s[5].length>0?" ".concat(s[5]):""," {").concat(s[1],"}")),s[5]=i),n&&(s[2]?(s[1]="@media ".concat(s[2]," {").concat(s[1],"}"),s[2]=n):s[2]=n),r&&(s[4]?(s[1]="@supports (".concat(s[4],") {").concat(s[1],"}"),s[4]=r):s[4]="".concat(r)),t.push(s))}},t}},81:e=>{e.exports=function(e){return e[1]}},379:e=>{var t=[];function n(e){for(var n=-1,o=0;o<t.length;o++)if(t[o].identifier===e){n=o;break}return n}function o(e,o){for(var i={},c=[],a=0;a<e.length;a++){var l=e[a],d=o.base?l[0]+o.base:l[0],s=i[d]||0,u="".concat(d," ").concat(s);i[d]=s+1;var m=n(u),p={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==m)t[m].references++,t[m].updater(p);else{var f=r(p,o);o.byIndex=a,t.splice(a,0,{identifier:u,updater:f,references:1})}c.push(u)}return c}function r(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,r){var i=o(e=e||[],r=r||{});return function(e){e=e||[];for(var c=0;c<i.length;c++){var a=n(i[c]);t[a].references--}for(var l=o(e,r),d=0;d<i.length;d++){var s=n(i[d]);0===t[s].references&&(t[s].updater(),t.splice(s,1))}i=l}}},569:e=>{var t={};e.exports=function(e,n){var o=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(n)}},216:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},565:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},795:e=>{e.exports=function(e){var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var o="";n.supports&&(o+="@supports (".concat(n.supports,") {")),n.media&&(o+="@media ".concat(n.media," {"));var r=void 0!==n.layer;r&&(o+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),o+=n.css,r&&(o+="}"),n.media&&(o+="}"),n.supports&&(o+="}");var i=n.sourceMap;i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),t.styleTagTransform(o,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},589:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={id:o,exports:{}};return e[o](i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nc=void 0,(()=>{class e{constructor(e,t,n,o,r){this.title=e,this.description=t,this.dueDate=n,this.priority=o,this.project=r}}class t{constructor(e){this.title=e,this.items=[]}addToItems(e){this.items.push(e)}removeItem(e){this.items.filter((t=>t.title!==e.title))}getItem(e){return this.items.find((t=>t.title===e.title))}}let o=[];function r(t,n,o,r,i){return new e(t,n,o,r,i)}function i(e){let t=document.createElement("div");return t.classList.add("item"),t.classList.add(e.priority),t.innerHTML=`\n                            <h4 class='title'>${e.title}</h3>\n                            <p class='description'>Desc: ${e.description}</p>\n                            <p class='due-date'>Due: ${e.dueDate}</p>\n                            <p class='priority'>Priority: ${e.priority}</p>\n                            `,t}function c(e){let n=new t(e),i=r("Default","This is a default task","Tomorrow","Soon",e);return n.items.push(i),o.push(n),s(),n}function a(e){const t=document.createElement("div");t.innerHTML=`<h1 class='project-card-title'>Project: ${e.title}</h1>`,e.id=e.title,t.classList.add("project-card"),t.classList.add(e.title);for(let n of e.items)t.appendChild(i(n));return t}function l(e){e.preventDefault();const t=function(){const e=document.getElementById("new-item-title").value;console.log(e);const t=document.getElementById("new-item-desc").value;console.log(t);const n=document.getElementById("new-item-duedate").value;console.log(n);const o=document.getElementById("new-item-priority").value;console.log(o);const i=document.getElementById("selectProject").value;return console.log(i),r(e,t,n,o,i)}();var n;console.log("Succsesfully processed form data"),n=t.project,o.find((e=>e.title===n));let i=o.findIndex((e=>e.title==t.project));o[i].items.push(t),s(),d(),function(){const e=document.getElementById("add-item-modal");document.getElementById("add-item-form").reset(),e.classList.remove("active")}()}const d=()=>{document.getElementById("main").innerHTML="",function(){const e=document.getElementById("main");e.innerHTML="";let t=o;for(let n=0;n<t.length;n++){let o=a(t[n]);e.appendChild(o)}!function(){const e=document.getElementById("selectProject");e.innerHTML="",o.map((t=>{const n=document.createElement("option");n.value=t.title,n.innerText=t.title,e.appendChild(n)}))}(),console.log("Project cards rendered")}()},s=()=>{localStorage.setItem("savedProjects",JSON.stringify(o)),console.log("saved local")};var u=n(379),m=n.n(u),p=n(795),f=n.n(p),h=n(569),v=n.n(h),g=n(565),y=n.n(g),b=n(216),E=n.n(b),C=n(589),L=n.n(C),x=n(426),T={};T.styleTagTransform=L(),T.setAttributes=y(),T.insert=v().bind(null,"head"),T.domAPI=f(),T.insertStyleElement=E(),m()(x.Z,T),x.Z&&x.Z.locals&&x.Z.locals,function(){const e=document.body.appendChild(function(){const e=document.createElement("div");return e.classList.add("content"),e.id="content",e}());e.appendChild(function(){const e=document.createElement("header");return e.classList.add("header"),e.id="header",e}()),e.appendChild(function(){const e=document.createElement("div");e.classList.add("add-item-modal"),e.id="add-item-modal";const t=document.createElement("form");t.id="add-item-form";const n=document.createElement("select");n.id="selectProject";for(let e=0;e<o.length;e++){let t=o[e];const r=document.createElement("option");r.value=t.title,r.innerText=t.title,n.appendChild(r)}const r=document.createElement("label");r.id="itemTitle",r.innerText="Title:";const i=document.createElement("input");i.type="text",i.id="new-item-title",i.name="itemTitle";const c=document.createElement("label");c.id="itemDesc",c.innerText="Desc:";const a=document.createElement("input");a.type="text",a.id="new-item-desc",a.name="itemDesc";const d=document.createElement("label");d.id="itemDueDate",d.innerText="DueDate:";const s=document.createElement("input");s.type="text",s.id="new-item-duedate",s.name="itemDueDate";const u=document.createElement("label");u.id="itemPriority",u.innerText="Priority:";const m=document.createElement("input");m.type="text",m.id="new-item-priority",m.name="itemPriority";const p=document.createElement("button");return p.type="submit",p.id="item-modal-submit-btn",p.innerText="Submit",t.appendChild(n),t.appendChild(r),t.appendChild(i),t.appendChild(c),t.appendChild(a),t.appendChild(d),t.appendChild(s),t.appendChild(u),t.appendChild(m),t.appendChild(p),t.onsubmit=l,e.appendChild(t),e}()),e.appendChild(function(){const e=document.createElement("main");return e.classList.add("main"),e.id="main",e}()),e.appendChild(function(){const e=document.createElement("footer");return e.classList.add("footer"),e.id="footer",e}()),document.getElementById("header").appendChild(function(){const e=document.getElementById("add-item-modal"),t=document.createElement("nav"),n=document.createElement("button"),o=document.createElement("button");n.classList.add("add-project-btn"),n.innerHTML="Add project",n.addEventListener("click",(()=>{})),o.classList.add("add-item-btn"),o.innerHTML="Add todo",o.addEventListener("click",(()=>{if(e.classList.contains("active"))return!1;!function(){const e=document.getElementById("add-item-modal");document.getElementById("add-item-form").reset(),e.classList.add("active")}()}));const r=document.createElement("button");r.classList.add("edit-project-title-btn"),r.innerHTML="Change project title",r.addEventListener("click",(()=>{}));const i=document.createElement("button");return i.classList.add("clear-local-storage-btn"),i.innerHTML="Clear localStorage",i.addEventListener("click",(()=>{localStorage.clear(),console.log("localStorage cleared")})),t.appendChild(o),t.appendChild(r),t.appendChild(i),t}()),(()=>{const e=JSON.parse(localStorage.getItem("savedProjects"));if(null===e)return console.log("null boy"),o=[c("Default"),c("Default_2"),c("Default_3")],void d();e.length>0?(console.log("local restored!"),o=e,console.log("_projects: "+o),d()):(console.log("no local found. initializing...."),o=[c("Default"),c("Default_2"),c("Relaunch_Chamilitary")],d())})()}()})()})();