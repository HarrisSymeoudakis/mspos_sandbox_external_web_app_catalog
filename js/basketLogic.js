window.onload = function() {
    localStorage.setItem('cartItems', "");
};

var postButtonDemoElements = document.querySelectorAll('.postButtonDemo');

// Loop through each button and attach event listener
postButtonDemoElements.forEach(function(button) {
    button.addEventListener('click', function(event) {
        var urlStart = 'https://retail-services.cegid.cloud/t/pos/additem/';
        var item = button.getAttribute('item');
        var newUrl = urlStart + item + '/1';
        console.log(newUrl);

        window.location.href = newUrl;
    });
});

let itemLineIdCounter = 1; // Initialize item line ID counter
let finalItems="";

var addToCartButtonElements = document.querySelectorAll('.addToCartButton');

addToCartButtonElements.forEach(function(button) {
    button.addEventListener('click', function(event) {
        const itemCode = event.target.getAttribute('item'); // Get item code from button attribute
        const basePrice = parseFloat(event.target.getAttribute('item-value')); // Get base price from button attribute
        console.log("im in");
        addToCart(itemCode,basePrice)

      
    });
});
// function updateRemoveButtons() {
//     // Retrieve cart items from localStorage
//     const existingItems = localStorage.getItem('cartItems');
    

//     // Get all buttons with class removeButton
//     var removeButtons = document.querySelectorAll('.removeButton');

//     // Iterate through each remove button
//     removeButtons.forEach(button => {
//         // Get the item attribute value of the button
//         var itemCode = button.getAttribute('item');

//         // Check if the item exists in the cart items
//         var itemExists = cartItems.some(item => item.itemCode === itemCode && item.quantity>0);

//         // Enable or disable the button based on item existence
//         button.disabled = !itemExists;
//     });
// }

// // Call updateRemoveButtons function initially to set the initial state of remove buttons
// updateRemoveButtons();

var removeFromCartButtonElements = document.querySelectorAll('.removeFromBasket');

removeFromCartButtonElements.forEach(function(button) {
    button.addEventListener('click', function(event) {
        const itemCode = event.target.getAttribute('item'); // Get item code from button attribute
        const basePrice = parseFloat(event.target.getAttribute('item-value')); // Get base price from button attribute
        console.log("im in");
        removeFromCart(itemCode,basePrice)

      
    });
});
// Function to handle click event on addToCart buttons
// document.querySelectorAll('.addToCartButton').forEach(button => {
//     console.log(button);
//     button.addEventListener('click', addToCart); // Don't invoke addToCart here, just pass the reference
// });

function addToCart(itemCode, basePrice) {
    // Retrieve cart items from localStorage
    const existingItems = localStorage.getItem('cartItems');
    
    // Parse the cart items JSON string into an array
    const cartItems = existingItems ? JSON.parse(existingItems) : [];
 console.log(cartItems);
    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => item.item.itemCode === itemCode);

    if (existingItemIndex !== -1) {
        console.log("it exists");
        // If the item already exists in the cart, increase its quantity by 1
        cartItems[existingItemIndex].quantity++;
    } else {
        console.log("got inside else");
        // If the item doesn't exist in the cart, create a new cart item
        const item = {
            "itemCode": itemCode
        };

        const cartItem = {
            "itemLineId": itemLineIdCounter++,
            "item": item,
            "quantity": 1,
            "price": {
                "basePrice": basePrice,
                "currentPrice": basePrice
            },
            "lineAmount": {
                "currency": "EUR",
                "value": basePrice
            },
            "inventoryOrigin": {
                "warehouseId": "FR0041"
            }
        };

        // Add the new cart item to the cartItems array
        cartItems.push(cartItem);
    }
    console.log(cartItems);
    // Convert the updated cartItems array back to JSON string and store it in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


