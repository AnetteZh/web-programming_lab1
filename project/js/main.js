document.addEventListener('DOMContentLoaded', () => {

  /*корзина*/
  let cart = JSON.parse(localStorage.getItem('knitter-cart')) || [];


  /*переменные из DOM*/

  // header
  const cartCountEl  = document.getElementById('cart-count');
  const cartLink     = document.querySelector('.cart-link');
  const homeLink     = document.querySelector('.home-link');

  // cart
  const cartPage     = document.getElementById('cart-page');
  const cartItemsEl  = document.getElementById('cart-items');
  const cartTotalEl  = document.getElementById('cart-total');
  const openOrderBtn = document.getElementById('create-ord-btn');

  // секции магазина
  const mainSections = document.querySelectorAll('main > section:not(#cart-page):not(.modal)');

  // модальное окно (подробнее о товаре)
  const productModal  = document.getElementById('product-modal');
  const modalTitle    = document.getElementById('modal-title');
  const modalDesc     = document.getElementById('modal-desc');
  const closeProduct  = document.getElementById('close-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  // модальное окно (оформление заказа)
  const orderModal     = document.getElementById('create-order-modal');
  const closeOrderBtn  = document.getElementById('close-modal-order');
  const orderForm      = document.querySelector('#create-order-modal form');
  const sendFormBtn    = document.querySelector('.send-form');
  const totalPriceEl   = document.getElementById('total-price');


  /*функционал корзины*/

  function saveCart() {
    localStorage.setItem('knitter-cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    if (cartCountEl) cartCountEl.textContent = cart.length;
  }

  function renderCart() {
    if (!cartItemsEl || !cartTotalEl) return;

    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const row = document.createElement('div');
      row.className = 'cart-item';

      const title = document.createElement('span');
      title.className = 'cart-item-title';
      title.textContent = item.title;

      const right = document.createElement('div');
      right.className = 'cart-item-right';

      const price = document.createElement('strong');
      price.className = 'cart-item-price';
      price.textContent = `${item.price.toLocaleString()} ₽`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'cart-item-remove';
      removeBtn.textContent = 'Удалить';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });

      right.append(price, removeBtn);
      row.append(title, right);
      cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = `Итого: ${total.toLocaleString()} ₽`;
  }

  function showShop() {
    mainSections.forEach(sec => sec.style.display = '');
    cartPage.style.display = 'none';
    cartLink.style.display = '';
    homeLink.style.display = 'none';
  }

  function showCart() {
    mainSections.forEach(sec => sec.style.display = 'none');
    cartPage.style.display = 'block';
    cartLink.style.display = 'none';
    homeLink.style.display = '';
    renderCart();
  }


  /*модальное окно (подробнее о товаре)*/

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalTitle.textContent = btn.dataset.title || '';
      modalDesc.textContent  = btn.dataset.desc  || '';
      productModal.style.display = 'flex';
    });
  });

  closeProduct.addEventListener('click', () => {
    productModal.style.display = 'none';
  });

  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.style.display = 'none';
  });


  /*модальное окно (оформление заказа)*/

  openOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Ваша корзина пуста!');
      return;
    }

    if (totalPriceEl && cartTotalEl) {
      totalPriceEl.textContent = cartTotalEl.textContent.replace('Итого:', 'Сумма к оплате:');
    }

    orderModal.style.display = 'flex';
  });

  closeOrderBtn.addEventListener('click', () => {
    orderModal.style.display = 'none';
  });

  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) orderModal.style.display = 'none';
  });


  /*отправка формы заказа*/

  sendFormBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Ваша корзина пуста!');
      orderModal.style.display = 'none';
      return;
    }

    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    alert('Заказ оформлен!');

    cart = [];
    saveCart();
    renderCart();

    orderForm.reset();
    orderModal.style.display = 'none';
    showCart();
  });


  /*добавление в корзину*/

  document.querySelectorAll('.product-card .add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card    = btn.closest('.product-card');
      const title   = card.querySelector('.product-title').textContent.trim();
      const priceEl = card.querySelector('.product-price');
      const price   = parseFloat(priceEl.dataset.price || priceEl.textContent.replace(/[^0-9.]/g, ''));

      cart.push({ id: Date.now() + Math.random(), title, price });
      saveCart();

      const originalText = btn.textContent;
      btn.textContent = 'Добавлено';
      btn.style.opacity = '0.8';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.opacity = '1';
      }, 2000);
    });
  });


  /*навигация (корзина-главная)*/

  cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    showCart();
  });

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showShop();
  });


  /*закрытие модальных окон при нажатии 'esc'*/

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (productModal.style.display === 'flex') productModal.style.display = 'none';
    if (orderModal.style.display   === 'flex') orderModal.style.display   = 'none';
  });


  /*инициализация*/

  if (location.hash === '#cart-page') showCart();
  updateCartCount();

});