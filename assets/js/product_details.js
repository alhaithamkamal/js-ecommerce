
$(function(){ 
 
     
    const product = $(".container");

    var urlParams = new URLSearchParams(location.search);

    let id=urlParams.get('id');    
    console.log(id);
    fetchData();
    function fetchData(){
        $.ajax({
        url: `https://afternoon-falls-30227.herokuapp.com/api/v1/products/${id}`,
        type: "GET",
        success: function(data){
        let product_details = data.data;

        console.log("details :",product_details);

        
        $("#product_details").append(`<div class="row mb-90" id="content">
                    
            <div class="col-lg-6 col-12 mb-50">

                <!-- Image -->
                <div class="single-product-image">

                    <div class="tab-content" style="padding-left: 30px;">
                        <div id="single-image-1" class="tab-pane fade show active big-image-slider">
                            <div class="big-image"><img src="${product_details.ProductPicUrl}"  alt="Big Image"><a href="${product_details.ProductPicUrl}"></a></div>
                            
                        </div>
                    
                    </div>
                    
                   

                </div>

            </div>
                    
            <div class="col-lg-6 col-12 mb-50" >

                <!-- Content -->
                <div class="single-product-content">

                    <!-- Category & Title -->
                    <div class="head-content">

                        <div class="category-title">
                            <a href="#" class="cat">${product_details.Category}</a>
                            <h2 class="title">${product_details.Name}</h2>
                        </div>

                        <h5 class="price">${product_details.CurrencyCode} ${product_details.Price}</h5>

                    </div>

                    <div class="single-product-description">

                       <br>

                        <div class="desc">
                            <p>${product_details.Description}</p>
                        </div>
                         <div class="right-content">
                                <div class="specification">
                                    <h3>Specifications</h3>
                                    <ul style="padding-left: 30px;">
                                        <li>Width: ${product_details.Width}${product_details.DimUnit}</li>
                                        <li>Depth: ${product_details.Depth}${product_details.DimUnit}</li>
                                        <li>Height: ${product_details.Height}${product_details.DimUnit}</li>
                                        <li>Weight: ${product_details.WeightMeasure}${product_details.WeightUnit}</li>
                                    </ul>
                                </div>
                                <span class="availability"> ${product_details.Status} : <span class="details_quantity">${product_details.Quantity}</span> 
                                <span class="stock">In Stock</span> </span>
                            </div>
                        
                        
                        <div class="quantity-colors">
                            
                            <div class="quantity">
                                <h5>Quantity</h5>
                                
                                <div class="pro-qty">
                                    <input type="text" value="1">
                                </div>

                            </div>                            
                            
                                                     
                            
                        </div> 

                        <div class="actions">

                            <a href="#" class="add-to-cart" style="background:#fefcef;"><i class="ti-shopping-cart"></i><span>ADD TO CART</span></a>

                            

                        </div>
                   
                        

                    </div>

                </div>

            </div>
            
        </div>`)
        let qty =-1;
        availableQuantity(product_details.ProductId).then((result) => {
        if(result){
            qty=result.Quantity;
            if(qty == 0){
                 $(".details_quantity").html("");
                $(".stock").html("<span>Out of Stock</span>");
                $(".quantity-colors").hide();
                $(".actions").hide();
            }else{
                $(".details_quantity").html(result.Quantity);
            }
        }
        });

        
        $('.pro-qty').prepend('<span class="dec qtybtn">-</span>');
        $('.pro-qty').append('<span class="inc qtybtn">+</span>');
        $('.qtybtn').on('click', function() {
            var $button = $(this);
            var oldValue = $button.parent().find('input').val();
            if ($button.hasClass('inc')) {
              var newVal = parseFloat(oldValue) + 1;
            } else {
               // Don't allow decrementing below zero
              if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
                } else {
                newVal = 0;
              }
              }

            $button.parent().find('input').val(newVal);
        });  

        $('.add-to-cart').on("click",function(){
            let quantity =$(".pro-qty").find('input').val();
            if(qty != -1){
                data.data.Quantity=qty;
            }
            data.data.Quantity=data.data.Quantity-quantity;
            
            const params = {
                quantity:quantity,
                data:data
            }
            if(data.data.Quantity >= 0){
                addToCartProduct(params);
                toastr.success('this product added successfully', 'Success Alert', {timeOut: 5000});

            }
            else{
                data.data.Quantity=data.data.Quantity+parseInt(quantity);
                console.log(data.data.Quantity);
                toastr.error('your order of product is greater than its quantity  ', 'Error Alert', {timeOut: 5000});
            }
           
            
            if(data.data.Quantity > 0){
                $(".details_quantity").html(data.data.Quantity);
                $(".stock").html("<span>In Stock</span>");
            }
            else{
                $(".details_quantity").html("");
                $(".stock").html("<span>Out of Stock</span>");
                $(".quantity-colors").hide();
                $(".actions").hide();
            }
            $(".pro-qty").find('input').val("1");
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