function removeFromCart(itemCode, basePrice) {

    
   const existingItems = localStorage.getItem('cartItems');
    
    // Parse the cart items JSON string into an array
    const cartItems = existingItems ? JSON.parse(existingItems) : [];
 console.log(cartItems);
    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => item.item.itemCode === itemCode);
    
    
    console.log(cartItems[existingItemIndex]);
    // If the item exists in the cart and its quantity is greater than 0, decrease the quantity by 1
    if (existingItemIndex !== -1 ) {
        cartItems[existingItemIndex].quantity--;

        console.log(cartItems);
        

        
        // Update localStorage with the updated cart items
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}



// function addToCart(itemCode,basePrice) {
   
//     console.log("okkkk");
//     const item = {
//         "itemCode": itemCode
//     };

//     const cartItem = {
//         "itemLineId": itemLineIdCounter++,
//         "item": item,
//         "quantity": 1,
//         "price": {
//             "basePrice": basePrice,
//             "currentPrice": basePrice
//         },
//         "lineAmount": {
//             "currency": "EUR",
//             "value": basePrice
//         },
//         "inventoryOrigin": {
//             "warehouseId": "FR0041"
//         }
//     };

//     const jsonString = JSON.stringify(cartItem);
//     const existingItems = localStorage.getItem('cartItems');

//     // If there are existing items in the cart, add a comma before appending the new item
//     const updatedItems = existingItems ? `${existingItems},${jsonString}` : jsonString;
//     console.log(updatedItems);
//     localStorage.setItem('cartItems', updatedItems);
// }

// document.getElementById('liveStoreBasket').addEventListener('click', function() {

//     window.location.href = 'https://retail-services.cegid.cloud/t/pos/external-basket/556da48d-c189-4292-a8d1-b245c4024f54';
// });

// function getToken(callback) {
//     var tokenRequest = new XMLHttpRequest();
//     var tokenUrl = 'https://retail-services.cegid.cloud/t/as/connect/token'; // Replace with your authentication endpoint URL
//     var tokenData = 'client_id=CegidRetailResourceFlowClient&username=Harris@90571062_002_TEST&password=Cegid2&grant_type=password&scope=RetailBackendApi offline_access'; // Construct x-www-form-urlencoded body

//     tokenRequest.open('POST', tokenUrl, true);
//     tokenRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     tokenRequest.onreadystatechange = function() {
//         if (tokenRequest.readyState === 4) {
//             if (tokenRequest.status === 200) {
//                 var tokenResponse = JSON.parse(tokenRequest.responseText);
//                 var accessToken = tokenResponse.access_token;
//                 console.log(accessToken);
//                 callback(null, accessToken);
//             } else {
//                 var error = new Error('Failed to get token');
//                 callback(error, null);
//             }
//         }
//     };

//     tokenRequest.send(tokenData);
// }

// document.getElementById('testBut').addEventListener('click',function(event){
//     // var parameter1 = event.target.getAttribute('data-parameter1');
//     var value = event.target.getAttribute('item-value');
//     var item = event.target.getAttribute('item');

//     getToken(function(error,accessToken){
//         if (error) {
//             console.error('Error:', error);
//         }else{
//             var xhr = new XMLHttpRequest();
//             var postUrl = 'https://retail-services.cegid.cloud/t/pos/external-basket/v1'; // Replace with your API endpoint URL

//             xhr.open('POST', postUrl, true);
//             xhr.setRequestHeader('Content-Type', 'application/json');
//             xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken); // Include access token in the request headers

//             xhr.onreadystatechange = function() {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         console.log('POST request successful');
//                         var response = JSON.parse(xhr.responseText);
//                         if (response.externalBasketUrl) {
//                             window.location.href = response.externalBasketUrl;
//                         }
//                     } else {
//                         console.error('Error:', xhr.status);
//                         // Handle error if needed
//                     }
//                 }
//             };
//             var customerId = "HQ00100001"
//             var postData = {
//                 "externalReference": "SimpleSale",
//                 "basketType": "RECEIPT",
//                 "customer": {
//                     "customerCode": customerId // Change the value dynamically here
//                 },
//                 "itemLines": [
//                     {
//                         "itemLineId": 1,
//                         "item": {
//                             "itemCode": item
//                         },
//                         "quantity": 1,
//                         "price": {
//                             "basePrice": value,
//                             "currentPrice": value
//                         },
//                         "lineAmount": {
//                             "currency": "EUR",
//                             "value": value
//                         },
//                         "inventoryOrigin": {
//                             "warehouseId": "FR0041"
//                         }
//                     }
//                 ],
//                 "store": {
//                     "storeId": "FR004"
//                 }
//             };

