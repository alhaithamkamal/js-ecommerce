$(function(){
    const products_wrap = document.getElementById('products-wrap');
    const q = document.getElementById('q');
    const params = {  
        page : 1,
        limit : 12
    };
    let total_pages;
    let start =0;
    fetchProducts();
    function fetchProducts(){
        $.ajax({
            url: "https://afternoon-falls-30227.herokuapp.com/api/v1/products",
            type: "GET",
            data: params,
            success: function(res){
                res.page = params.page;
                res.total_pages = parseInt(res.total_items/params.limit);
                total_pages = res.total_pages;
                let products = res.data;
                $(".product-pages").html("<p>Pages "+res.page+" of "+res.total_pages+"</p>");

                 for(let i = (parseInt((res.total_pages)/2)+start);i>start;i--)
                {
                    $("#back").after("<li id=btn"+i+"><a>"+i+"</a></li>");
                    $("#btn"+i).on("click",function(){
                        if($("#back").next().attr('id') === "btn"+i+"" && i != 1 ){
                            removePagination(start,total_pages);
                            start--;
                        }
                        else if($("#next").prev().attr('id') === "btn"+i+"" && i != total_pages){
                            removePagination(start,total_pages);
                            start++;
                        }else{
                            removePagination(start,total_pages);

                        }
                        params.page=i;
                        fetchProducts();
                
                    });
                
                }  
                
                $(products_wrap).empty();
                products.forEach(product => {
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
                                <div class="desc">
                                    <p>${product.Description}</p>
                                </div>
                                <div class="actions">
                                    <a href="#" class="add-to-cart"><i class="ti-shopping-cart"></i><span>ADD TO CART</span></a>
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

                $("#btn"+res.page+"").addClass("active");
                $('.cat').click(event => {
                    event.preventDefault()
                    fetch_products_by_category(event.target.text)
                })
                
                $(".add-to-cart").click(function(event){
                    toastr.success('this product added successfully', 'Success Alert', {timeOut: 5000});
                        addToCart(event);
                });
                
                updateMiniCart();
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
   
    $("#back").on("click",function(){
        if(params.page > 1){
            if($("#back").next().attr('id') === "btn"+params.page+"" && params.page != 1 ){
                removePagination(start,total_pages);
                start--;
            }
            else{
                removePagination(start,total_pages);

            }
            params.page--;
            fetchProducts();
        }else{
            toastr.info('It is the first page.', 'Info', {timeOut: 2000})
        }
    });
    $("#next").on("click",function(){
        if(params.page < total_pages){
            if($("#next").prev().attr('id') === "btn"+params.page+"" && params.page != total_pages){
                removePagination(start,total_pages);
                start++;
            }else{
                removePagination(start,total_pages);

            }
            params.page++;
            fetchProducts();
        }else{
            toastr.info('It is the last page.', 'Info', {timeOut: 2000})
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
    function removePagination(start,end){
        for(let j= (parseInt(end/2)+start);j>start;j--)
        {
            $("#btn"+j+"").remove();
           
        }

    }
});
