const baseUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/';
const apiPath = '2023-js-live';
const config = {
  headers: {
    Authorization: '5kLl4eIj5XgVG8FstJcylSTy4xN2',
  },
};

const ordersList = document.querySelector('.ordersList');
const discardAllBtn = document.querySelector('.discardAllBtn');

function getOrders() {
  axios
    .get(`${baseUrl}admin/${apiPath}/orders`, config)
    .then((res) => {
      const orders = res.data.orders;
      renderOrders(orders);
      createPieChart(filterToChart(orders));
    })
    .catch((err) => err.response);
}

/* 修改訂單狀態 */
function listenOrdersStatus() {
  const ordersStatus = document.querySelectorAll('.orderStatus');
  ordersStatus.forEach((ele) => {
    ele.addEventListener('click', (e) => {
      e.preventDefault();
      const orderId = ele.parentElement.getAttribute('data-id');
      let orderPaid = e.target.getAttribute('data-paid');
      // 轉為 boolean 並切換
      orderPaid = orderPaid === 'false';
      putOrderStatus(orderId, orderPaid);
    });
  });
}
// Put order
function putOrderStatus(id, paid) {
  console.log('ok');
  const obj = {
    data: {
      id,
      paid,
    },
  };
  axios
    .put(`${baseUrl}admin/${apiPath}/orders`, obj, config)
    .then((res) => {
      alert('狀態編輯成功！');
      renderOrders(res.data.orders);
    })
    .catch((err) => err.response);
}

/* 刪除相關 */
discardAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  deleteAllOrders();
});
// Delete 全部
function deleteAllOrders() {
  axios
    .delete(`${baseUrl}admin/${apiPath}/orders`, config)
    .then((res) => {
      alert(res.data.message);
      const orders = res.data.orders;
      renderOrders(orders);
      createPieChart(filterToChart(orders));
    })
    .catch((err) => err.response);
}
// 監聽單一刪除按鈕
function listenDelSingleOrderBtn() {
  const DelSingleOrderBtn = document.querySelectorAll('.delSingleOrder-Btn');
  DelSingleOrderBtn.forEach((ele) => {
    ele.addEventListener('click', (e) => {
      e.preventDefault();
      const orderId = ele.parentElement.parentElement.getAttribute('data-id');
      deleteOrder(orderId);
    });
  });
}
// Delete 單一訂單
function deleteOrder(id) {
  axios
    .delete(`${baseUrl}admin/${apiPath}/orders/${id}`, config)
    .then((res) => {
      alert('刪除成功！');
      const orders = res.data.orders;
      renderOrders(orders);
      createPieChart(filterToChart(orders));
    })
    .catch((err) => err.response);
}

function renderOrders(data) {
  let content = '';
  data.forEach((e) => {
    const cartsContent = e.products.reduce((acc, e) => {
      return acc + `<p>${e.title}</p>`;
    }, '');
    // 轉換 Unix 時間戳
    const date = new Date(e.createdAt * 1000);
    content += `
    <tr data-id="${e.id}">
      <td>${e.id}</td>
      <td>
        <p>${e.user.name}</p>
        <p>${e.user.tel}</p>
      </td>
      <td>${e.user.address}</td>
      <td>${e.user.email}</td>
      <td>
        ${cartsContent}
      </td>
      <td>${date.getFullYear()}/${date.getMonth()}/${date.getDate()}</td>
      <td class="orderStatus">
        <a href="#" data-paid="${e.paid}">${e.paid ? '已處理' : '未處理'}</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" />
      </td>
    </tr>`;
  });
  ordersList.innerHTML = content;
  listenOrdersStatus();
  listenDelSingleOrderBtn();
}

getOrders();

/* 圖表相關 */
function filterToChart(data) {
  console.log(data);
  // 品項與累計營收
  let countNum = {};
  data.forEach((ele) => {
    ele.products.forEach((e) => {
      const totalPrice = e.origin_price * e.quantity;
      countNum[e.title]
        ? (countNum[e.title] += totalPrice)
        : (countNum[e.title] = totalPrice);
    });
  });
  // 排序 > 整理成圖表需要格式 > 第四名以後累加 > 回傳資料，包含判斷無資料
  const sortedTitle = Object.keys(countNum).sort(
    (a, b) => countNum[b] - countNum[a]
  );
  const pieFormat = sortedTitle.map((e) => [e, countNum[e]]);
  const countOther = [];
  pieFormat.forEach((e, i) => {
    if (i < 3) {
      countOther.push(e);
    } else if (i === 3) {
      countOther.push(['其他', e[1]]);
    } else {
      countOther[3][1] += e[1];
    }
  });
  return !countOther.length ? [['無資料', 1]] : countOther;
}

function createPieChart(data) {
  const chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: data,
      type: 'pie',
    },
  });
}
