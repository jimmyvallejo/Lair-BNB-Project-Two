const calculateBtn = document.querySelector('#calculate-btn');
const finalPriceEl = document.querySelector('#finalprice');
const checkoutBtn = document.querySelector('#checkout-btn');
const numberOfNightsEl = document.querySelector('#number-of-nights');
const priceEl = document.querySelector('#checkoutprice');
const priceText = priceEl.textContent;
const price = parseFloat(priceText.replace('$', '').split(' ')[0]);
const nightStay = document.getElementById('nightStay')
let nightsvalue = numberOfNightsEl.value;


const display = document.getElementById('number-of-nights-display')
calculateBtn.addEventListener('click', () => {
  display.textContent = `${numberOfNightsEl.value} * ${price}`
  checkoutBtn.disabled = false;
  finalPriceEl.textContent = numberOfNightsEl.value * price;
  nightStay.textContent = numberOfNightsEl.value

});

let roomName = document.getElementById('roomName').innerText

checkoutBtn.addEventListener('click', () => {
  var numberOfNights = parseInt(numberOfNightsEl.value);
  
  let value = 0;

  switch(roomName){
    case 'Frankensteins Lab':
      value = 0;
      break;
      
      case 'Draculas Castle':
        value = 1;
        break;
        
        case `Gru's Lab`:
          value = 2;
          break;

          case 'Alien Abduction':
            value = 3;
            break;

            case 'Cabin in the Woods':
              value = 4;
              break;

              case 'Abandoned Asylum':
                value = 5;
                break;

                case 'Under the bed':
                  value = 6;
                  break;

                  case 'Conjuring House':
                    value = 7;
                    break;
           
  }
  fetch("https://lairbnb.fly.dev/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{id: value, quantity: numberOfNights}]
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
})








