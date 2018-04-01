// método simple...

// Public key TEST-f6c633d9-1062-4467-9eff-33c55808eec0
// Access web token: TEST-6076825952636705-032920-2134a1585be1c93ce17289fcdedb294f-97172637
Mercadopago.setPublishableKey('TEST-f6c633d9-1062-4467-9eff-33c55808eec0');

Mercadopago.getIdentificationTypes();

function addEvent(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, function () {
      handler.call(el);
    });
  }
}

function getBin() {
  var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
  return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
}

function guessingPaymentMethod(event) {
  var bin = getBin();
  if (event.type == "keyup") {
    if (bin.length >= 6) {
      Mercadopago.getPaymentMethod({
        "bin": bin
      }, setPaymentMethodInfo);
    }
  } else {
    setTimeout(function () {
      if (bin.length >= 6) {
        Mercadopago.getPaymentMethod({
          "bin": bin
        }, setPaymentMethodInfo);
      }
    }, 100);
  }
}

function setPaymentMethodInfo(status, response) {
  if (status == 200) {
    // do somethings ex: show logo of the payment method
    var form = document.querySelector('#pay');
    var ccc = document.querySelector('#ccc');

    console.log(response);

    if (document.querySelector("input[name=paymentMethodId]") == null) {
      var paymentMethod = document.createElement('input');
      paymentMethod.setAttribute('name', "paymentMethodId");
      paymentMethod.setAttribute('type', "hidden");
      paymentMethod.setAttribute('value', response[0].id);
      ccc.setAttribute('src', response[0].secure_thumbnail);
      form.appendChild(paymentMethod);
    } else {
      document.querySelector("input[name=paymentMethodId]").value = response[0].id;
      ccc.setAttribute('src', response[0].secure_thumbnail);
    }

    Mercadopago.getInstallments({
      "bin": getBin(),
      "amount": 200
    }, setInstallmentInfo);
    // var jojojo = document.querySelector('#jojojo');
    // var li = document.querySelector('#cardNumber');
    // if (jojojo === null) {
    //   var img = document.createElement('img');
    //   img.setAttribute('id', 'jojojo');
    //   img.setAttribute('src', response[0].secure_thumbnail);
    //   li.parentElement.appendChild(img);
    // } else {
    //   jojojo.setAttribute('src', response[0].secure_thumbnail);
    //   li.parentElement.appendChild(jojojo);
    // }

  }
}

function setInstallmentInfo(status, response) {
  var selectorInstallments = document.querySelector("#installments"),
    fragment = document.createDocumentFragment();

  selectorInstallments.options.length = 0;

  if (response.length > 0) {
    var option = new Option("Choose...", '-1'),
      payerCosts = response[0].payer_costs;

    fragment.appendChild(option);
    for (var i = 0; i < payerCosts.length; i++) {
      option = new Option(payerCosts[i].recommended_message || payerCosts[i].installments, payerCosts[i].installments);
      fragment.appendChild(option);
    }
    selectorInstallments.appendChild(fragment);
    selectorInstallments.removeAttribute('disabled');
  }
}

addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', guessingPaymentMethod);
addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', guessingPaymentMethod);

doSubmit = false;
addEvent(document.querySelector('#pay'), 'submit', doPay);
function doPay(event) {
  event.preventDefault();
  if (!doSubmit) {
    var $form = document.querySelector('#pay');

    Mercadopago.createToken($form, sdkResponseHandler);
    return false;
  }
}

function sdkResponseHandler(status, response) {
  if (status != 200 && status != 201) {
    alert("verify filled data");
  } else {
    var form = document.querySelector('#pay');
    var card = document.createElement('input');
    card.setAttribute('name', 'token');
    card.setAttribute('type', 'hidden');
    card.setAttribute('value', response.id);
    form.appendChild(card);
    doSubmit = true;
    //form.submit();
  }
}
