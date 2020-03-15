$(function(){
    const products_wrap = document.getElementById('products-wrap');
    const q = document.getElementById('q');
    const params = {  
        page : 1,
        limit : $("#limit-select option:selected").val()
    };
    let total_pages;
    fetchProducts();
    function fetchProducts(){
        $.ajax({
            url: "https://afternoon-falls-30227.herokuapp.com/api/v1/products",
            data: params,
            success: function(res){
                res.page = params.page;
                res.total_items = parseInt(res.total_items/params.limit);
                total_pages = res.total_pages;
                console.log(res)
                let products = res.data;
                $(".product-pages").html("<p>Pages "+res.page+" of "+res.total_pages+"</p>");
              

                for(let i = parseInt((res.total_pages)/3);i>0;i--)
                {
                    $("#back").after("<li  id="+i+"><a >"+i+"</a></li>");
                    $("#"+i+"").on("click",function(){
                        if($("#back").next().attr('id') == i)
                            console.log("loglog")
                        for(let j = parseInt((res.total_pages)/3);j>0;j--)
                        {
                            $("#"+j+"").remove();
                        
                        } 
                        params.page=i;
                        fetchProducts();
                        console.log("page ",params.page);
                
                    });
                
                } 
               
                $("#"+res.page+"").addClass("active");
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
                });
                $('.cat').click(event => {
                    event.preventDefault()
                    fetch_products_by_category(event.target.text)
                })
                
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
    $('#btn').click(event => {
        event.preventDefault()
        let cat = $("select#cat-select").children("option:selected").val()
        if (cat == 'All Categories')
            fetch_products_by_search(q.value)
        else
            fetch_products_by_search_and_category(cat, q.value)
    })
    $("select#limit-select").change(function(){
        params.limit = $(this).children("option:selected").val();
        // limit = $(this).children("option:selected").val();
        //  for(let j= parseInt((pages+page)/2);j>=page;j--)
        //         {
        //             $("#"+j+"").remove();
                   
        //         }
        fetchProducts();
    });
    $("#back").on("click",function(){
        if(params.page > 1){
            for(let j= parseInt(total_pages/3);j>0;j--)
                {
                    $("#"+j+"").remove();
                   
                }
            params.page--;
            fetchProducts();
        }
    });
    $("#next").on("click",function(){
        if(params.page < total_pages){
            for(let j= parseInt(total_pages/3);j>0;j--)
                {
                    $("#"+j+"").remove();
                   
                } 
            params.page++;
            fetchProducts();
        }
    });
    
    function fetch_products_by_category(category) {
        params.category = category;
        fetchProducts();
    }
    function fetch_products_by_search(q){
        if (params.page) delete params.page;
        if (params.category) delete params.category;
        params.q = q;
        fetchProducts();
    }
    function fetch_products_by_search_and_category(category, q){
        if (params.page) delete params.page;
        params.category = category;
        params.q = q;
        fetchProducts();
    }
});