//             // Convert postData to JSON string
//             var postDataString = JSON.stringify(postData);
//             console.log(postDataString);
//             xhr.send(postData);
//         }
//     });
// });


// document.getElementById('postButton').addEventListener('click', function() {
//     getToken(function(error, accessToken) {
//         if (error) {
//             console.error('Error:', error);
//             // Handle error if needed
//         } else {
//             // Use access token to make the POST request
//             var xhr = new XMLHttpRequest();
//             var postUrl = 'https://example.com/api/endpoint'; // Replace with your API endpoint URL

//             xhr.open('POST', postUrl, true);
//             xhr.setRequestHeader('Content-Type', 'application/json');
//             xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken); // Include access token in the request headers

//             xhr.onreadystatechange = function() {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         console.log('POST request successful');
//                         var response = JSON.parse(xhr.responseText);
//                         if (response.url) {
//                             window.location.href = response.url;
//                         }
//                     } else {
//                         console.error('Error:', xhr.status);
//                         // Handle error if needed
//                     }
//                 }
//             };

//             var postData = JSON.stringify({ key: 'value' }); // Replace with your data
//             xhr.send(postData);
//         }
//     });
// });




function getToken(callback) {
    console.log("hello");
    var tokenRequest = new XMLHttpRequest();
    var tokenUrl = 'http://localhost:3000/et/as/connect/token'; // Proxy server URL
    // var tokenUrl = 'http://retail-services.cegid.cloud/et/as/connect/token'; // Proxy server URL
    var tokenData = 'client_id=CegidRetailResourceFlowClient&username=AI@90478305_003_TEST&password=1234&grant_type=password&scope=RetailBackendApi offline_access'; // Construct x-www-form-urlencoded body

    tokenRequest.open('POST', tokenUrl, true);
    tokenRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    tokenRequest.onreadystatechange = function() {
        if (tokenRequest.readyState === 4) {
            if (tokenRequest.status === 200) {
                var tokenResponse = JSON.parse(tokenRequest.responseText);
                var accessToken = tokenResponse.access_token;
                console.log(accessToken);
                callback(null, accessToken);
            } else {
                var error = new Error('Failed to get token');
                callback(error, null);
            }
        }
    };

    tokenRequest.send(tokenData);
}

// document.getElementById('viewBasketAll').addEventListener('click', function() {
//     // var parameter1 = event.target.getAttribute('data-parameter1');
    

//     getToken(function(error, accessToken) {
//         if (error) {
//             console.error('Error:', error);
//             console.log('Error:', error);
//         } else {
//             console.log("passed");
//             var xhr = new XMLHttpRequest();
//             // var postUrl = 'https://eo533oscrky2sxp.m.pipedream.net'
//             var postUrl = 'http://localhost:3000/et/pos/external-basket/v1'; // Proxy server URL
//             // var postUrl = 'http://retail-services.cegid.cloud/et/pos/external-basket/v1'
//             xhr.open('POST', postUrl, true);
//             xhr.setRequestHeader('Content-Type', 'application/json');
//             xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken); // Include access token in the request headers

//             xhr.onreadystatechange = function() {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         console.log('POST request successful');
//                         var response = JSON.parse(xhr.responseText);
//                         if (response.externalBasketUrl) {
//                             window.location.href = response.externalBasketUrl;
//                         }
//                     } else {
//                         console.error('Error:', xhr.status);
//                         // Handle error if needed
//                     }
//                 }
//             };

//             var customerId = "HQ00100001";
//             var postData = {
//                 "externalReference": "SimpleSale",
//                 "basketType": "RECEIPT",
//                 "customer": {
//                     "customerCode": customerId // Change the value dynamically here
//                 },
//                 "itemLines":  JSON.parse( localStorage.getItem('cartItems')),
//                 "store": {
//                     "storeId": "FR004"
//                 }
//             };

