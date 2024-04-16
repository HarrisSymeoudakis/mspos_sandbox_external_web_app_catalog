window.onload = function() {
    localStorage.setItem('cartItems', "");
    updateRemoveButtons();
};

let itemLineIdCounter = 1; // Initialize item line ID counter
let finalItems="";

var addToCartButtonElements = document.querySelectorAll('.addToCartButton');

addToCartButtonElements.forEach(function(button) {
    button.addEventListener('click', function(event) {
        const itemCode = event.target.getAttribute('item'); 
        const basePrice = parseFloat(event.target.getAttribute('item-value')); 
        addToCart(itemCode,basePrice);
    });
});


function addToCart(itemCode, basePrice) {

    const existingItems = localStorage.getItem('cartItems'); 
    const cartItems = existingItems ? JSON.parse(existingItems) : [];
    const existingItemIndex = cartItems.findIndex(item => item.item.itemCode === itemCode);
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity++;
    } else {
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
        
        cartItems.push(cartItem);
    }
    console.log(cartItems);
    updateRemoveButtons();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


var removeFromCartButtonElements = document.querySelectorAll('.removeFromBasket');

removeFromCartButtonElements.forEach(function(button) {
    button.addEventListener('click', function(event) {
        const itemCode = event.target.getAttribute('item'); // Get item code from button attribute
        const basePrice = parseFloat(event.target.getAttribute('item-value')); // Get base price from button attribute
        
        removeFromCart(itemCode, basePrice);
        updateRemoveButtons(); // Update the state of remove buttons after removing an item
    });
});

function removeFromCart(itemCode, basePrice) {
    const existingItems = localStorage.getItem('cartItems');
    const cartItems = existingItems ? JSON.parse(existingItems) : [];
    const existingItemIndex = cartItems.findIndex(item => item.item.itemCode === itemCode);
    
    // If the item exists in the cart and its quantity is greater than 0, decrease the quantity by 1
    if (existingItemIndex !== -1) {
        if (cartItems[existingItemIndex].quantity > 0) {
            cartItems[existingItemIndex].quantity--;
        }

        // If the quantity becomes 0, remove the item from the cart
        if (cartItems[existingItemIndex].quantity === 0) {
            cartItems.splice(existingItemIndex, 1);
        }

        // Update localStorage with the updated cart items
        console.log(cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}

function updateRemoveButtons() {
    console.log("eimai sto update");
    // const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // const removeButtons = document.querySelectorAll('.removeFromBasket');

    // removeButtons.forEach(button => {
    //     const itemCode = button.getAttribute('item');
    //     const itemExists = cartItems.some(item => item.item.itemCode === itemCode);
    //     button.disabled = !itemExists;
    // });
}



// Fust buy
var postButtonDemoElements = document.querySelectorAll('.postButtonDemo');

postButtonDemoElements.forEach(function(button) {
    button.addEventListener('click', function(event) {
        var urlStart = 'https://retail-services.cegid.cloud/t/pos/additem/';
        var item = button.getAttribute('item');
        var newUrl = urlStart + item + '/1';
        window.location.href = newUrl;
    });
});

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

