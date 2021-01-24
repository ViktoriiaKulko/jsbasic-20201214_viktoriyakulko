import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    let currentItem = this.cartItems.find(item => item.product.id == product.id);

    if (currentItem) {
      currentItem.count++;
    } else {
      currentItem = {
        product: product,
        count: 1
      };
      this.cartItems.push(currentItem);
    }

    this.onProductUpdate(currentItem);
  }

  updateProductCount(productId, amount) {
    let currentItem = this.cartItems.find(item => item.product.id == productId);

    currentItem.count += amount;

    if (currentItem.count == 0) {
      this.cartItems.splice([this.cartItems.indexOf(currentItem)], 1);
    }

    this.onProductUpdate(currentItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((totalCount, item) => totalCount + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((totalPrice, item) => totalPrice + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    const modal = new Modal();
    const body = createElement('<div></div>');
    const products = this.cartItems.map(item => this.renderProduct(item.product, item.count));
    const orderForm = this.renderOrderForm();

    products.forEach(product => body.append(product));
    body.append(orderForm);

    modal.setTitle('Your order');
    modal.setBody(body);
    modal.open();

    body.addEventListener('click', this.onProductsClick);
    orderForm.addEventListener('submit', this.onSubmit);
  }

  onProductsClick = (e) => {
    const button = e.target.closest('.cart-counter__button');

    if (!button) return false;

    const product = button.closest('.cart-product').dataset.productId;

    if (button.classList.contains('cart-counter__button_minus')) {
      this.updateProductCount(product, -1);
    }

    if (button.classList.contains('cart-counter__button_plus')) {
      this.updateProductCount(product, 1);
    }
  }

  onProductUpdate(cartItem) {
    // ...ваш код

    this.cartIcon.update(this);
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log('submit');
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

