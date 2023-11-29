const baseUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/';
const apiPath = '2023-js-live';

// 抓取 DOM
const productList = document.querySelector('.productWrap');
const cartsTable = document.querySelector('.shoppingCart-table');
const orderBtn = document.querySelector('.orderInfo-btn');
const orderInfo = document.querySelectorAll('.orderInfo-input');
const productSort = document.querySelector('.productSelect');
// 紀錄購物車狀態(累加用)
let cartsObj = {};
// 紀錄產品資料(篩選用)
let productsArr = [];

// GET 產品
function getProducts() {
  axios
    .get(`${baseUrl}customer/${apiPath}/products`)
    .then((res) => {
      const products = res.data.products;
      productsArr = products;
      renderProducts(products);
    })
    .catch((err) => err.response);
}
// GET 購物車
function getCarts() {
  axios
    .get(`${baseUrl}customer/${apiPath}/carts`)
    .then((res) => {
      const carts = res.data.carts;
      const finalTotal = res.data.finalTotal;
      renderCarts(carts, finalTotal);
      // 儲存購物車 id
      carts.forEach((e) => {
        cartsObj[e.product.id] = e.quantity;
      });
    })
    .catch((err) => err.response);
}

function listenAddCardBtns() {
  // 產品列表未生成前會抓取不到
  const addCardBtn = document.querySelectorAll('.addCardBtn');
  // NodeList：迴圈 + 事件監聽
  addCardBtn.forEach((ele) => {
    ele.addEventListener('click', (e) => {
      e.preventDefault();
      // 取出存在標籤中的 id
      const productId = ele.parentElement.getAttribute('data-id');
      // 新增或累加
      const productInCarts = cartsObj[productId];
      productInCarts
        ? addProdcut(productId, productInCarts)
        : addProdcut(productId);
    });
  });
}
// Post 產品
function addProdcut(id, addedQty = 0) {
  const obj = {
    data: {
      productId: id,
      quantity: 1 + addedQty,
    },
  };
  axios
    .post(`${baseUrl}customer/${apiPath}/carts`, obj)
    .then((res) => {
      alert('新增成功！');
      const carts = res.data.carts;
      carts.forEach((e) => {
        cartsObj[e.product.id] = e.quantity;
      });
      renderCarts(carts, res.data.finalTotal);
    })
    .catch((err) => err.response);
}

function listenDeleteBtns() {
  const discardAllBtn = document.querySelector('.discardAllBtn');
  discardAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    deleteProducts();
  });
  const discardBtn = document.querySelectorAll('.discardBtn');
  discardBtn.forEach((ele) => {
    ele.addEventListener('click', (e) => {
      e.preventDefault();
      const cartId = ele.parentElement
        .querySelector('.cardItem-title')
        .getAttribute('id');
      deleteProduct(cartId);
    });
  });
}
// Delete 全部產品
function deleteProducts() {
  axios
    .delete(`${baseUrl}customer/${apiPath}/carts`)
    .then((res) => {
      alert(res.data.message);
      cartsObj = {};
      renderCarts(res.data.carts, res.data.finalTotal);
    })
    .catch((err) => err.response);
}
// Delete 產品
function deleteProduct(id) {
  axios
    .delete(`${baseUrl}customer/${apiPath}/carts/${id}`)
    .then((res) => {
      alert('品項刪除成功！');
      const carts = res.data.carts;
      cartsObj = {};
      carts.forEach((e) => {
        cartsObj[e.product.id] = e.quantity;
      });
      renderCarts(carts, res.data.finalTotal);
    })
    .catch((err) => err.response);
}

// 新增訂單
orderBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let obj = { data: { user: {} } };
  orderInfo.forEach((ele) => {
    obj.data.user[ele.name] = ele.value;
  });
  postOrder(obj);
});
// Post 訂單
function postOrder(orderInfo) {
  axios
    .post(`${baseUrl}customer/${apiPath}/orders`, orderInfo)
    .then(() => {
      alert('訂單新增成功！');
      document.querySelector('.orderInfo-form').reset();
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
}

// 渲染產品列表
function renderProducts(data) {
  let content = '';
  data.forEach((e) => {
    content += `<li class="productCard" data-id="${e.id}">
      <h4 class="productType">新品</h4>
      <img
      src="${e.images}"
      alt="${e.description}"
      />
      <a href="#" class="addCardBtn">加入購物車</a>
      <h3>${e.title}</h3>
      <del class="originPrice">${e.origin_price}</del>
      <p class="nowPrice">${e.price}</p>
    </li>`;
  });
  productList.innerHTML = content;
  listenAddCardBtns();
}
// 渲染購物車
function renderCarts(data, total) {
  let content = '';
  data.forEach((e) => {
    content += `<tr><td>
    <div class="cardItem-title" id="${e.id}">
      <img src="${e.product.images}" alt="${e.product.description}" />
      <p>${e.product.title}</p>
    </div>
  </td>
  <td>NT$${e.product.price}</td>
  <td>${e.quantity}</td>
  <td>NT$${e.product.price * e.quantity}</td>
  <td class="discardBtn">
    <a href="#" class="material-icons"> clear </a>
  </td></tr>`;
  });
  const cartsTemplate = `<tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
  </tr>
  ${content}
  <tr>
    <td>
      <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
      <p>總金額</p>
    </td>
    <td>NT$${total}</td>
  </tr>`;
  cartsTable.innerHTML = cartsTemplate;
  listenDeleteBtns();
}

getProducts();
getCarts();

// 篩選功能
productSort.addEventListener('change', (e) => {
  const nowCategory = e.target.value;
  if (nowCategory !== '全部') {
    const sortedArr = productsArr.filter((e) => e.category === nowCategory);
    renderProducts(sortedArr);
  }
});
