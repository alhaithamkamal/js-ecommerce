window.onload = fetchProducts("https://afternoon-falls-30227.herokuapp.com/api/v1/products/");
const products_wrap = document.getElementById('products-wrap');
function fetchProducts(url) {
    fetch(url)
    .then(response=>{
        return response.json();
    })
    .then(response => {
        let products = response.data
        $(products_wrap).empty();
        products.forEach(product => {
            //console.log(product);
            $(products_wrap).append(`<div class="col-xl-3 col-lg-4 col-md-6 col-12 pb-30 pt-10">
            <!-- Product Start -->
            <div class="ee-product">
                <!-- Image -->
                <div class="image">
                    <a href="single-product.html?id=${product.ProductId}" class="img"><img src="${product.ProductPicUrl}" alt="Product Image"></a>
                    <div class="wishlist-compare">
                        <a href="#" data-tooltip="Compare"><i class="ti-control-shuffle"></i></a>
                        <a href="#" data-tooltip="Wishlist"><i class="ti-heart"></i></a>
                    </div>
                    <a href="#" class="add-to-cart"><i class="ti-shopping-cart"></i><span>ADD TO CART</span></a>
                </div>
                <!-- Content -->
                <div class="content">
                    <!-- Category & Title -->
                    <div class="category-title">
                        <a href="#" class="cat">${product.Category}</a>
                        <h5 class="title"><a href="single-product.html?id=${product.ProductId}">${product.Name}</a></h5>
                    </div>
                    <!-- Price & Ratting -->
                    <div class="price-ratting">

                        <h5 class="price">$${product.Price}</h5>
                        <div class="ratting">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star-half-o"></i>
                            <i class="fa fa-star-o"></i>
                        </div>
                    </div>
                </div>
            </div><!-- Product End -->
        </div>`)
        });
    })
    .catch(err => {
        console.log(err);
    })
}