//             // Convert postData to JSON string
//             console.log(postData);
//             var postDataString = JSON.stringify(postData);
//             console.log(postDataString);
//             xhr.send(postDataString);
//         }
//     });
// });

document.getElementById('viewBasketAll').addEventListener('click', function() {
    getToken(function(error, accessToken) {
        if (error) {
            console.error('Error:', error);
        } else {
            var xhr = new XMLHttpRequest();
            var postUrl = 'http://localhost:3000/et/pos/external-basket/v1'; // Proxy server URL
            xhr.open('POST', postUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken); // Include access token in the request headers

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('POST request successful');
                        var response = JSON.parse(xhr.responseText);
                        if (response.externalBasketUrl) {
                            window.location.href = response.externalBasketUrl;
                        }
                    } else {
                        console.error('Error:', xhr.status);
                        // Handle error if needed
                    }
                }
            };

            // Retrieve cart items from localStorage
            var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // Filter out items with quantity greater than 0
            cartItems = cartItems.filter(item => item.quantity > 0);

            // Re-enumerate itemLineId
            cartItems.forEach((item, index) => {
                item.itemLineId = index + 1; // Increment index by 1
            });

            var customerId = "HQ00100001";
            var postData = {
                "externalReference": "SimpleSale",
                "basketType": "RECEIPT",
                "customer": {
                    "customerCode": customerId // Change the value dynamically here
                },
                "itemLines": cartItems,
                "store": {
                    "storeId": "FR004"
                }
            };

            // Convert postData to JSON string
            var postDataString = JSON.stringify(postData);
            xhr.send(postDataString);
        }
    });
});


// document.getElementById('testButton').addEventListener('click', function(event) {
//     // var parameter1 = event.target.getAttribute('data-parameter1');
//     var value = event.target.getAttribute('item-value');
//     var item = event.target.getAttribute('item');

//     getToken(function(error, accessToken) {
//         if (error) {
//             console.error('Error:', error);
//             console.log('Error:', error);
//         } else {
//             console.log("passed");
//             var xhr = new XMLHttpRequest();
//             var postUrl = 'http://localhost:3000/t/pos/external-basket/v1'; // Proxy server URL
//             // var postUrl = 'http://retail-services.cegid.cloud/t/pos/external-basket/v1'
//             xhr.open('POST', postUrl, true);
//             xhr.setRequestHeader('Content-Type', 'application/json');
//             xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken); // Include access token in the request headers

//             xhr.onreadystatechange = function() {
//                 if (xhr.readyState === 4) {
//                     if (xhr.status === 200) {
//                         console.log('POST request successful');
//                         var response = JSON.parse(xhr.responseText);
//                         if (response.externalBasketUrl) {
//                             window.location.href = response.externalBasketUrl;
//                         }
//                     } else {
//                         console.error('Error:', xhr.status);
//                         // Handle error if needed
//                     }
//                 }
//             };

//             var customerId = "HAM0100009";
//             var postData = {
//                 "externalReference": "SimpleSale",
//                 "basketType": "RECEIPT",
//                 "customer": {
//                     "customerCode": customerId // Change the value dynamically here
//                 },
//                 "itemLines": [
//                     {
//                         "itemLineId": 1,
//                         "item": {
//                             "itemCode": item
//                         },
//                         "quantity": 1,
//                         "price": {
//                             "basePrice": value,
//                             "currentPrice": value
//                         },
//                         "lineAmount": {
//                             "currency": "EUR",
//                             "value": value
//                         },
//                         "inventoryOrigin": {
//                             "warehouseId": "FR0041"
//                         }
//                     }
//                 ],
//                 "store": {
//                     "storeId": "FR004"
//                 }
//             };

//             // Convert postData to JSON string
//             var postDataString = JSON.stringify(postData);
//             console.log(postDataString);
//             xhr.send(postDataString);
//         }
//     });
// });


