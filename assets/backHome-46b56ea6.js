import"./bootstrap.min-37192d94.js";const s="https://livejs-api.hexschool.io/api/livejs/v1/",c="2023-js-live",i={headers:{Authorization:"5kLl4eIj5XgVG8FstJcylSTy4xN2"}},f=document.querySelector(".ordersList"),$=document.querySelector(".discardAllBtn");function g(){axios.get(`${s}admin/${c}/orders`,i).then(e=>{const t=e.data.orders;l(t),p(u(t))}).catch(e=>e.response)}function m(){document.querySelectorAll(".orderStatus").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault();const o=t.parentElement.getAttribute("data-id");let n=r.target.getAttribute("data-paid");n=n==="false",S(o,n)})})}function S(e,t){const r={data:{id:e,paid:t}};axios.put(`${s}admin/${c}/orders`,r,i).then(o=>{alert("狀態編輯成功！"),l(o.data.orders)}).catch(o=>o.response)}$.addEventListener("click",e=>{e.preventDefault(),O()});function O(){axios.delete(`${s}admin/${c}/orders`,i).then(e=>{alert(e.data.message);const t=e.data.orders;l(t),p(u(t))}).catch(e=>e.response)}function E(){document.querySelectorAll(".delSingleOrder-Btn").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault();const o=t.parentElement.parentElement.getAttribute("data-id");v(o)})})}function v(e){axios.delete(`${s}admin/${c}/orders/${e}`,i).then(t=>{alert("刪除成功！");const r=t.data.orders;l(r),p(u(r))}).catch(t=>t.response)}function l(e){let t="";e.forEach(r=>{const o=r.products.reduce((d,a)=>d+`<p>${a.title}</p>`,""),n=new Date(r.createdAt*1e3);t+=`
    <tr data-id="${r.id}">
      <td>${r.id}</td>
      <td>
        <p>${r.user.name}</p>
        <p>${r.user.tel}</p>
      </td>
      <td>${r.user.address}</td>
      <td>${r.user.email}</td>
      <td>
        ${o}
      </td>
      <td>${n.getFullYear()}/${n.getMonth()}/${n.getDate()}</td>
      <td class="orderStatus">
        <a href="#" data-paid="${r.paid}">${r.paid?"已處理":"未處理"}</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" />
      </td>
    </tr>`}),f.innerHTML=t,m(),E()}g();function u(e){console.log(e);let t={};e.forEach(d=>{d.products.forEach(a=>{const h=a.origin_price*a.quantity;t[a.title]?t[a.title]+=h:t[a.title]=h})});const o=Object.keys(t).sort((d,a)=>t[a]-t[d]).map(d=>[d,t[d]]),n=[];return o.forEach((d,a)=>{a<3?n.push(d):a===3?n.push(["其他",d[1]]):n[3][1]+=d[1]}),n.length?n:[["無資料",1]]}function p(e){c3.generate({bindto:"#chart",data:{columns:e,type:"pie"}})}
