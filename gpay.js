/** Launches payment request flow when user taps on buy button. */

function onBuyClicked() {
   
    if (!window.PaymentRequest) {
      console.log('Web payments are not supported in this browser.');
      return;
    }
  
    // Create supported payment method.
    const supportedInstruments = [
      {
        supportedMethods: ['https://tez.google.com/pay'],
        data: {
          pa: '9154320007@icici',
          pn: 'Anoop DSLR Rentals',
          tr: '123456789',  // Your custom transaction reference ID
          url: 'http://modernsilpi.com/',
          mc: '5946', //Your merchant category code
          tn: 'Purchase in Merchant',
        },
      },
    ];
  
    // Create order detail data.
    const details = {
      total: {
        label: 'Total',
        amount: {
          currency: 'INR',
          value: '10.01', // sample amount
        },
      },
      displayItems: [{
        label: 'Original Amount',
        amount: {
          currency: 'INR',
          value: '10.01',
        },
      }],
      
    };
  
    // Create payment request object.
    let request = null;
    try {

      request = new PaymentRequest(supportedInstruments, details);
    } catch (e) {
      console.log('Payment Request Error: ' + e.message);
      return;
    }
    if (!request) {
      console.log('Web payments are not supported in this browser.');
      return;
    }
  
    // var canMakePaymentPromise = checkCanMakePayment(request);
    // canMakePaymentPromise
    //     .then((result) => {
    //       showPaymentUI(request, result);
    //     })
    //     .catch((err) => {
    //       console.log('Error calling checkCanMakePayment: ' + err);
    //     });
  }




  //
  // Global key for canMakepayment cache.
const canMakePaymentCache = 'canMakePaymentCache';

/**
 * Check whether can make payment with Google Pay or not. It will check session storage
 * cache first and use the cache directly if it exists. Otherwise, it will call
 * canMakePayment method from PaymentRequest object and return the result, the
 * result will also be stored in the session storage cache for future usage.
 *
 * @private
 * @param {PaymentRequest} request The payment request object.
 * @return {Promise} a promise containing the result of whether can make payment.
 */
function checkCanMakePayment(request) {
  // Check canMakePayment cache, use cache result directly if it exists.
  if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
    return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
  }

  // If canMakePayment() isn't available, default to assume the method is
  // supported.
  var canMakePaymentPromise = Promise.resolve(true);

  // Feature detect canMakePayment().
  if (request.canMakePayment) {
    canMakePaymentPromise = request.canMakePayment();
 
  }

  return canMakePaymentPromise
      .then((result) => {
        // Store the result in cache for future usage.
        sessionStorage[canMakePaymentCache] = result;
        return result;
      })
      .catch((err) => {
        console.log('Error calling canMakePayment: ' + err);
      });
}