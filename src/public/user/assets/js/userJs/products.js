

const checkboxes = document.querySelectorAll('.checkBox-input');

const clearButton = document.getElementById('clearButton');

const productsRow = document.getElementById('products-row')

$('#filter-form').submit(function (e) {
    e.preventDefault()
    const min = document.getElementById('sliderValue1').value;
    const max = document.getElementById('sliderValue2').value;

    let selectedCategories = [];
    $('input:checked').each(function () {
        selectedCategories.push($(this).val())
    });

    console.log("selectedCategories ", selectedCategories);
    
    filterData(selectedCategories, min, max);
})


function filterData(selectedCategories, min, max) {
    
    let data = {
        selectedCategories: selectedCategories,
        min: min,
        max: max
    }
    console.log(" data ", data);
    data = JSON.stringify(data)
    let html = ``;

    $.ajax({
        url: '/viewProducts?filterData=' + data,
        type: 'get',

    })
        .done((res) => {
            let product = res.product;
            let loginStatus = res.loginStatus
            let cartCount = res.cartCount
            console.log("response ", res);
            

            for (let i = 0; i < product.length; i++) {
                if (product[i].product_status) {
                    html += `
                            <div class="col-6 col-md-4 col-lg-4 mb-2">
                                <div class="product product-7">
                                    <figure class="product-media">
                                        <a href="/quick-view/${product[i].slug}">
                                            <img src="/product-images/${product[i].image[0].filename}"
                                                alt="Product image" class="product-image">
                                            <img src="/product-images/${product[i].image[1].filename}"
                                                alt="Product image" class="product-image-hover">
                                        </a>
                                        <div class="product-action-vertical">
                                            <a href="#" data-value="${product[i]._id}"
                                                class="add-to-Wishlist btn-product-icon btn-wishlist btn-expandable">
                                                <span>add to wishlist</span>
                                            </a>
                                        </div><!-- End .product-action-vertical -->
                        `;
                    if (!product[i].isInCart) {
                        if (loginStatus) {
                            html += `

                                    <div class="product-action">
                                        <a href="#" data-value="${product[i]._id}"
                                            class="add-to-cart btn-product btn-cart">
                                            <span>add to cart</span>
                                        </a>
                                    </div><!-- End .product-action -->
                                `;

                        } else {
                            html += `
                                    <div class="product-action">
                                        <a href="/user-login" class="btn-product btn-cart">
                                            <span>add to cart</span>
                                        </a>
                                    </div><!-- End .product-action -->
                                `;
                        }
                    } else {
                        html += `
                                    <div class="product-action">
                                        <a href="/cart" class="view-cart-products btn-product btn">
                                            <span>View in cart</span>
                                        </a>
                                    </div><!-- End .product-action -->
                                `;
                    }

                    html += `
                                    </figure><!-- End .product-media -->

                                    <div class="product-body">
                                        <h3 class="product-title">
                                            <a href="product.html">${product[i].product_name}</a>
                                        </h3><!-- End .product-title -->
                                        <div class="product-price">${product[i].product_price}</div><!-- End .product-price -->
                                    </div><!-- End .product-body -->
                                </div><!-- End .product -->
                            </div><!-- End .col-sm-6 col-lg-4 -->
                        `;

                }

            }

            productsRow.innerHTML = html

        })
        .fail((error) => {
            console.error(error);
        })
}


checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {

        const checkboxeStates = Array.from(checkboxes).map(function (cb) {
            return {
                id: cb.id,
                checked: cb.checked
            }
        })
        localStorage.setItem('checkboxeStates', JSON.stringify(checkboxeStates))
    })
});

clearButton.addEventListener('click', function (e) {
    e.preventDefault();
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false
    })

    localStorage.removeItem('checkboxeStates')
})

// Restore the checkbox states when the page loads
window.addEventListener('load', function () {
    const savedStates = localStorage.getItem('checkboxeStates');
    const checkboxeStates = JSON.parse(savedStates);

    if (Array.isArray(checkboxeStates)) {
        checkboxeStates.forEach(function (state) {
            const checkbox = document.getElementById(state.id);
            if (checkbox) {
                checkbox.checked = state.checked
            }
        })
    }

})


document.addEventListener('DOMContentLoaded', function () {
    var rangeSlider = document.getElementById('rangeSlider');
    var sliderValue1 = document.getElementById('sliderValue1');
    var sliderValue2 = document.getElementById('sliderValue2');

    var fromSpan = document.getElementById('from-span');
    var toSpan = document.getElementById('to-span');

    noUiSlider.create(rangeSlider, {
        start: [0, 200000], // Initial range values
        connect: true, // Enable the range between the handles
        range: {
            'min': 0,
            'max': 200000
        }
    });

    rangeSlider.noUiSlider.on('update', function (values) {
        sliderValue1.value = Math.floor(values[0]);
        sliderValue2.value = Math.floor(values[1]);
        fromSpan.innerHTML = Number(Math.floor(values[0])).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
        toSpan.innerHTML = Number(Math.floor(values[1])).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
    });
});
