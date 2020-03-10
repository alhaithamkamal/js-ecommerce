
$(function(){ 
 
    var page = 1,
        limit = 8,
        total_items = 0,
        pages=0
        ;

  
    
     $("select.nice-select").change(function(){
        limit = $(this).children("option:selected").val();
         for(let j= parseInt((pages+page)/2);j>=page;j--)
                {
                    $("#"+j+"").remove();
                   
                } 
        fetchData();
    });

   
    const products_wrap = document.getElementById('products-wrap');
    fetchData();

    $("#back").on("click",function(){
        if(page > 1){
             for(let j= parseInt((pages+page)/2);j>=page;j--)
                {
                    $("#"+j+"").remove();
                   
                } 
            page--;
            console.log("page ",page);
            fetchData();

        }
    });
    $("#next").on("click",function(){
        if(page * limit < total_items){
             for(let j= parseInt((pages+page)/2);j>=page;j--)
                {
                    $("#"+j+"").remove();
                   
                } 
            page++;
            console.log("page ",page);
            fetchData();
        }
    });



    function fetchData(){
        $.ajax({
        url: "https://afternoon-falls-30227.herokuapp.com/api/v1/products/",
        type: "GET",
        data: {
            page: page,
            limit:limit
        },
        success: function(data){
        console.log("data",data.limit);
        let products = data.data;
        total_items = data.total_items;
        pages = data.total_pages;
        console.log("products :",products);


        $(".product-pages").html("<p>Pages "+page+" of "+pages+"</p>");

        for(let i = parseInt((pages+page)/2);i>=page;i--)
        {
            $("#back").after("<li  id="+i+"><a >"+i+"</a></li>");
           
        } 
        for(let i = pages;i>0;i--)
        {
             $("#"+i+"").on("click",function(){
                 for(let j= parseInt((pages+page)/2);j>=page;j--)
                {
                    $("#"+j+"").remove();
                   
                } 
                page=i;
               
               fetchData();
                console.log("page ",page);
        
            });
        }
        $("#"+page+"").addClass("active");
        $(products_wrap).empty();
        products.forEach(product => {
            //console.log(product);
            $(products_wrap).append(`<div class="col-xl-3 col-lg-4 col-md-6 col-12 pb-30 pt-10">
            <!-- Product Start -->
            <div class="ee-product">
                <!-- Image -->
                <div class="image">
                    <a href="single-product.html?id=${product.ProductId}" class="img"><img src="${product.ProductPicUrl}" alt="Product Image"></a>
                    
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
                        
                    </div>
                </div>
            </div><!-- Product End -->
            <!-- Product List Start -->
            <div class="ee-product-list">
                <!-- Image -->
                <div class="image">
                    <a href="single-product.html?id=${product.ProductId}" class="img"><img src="${product.ProductPicUrl}" alt="Product Image"></a>
                </div>
                <!-- Content -->
                <div class="content">
                    <!-- Category & Title -->
                    <div class="head-content">
                        <div class="category-title">
                            <a href="#" class="cat">${product.Category}</a>
                            <h5 class="title"><a href="single-product.html?id=${product.ProductId}">${product.Name}</a></h5>
                        </div>
                        <h5 class="price">$${product.Price}</h5>
                    </div>
                    <div class="left-content">
                        <div class="ratting">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star-half-o"></i>
                            <i class="fa fa-star-o"></i>
                        </div>
                        <div class="desc">
                            <p>${product.Description}</p>
                        </div>
                        <div class="actions">
                            <a href="#" class="add-to-cart"><i class="ti-shopping-cart"></i><span>ADD TO CART</span></a>
                            <div class="wishlist-compare">
                                <a href="#" data-tooltip="Compare"><i class="ti-control-shuffle"></i></a>
                                <a href="#" data-tooltip="Wishlist"><i class="ti-heart"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="specification">
                            <h5>Specifications</h5>
                            <ul>
                                <li>Width: ${product.Width}${product.DimUnit}</li>
                                <li>Depth: ${product.Depth}${product.DimUnit}</li>
                                <li>Height: ${product.Height}${product.DimUnit}</li>
                                <li>Weight: ${product.WeightMeasure}${product.WeightUnit}</li>
                            </ul>
                        </div>
                        <span class="availability">Availability: <span></span>${product.Status} ${product.Quantity} In Stock</span>
                    </div>
                </div>
            </div><!-- Product List End -->
        </div>`)
        $('.cat').click(event => {
            event.preventDefault()
            fetch_products_by_category(product.Category)
        })   
        });
        $(".add-to-cart").click(function(){
            toastr.success('We do have the Kapua suite available.', 'Success Alert', {timeOut: 5000})
         });
        },
        error: function(jqXHR,textStatus,errorThrown){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }

    });
    
    }
    

});
function fetch_products_by_category(category) {
    fetchProducts(`https://afternoon-falls-30227.herokuapp.com/api/v1/products?category=${category}`);
}