
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

        
        $("#product_details").append(`<div class="row mb-90">
                    
            <div class="col-lg-6 col-12 mb-50">

                <!-- Image -->
                <div class="single-product-image thumb-right">

                    <div class="tab-content">
                        <div id="single-image-1" class="tab-pane fade show active big-image-slider">
                            <div class="big-image"><img src="${product_details.ProductPicUrl}" alt="Big Image"><a href="${product_details.ProductPicUrl}"></a></div>
                            
                        </div>
                    
                    </div>
                    
                   

                </div>

            </div>
                    
            <div class="col-lg-6 col-12 mb-50">

                <!-- Content -->
                <div class="single-product-content">

                    <!-- Category & Title -->
                    <div class="head-content">

                        <div class="category-title">
                            <a href="#" class="cat">${product_details.Category}</a>
                            <h5 class="title">${product_details.Name}</h5>
                        </div>

                        <h5 class="price">${product_details.CurrencyCode} ${product_details.Price}</h5>

                    </div>

                    <div class="single-product-description">

                       <br>

                        <div class="desc">
                            <p>${product_details.Description}</p>
                        </div>
                        
                        <span class="availability">Availability:
                           
                       
                         </span>
                        
                        <div class="quantity-colors">
                            
                            <div class="quantity">
                                <h5>Quantity</h5>
                                
                                <div class="pro-qty">
                                    <input type="text" value="1">
                                </div>

                            </div>                            
                            
                                                     
                            
                        </div> 

                        <div class="actions">

                            <a href="#" class="add-to-cart"><i class="ti-shopping-cart"></i><span>ADD TO CART</span></a>

                            

                        </div>
                        
                       <!--  <div class="tags">
                            
                            <h5>Tags:</h5>
                            <a href="#">Electronic</a>
                            <a href="#">Smartphone</a>
                            <a href="#">Phone</a>
                            <a href="#">Charger</a>
                            <a href="#">Powerbank</a>
                            
                        </div> -->
                        
                        

                    </div>

                </div>

            </div>
            
        </div>`)
        if(product_details.Status === "Available")
            $(".availability").append("<span>In Stock</span>");
        else
             $(".availability").append("<span>Out of Stock</span>");
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
            
        },
        error: function(jqXHR,textStatus,errorThrown){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }

    });
    
    }



// DatabaseName = "cart"
// version = 1

// $(".add-to-cart").addEventListener("click",function(){
//   let title = document.getElementById("bookTitle").value ;
//   let SSN = document.getElementById("bookSn").value;
//   let year = document.getElementById("bookYear").value;
//   if(title && SSN && year){
//     var request = window.indexedDB.open(DatabaseName);
//     request.onsuccess = function(event){
//              db = event.target.result;
//             console.log("onsuccess ",db);
//             var bookObjectStore = db.transaction("book", "readwrite").objectStore("book");
            
//                 bookObjectStore.add( { title: title, SSN: SSN , year: year });
                
//       };
//     request.onupgradeneeded = function(event){
//         var db = event.target.result;

//          var objectStore = db.createObjectStore("book", { autoIncrement :true, keyPath: "ID" });
//          objectStore.createIndex("SSN", "SSN", { unique: true });
        

//          console.log("hello");

//  };
//       request.onerror =function(event){
//         console.log("Why didn't you allow my web app to use IndexedDB?!");
//       };

    

//   }
 
// });
});