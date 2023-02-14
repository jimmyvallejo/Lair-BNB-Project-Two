
const calculateBtn = document.getElementById('calculate-btn');

const checkoutBtn = document.getElementById('checkout-btn');
const roomName = document.querySelector('h3').dataset.roomName;

function calculatePrice() {
    const nights = document.getElementById('number-of-nights').value;
    const pricePerNight = Number(document.getElementById('checkoutprice').textContent.match(/\d+/));
    const totalPrice = nights * pricePerNight;
    document.getElementById('finalprice').textContent = `Total price: $${totalPrice}`;
    checkoutBtn.disabled = false;
  }


  calculateBtn.addEventListener('click', calculatePrice);