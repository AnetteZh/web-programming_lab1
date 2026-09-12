document.addEventListener('DOMContentLoaded', () => {

  const modalCreateOrder = document.getElementById('create-order-modal');
  const closeOrderBtn    = document.getElementById('close-modal-order');
  const openOrderBtn     = document.querySelector('#create-ord-btn');

  if (openOrderBtn) {
    openOrderBtn.addEventListener('click', () => {
      const totalEl = document.getElementById('total-price');
      const cartTotal = document.getElementById('cart-total');

      if (cart.length == 0) {
        alert('Ваша корзина пуста!');
        return;
      }

      if (totalEl && cartTotal) {
        totalEl.textContent = cartTotal.textContent.replace('Итого:', 'Сумма к оплате:');
      }
      modalCreateOrder.style.display = 'flex';
    });
  }


  if (closeOrderBtn) {
    closeOrderBtn.addEventListener('click', () => {
      modalCreateOrder.style.display = 'none';
    });
  }

  modalCreateOrder?.addEventListener('click', (e) => {
    if (e.target === modalCreateOrder) {
      modalCreateOrder.style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCreateOrder.style.display === 'flex') {
      modalCreateOrder.style.display = 'none';
    }
  });

  const modal      = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc  = document.getElementById('modal-desc');
  const closeBtn   = document.getElementById('close-modal');
  const openBtns   = document.querySelectorAll('.open-modal-btn');

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalTitle.textContent = btn.dataset.title || '';
      modalDesc.textContent  = btn.dataset.desc  || '';
      modal.style.display = 'flex';   
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });

  const sendFormBtn = document.querySelector('.send-form');
  const orderForm   = document.querySelector('#create-order-modal form');

  if (sendFormBtn && orderForm) {
    sendFormBtn.addEventListener('click', () => {
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }

      alert('Заказ оформлен!');

      cart = [];
      saveCart();
      renderCart();

      orderForm.reset();

      modalCreateOrder.style.display = 'none';
      showCart();
    })};


  let cart = JSON.parse(localStorage.getItem('knitter-cart')) || [];

  const cartCountEl  = document.getElementById('cart-count');
  const cartPage     = document.getElementById('cart-page');
  const cartItemsEl  = document.getElementById('cart-items');
  const cartTotalEl  = document.getElementById('cart-total');
  const cartLink     = document.querySelector('.cart-link');
  const homeLink     = document.querySelector('.home-link');
  const mainSections = document.querySelectorAll('main > section:not(#cart-page):not(.modal)');

  function saveCart() {
    localStorage.setItem('knitter-cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    if (cartCountEl) cartCountEl.textContent = cart.length;
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

  function renderCart() {
    if (!cartItemsEl || !cartTotalEl) return;
    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding:10px;background:#f9f9f9;border-radius:6px;';

      const title = document.createElement('span');
      title.textContent = item.title;

      const right = document.createElement('div');

      const price = document.createElement('strong');
      price.textContent = `${item.price.toLocaleString()} ₽`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Удалить';
      removeBtn.style.cssText = 'background:transparent;border:none;color:#ff4d4d;cursor:pointer;margin-left:10px;font-weight:bold;';
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

  document.querySelectorAll('.product-card .add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const title = card.querySelector('.product-title').textContent.trim();
      const priceEl = card.querySelector('.product-price');
      const price = parseFloat(priceEl.dataset.price || priceEl.textContent.replace(/[^0-9.]/g, ''));

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

  cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    showCart();
  });

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showShop();
  });

  if (location.hash === '#cart-page') showCart();

  updateCartCount();
});
