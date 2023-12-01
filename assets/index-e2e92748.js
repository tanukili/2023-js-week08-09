import"./bootstrap.min-37192d94.js";const n="https://livejs-api.hexschool.io/api/livejs/v1/",o="2023-js-live",f=document.querySelector(".productWrap"),m=document.querySelector(".shoppingCart-table tbody"),h=document.querySelector(".orderInfo-btn"),$=document.querySelectorAll(".orderInfo-input"),g=document.querySelector(".productSelect");let d={},i=[];function y(){axios.get(`${n}customer/${o}/products`).then(e=>{const r=e.data.products;i=r,l(r)}).catch(e=>e.response)}function v(){axios.get(`${n}customer/${o}/carts`).then(e=>{const r=e.data.carts,t=e.data.finalTotal;s(r,t),r.forEach(a=>{d[a.product.id]=a.quantity})}).catch(e=>e.response)}function E(){document.querySelectorAll(".addCardBtn").forEach(r=>{r.addEventListener("click",t=>{t.preventDefault();const a=r.parentElement.getAttribute("data-id"),c=d[a];c?p(a,c):p(a)})})}function p(e,r=0){const t={data:{productId:e,quantity:1+r}};axios.post(`${n}customer/${o}/carts`,t).then(a=>{alert("新增成功！");const c=a.data.carts;c.forEach(u=>{d[u.product.id]=u.quantity}),s(c,a.data.finalTotal)}).catch(a=>a.response)}function q(){document.querySelector(".discardAllBtn").addEventListener("click",t=>{t.preventDefault(),B()}),document.querySelectorAll(".discardBtn").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const c=t.parentElement.querySelector(".cardItem-title").getAttribute("id");S(c)})})}function B(){axios.delete(`${n}customer/${o}/carts`).then(e=>{alert(e.data.message),d={},s(e.data.carts,e.data.finalTotal)}).catch(e=>{alert(e.response.data.message)})}function S(e){axios.delete(`${n}customer/${o}/carts/${e}`).then(r=>{alert("品項刪除成功！");const t=r.data.carts;d={},t.forEach(a=>{d[a.product.id]=a.quantity}),s(t,r.data.finalTotal)}).catch(r=>r.response)}h.addEventListener("click",e=>{e.preventDefault();let r={data:{user:{}}};$.forEach(t=>{if(t.value)t.nextElementSibling.textContent="";else{const a=t.nextElementSibling.getAttribute("data-message");t.nextElementSibling.textContent=`${a} 為必填`}r.data.user[t.name]=t.value}),b(r)});function b(e){axios.post(`${n}customer/${o}/orders`,e).then(()=>{alert("訂單新增成功！"),document.querySelector(".orderInfo-form").reset(),d={},s([],0)}).catch(r=>{alert(r.response.data.message)})}function l(e){let r="";e.forEach(t=>{r+=`<li class="productCard" data-id="${t.id}">
      <h4 class="productType">新品</h4>
      <img
      src="${t.images}"
      alt="${t.description}"
      />
      <a href="#" class="addCardBtn">加入購物車</a>
      <h3>${t.title}</h3>
      <del class="originPrice">${t.origin_price}</del>
      <p class="nowPrice">${t.price}</p>
    </li>`}),f.innerHTML=r,E()}function s(e,r){let t="";e.forEach(c=>{t+=`<tr><td>
    <div class="cardItem-title" id="${c.id}">
      <img src="${c.product.images}" alt="${c.product.description}" />
      <p>${c.product.title}</p>
    </div>
  </td>
  <td>NT$${c.product.price}</td>
  <td>${c.quantity}</td>
  <td>NT$${c.product.price*c.quantity}</td>
  <td class="discardBtn">
    <a href="#" class="material-icons"> clear </a>
  </td></tr>`}),e.length||(t="<td><p>目前購物車沒有商品</p></td>");const a=`
  ${t}
  <tr>
    <td>
      <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
      <p>總金額</p>
    </td>
    <td>NT$${r}</td>
  </tr>`;m.innerHTML=a,q()}y();v();g.addEventListener("change",e=>{const r=e.target.value;if(r!=="全部"){const t=i.filter(a=>a.category===r);l(t)}else l(i)});
