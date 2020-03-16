const DB_NAME = 'MyDB';
const DB_V = 1;
var dbase;
const checkout = document.getElementById('checkout');
const url = window.location.href.split('/')
const page = url[url.length - 1]

if ('indexedDB' in window) {
  openDB();
}
function openDB(){
  const dbReq = indexedDB.open(DB_NAME, DB_V);
  
  dbReq.onerror = (ev) => {
      console.error('onerror', ev.target.errorCode);
  };

  dbReq.onupgradeneeded = (ev) => {
      const dbase = ev.target.result;
      if (!dbase.objectStoreNames.contains('products')) {
        var objectStore = dbase.createObjectStore("products", {keyPath: "proId"});
        objectStore.createIndex("Name", "Name", { unique: true });
        objectStore.createIndex("Price", "Price", { unique: false });
        objectStore.createIndex("ProductPicUrl", "ProductPicUrl", { unique: false });
        objectStore.createIndex("Category", "Category", { unique: false });
        objectStore.createIndex("Quantity", "Quantity", { unique: false });
        objectStore.createIndex("QOrdered", "QOrdered", { unique: false });
        objectStore.createIndex("OrderDate" , "OrderDate" , {unique : false});
      }
      if (!dbase.objectStoreNames.contains('orders')) {
        orderStore = dbase.createObjectStore('orders', { keyPath: 'num', autoIncrement: true });
    }
  }

  dbReq.onsuccess = (ev) => {
    dbase = ev.target.result;
    displayAll();
  }
}
function save_order(totalPrice) {
  if (dbase instanceof IDBDatabase) {
      const tx = dbase.transaction('orders', 'readwrite');
      const orderStore = tx.objectStore('orders');
      orderStore.add({
          total_price: totalPrice,
          date: new Date(),
      });
  }
}
if(page.match('^cart.html')){
  document.getElementById('cart-checkout').onclick = (e) => {
    e.preventDefault();
    toastr.success('Successfully Checked Out', 'Success Alert', {timeOut: 5000});
    let total_price = 0
    var objectStore = dbase.transaction("products","readwrite").objectStore("products");
    objectStore.getAll().onsuccess = function(event){
      for(let i=0;j=event.target.result.length,i<j;i++){
        let price = event.target.result[i].Price
        let quantity = event.target.result[i].QOrdered
        total_price += (price * quantity)
      }
      save_order(total_price)
    }
  }
}
checkout.onclick = (e) => { 
  e.preventDefault(); 
  toastr.success('Successfully Checked Out', 'Success Alert', {timeOut: 5000});
  let total_price = 0
  var objectStore = dbase.transaction("products","readwrite").objectStore("products");
  objectStore.getAll().onsuccess = function(event){
    for(let i=0;j=event.target.result.length,i<j;i++){
      let price = event.target.result[i].Price
      let quantity = event.target.result[i].QOrdered
      total_price += (price * quantity)
    }
    save_order(total_price)
  }
  
}

function displayAll(){  
  if (dbase instanceof IDBDatabase) {
  let total_price = 0
  var objectStore = dbase.transaction("products","readwrite").objectStore("products");
  objectStore.getAll().onsuccess = function(event){
  const pro = document.getElementsByTagName('tbody');
  const mini = document.getElementsByClassName('mini-cart-products');
    for(let i=0;j=event.target.result.length,i<j;i++){
      let price = event.target.result[i].Price
      let quantity = event.target.result[i].QOrdered
      total_price += (price * quantity)
      if(page.match('^cart.html')){
        $(pro).append(`
          <tr class = "cart-row ${i}">
          <td class="pro-thumbnail">
          <a href="${event.target.result[i].proId}" class = "img"><img src="${event.target.result[i].ProductPicUrl}" alt="Product"></a></td>
          <td class="pro-title"><a href="#">${event.target.result[i].Name}</a></td>
          <td class="pro-price"><span>${event.target.result[i].Price}</span></td>
          <td class="pro-quantity"><input class = "quan" type="number" id="${i}" name="quantity"  value = "${event.target.result[i].QOrdered}" min="1" max="${event.target.result[i].Quantity}" onclick="quantityChanged(${event.target.result[i].Quantity},${i});"></td>
          <td class="pro-subtotal" id=${i}><span class="sub-Total">${event.target.result[i].Price}</span></td>
          <td class="pro-remove"><a href="#" onclick="removeCartItem();"><i class="fa fa-trash-o"></i></a></td>
          </tr>
        `);
      }
      $(mini).append(`
          <li class = "cart ${i}">
            <a href="single-product.html?id=${event.target.result[i].proId}" class="image"><img src="${event.target.result[i].ProductPicUrl}" alt="Product"></a>
            <div class="content" id = ${i}>
                <a href="single-product.html?id=${event.target.result[i].proId}" class="title">${event.target.result[i].Name}</a>
                <span class="price">Price: ${event.target.result[i].Price}</span>
                <span class="qty">Qty: ${event.target.result[i].QOrdered}</span>
            </div>
          <a href="#" onclick="removeMiniCart(${i});"><i class="fa fa-trash-o"></i></a>
        </li>
        `);
    }
  }
  }
  if(page.match('^cart.html')){
  updateCartTotal();}
  updateMiniCart();
}

function availableQuantity(proID){

  if (dbase instanceof IDBDatabase) {
    var Products = dbase.transaction("products", "readwrite").objectStore("products");
    var objectStore = Products.get(proID);
   return new Promise(function(resolve, reject) {
      objectStore.onsuccess = function() { resolve(objectStore.result); };
      objectStore.onerror = function() { reject(objectStore.error); };
    });         
        
  }
}
function addToCartProduct(params){
    
    const products = params.data.data;
    const proId = products.ProductId;
    const title = products.Name;
    const price = products.Price;
    const imageSrc = products.ProductPicUrl;
    const cat = products.Category;
    const quantity = products.Quantity;
    const iniQuantity = params.quantity;
    const Odate = new Date();
    console.log(proId , title , price , imageSrc , cat , quantity , iniQuantity);
    if (dbase instanceof IDBDatabase) {        
        var Products = dbase.transaction("products", "readwrite").objectStore("products");
        var objectStore = Products.get(proId);
        console.log(objectStore)
        objectStore.onsuccess= function(event) {
          if(event.target.result){
            var db = event.target.result;
            console.log("db ",db);
            console.log("shaklo msh shayfni hena wla a ",parseInt(objectStore.result.QOrdered)+parseInt(iniQuantity));
            let qty =parseInt(objectStore.result.QOrdered)+parseInt(iniQuantity);
            Products.put({ proId : proId , Name : title , Price : price , ProductPicUrl : imageSrc , Category : cat , Quantity : quantity , QOrdered : qty , OrderDate : Odate});
          }
          else{
            Products.add({ proId : proId , Name : title , Price : price , ProductPicUrl : imageSrc , Category : cat , Quantity : quantity , QOrdered : iniQuantity , OrderDate : Odate});
          }
        }
        Products.getAll().onsuccess = function(event){
      const mini = document.getElementsByClassName('mini-cart-products');
      const i=event.target.result.length;
      console.log(i);
      $(mini).append(`
          <li class = "cart ${i}">
            <a href="${products.proId}" class="image"><img src="${products.ProductPicUrl}"></a>
            <div class="content" id = ${i}>
                <a href="single-product.html" class="title">${products.Name}</a>
                <span class="price">Price: ${products.Price}</span>
                <span class="qty">Qty: ${iniQuantity}</span>
            </div>
          <a href="#" onclick="removeMiniCart(${i});"><i class="fa fa-trash-o"></i></a>
        </li>
        `);
      }
      
        objectStore.onerror =function(event){
          console.log(event);
        }
        updateMiniCart();
    }
}

function addToCart(event){
 var buttonClicked = event.target;
 var shopItem = buttonClicked.parentElement.parentElement.parentElement;
 var producId = shopItem.getElementsByClassName('img')[0].href;
 var proId = producId.split('=');
 let url = "https://afternoon-falls-30227.herokuapp.com/api/v1/products/"+proId[1];
 fetch(url)
    .then(response=>{
        return response.json();
    })
    .then(response => {
      const products = response.data;
      const proId = products.ProductId;
      const title = products.Name;
      const price = products.Price;
      const imageSrc = products.ProductPicUrl;
      const cat = products.Category;
      const quantity = products.Quantity;
      const iniQuantity = 1;
      const Odate = new Date();
      console.log(proId , title , price , imageSrc , cat , quantity , iniQuantity);
      if (dbase instanceof IDBDatabase) {        
      var Products = dbase.transaction("products", "readwrite").objectStore("products");
      Products.add({ proId : proId , Name : title , Price : price , ProductPicUrl : imageSrc , Category : cat , Quantity : quantity , QOrdered : iniQuantity , OrderDate : Odate});
      Products.getAll().onsuccess = function(event){
      const mini = document.getElementsByClassName('mini-cart-products');
      const i=event.target.result.length;
      console.log();
      $(mini).append(`
          <li class = "cart ${i}">
            <a href="${products.proId}" class="image"><img src="${products.ProductPicUrl}"></a>
            <div class="content" id = ${i}>
                <a href="single-product.html" class="title">${products.Name}</a>
                <span class="price">Price: ${products.Price}</span>
                <span class="qty">Qty: ${iniQuantity}</span>
            </div>
          <a href="#" onclick="removeMiniCart(${i});"><i class="fa fa-trash-o"></i></a>
        </li>
        `);
      }}
      updateMiniCart();
      if(page.match('^cart.html')){ 
      updateCartTotal();}
    });
    
}

function quantityChanged(max,id){
  const cartItemContainer = document.getElementsByClassName('table')[0];
  const cartRows = cartItemContainer.getElementsByClassName('cart-row '+id)[0];
  const input = cartRows.getElementsByClassName('quan')[0].value;
  const item = cartRows.getElementsByClassName("img")[0].href;
  var proId = item.split('/');
  console.log(cartRows , proId[8]);
  if (dbase instanceof IDBDatabase) {
      var objectStore = dbase.transaction("products", "readwrite").objectStore("products");
      var TitleRequest = objectStore.get(proId[proId.length -1]);
      TitleRequest.onsuccess = function() {
        var data = TitleRequest.result;
        data.QOrdered = input;
        var updateTitleRequest = objectStore.put(data);
        if(page.match('^cart.html')) updateCartTotal();
    }
  }

  
}

function removeMiniCart(id){
  var buttonClicked = event.target;
  const item = buttonClicked.parentElement.parentElement;
  const mcart = document.getElementsByClassName('cart '+id)[0];
  const title = mcart.getElementsByClassName('image')[0].href;
  var proId = title.split('/');
  console.log(proId[proId.length-1]);
  console.log(item);
  console.log(mcart);
  mcart.remove();
  if(page.match('^cart.html')){
  const cartItem = document.getElementsByClassName('cart-row')[0];
  cartItem.remove();
  }
  if (dbase instanceof IDBDatabase) {
  const remItem = dbase.transaction("products", "readwrite").objectStore("products").delete(proId[proId.length -1]);
  remItem.onsuccess=function(event){
      console.log("done");
      if(page.match('^cart.html')) {
      updateCartTotal();}
      updateMiniCart();
  }
}
}

function removeCartItem(){
	var buttonClicked = event.target;
  const item = buttonClicked.parentElement.parentElement.parentElement;
  const mcart = document.getElementsByClassName('cart')[0];
  mcart.remove();
  const title = item.getElementsByClassName('img')[0].href;
  var proId = title.split('/');
  console.log(proId[proId.length -1]);
  item.remove();
  if (dbase instanceof IDBDatabase) {
  const remItem = dbase.transaction("products", "readwrite").objectStore("products").delete(proId[proId.length -1]);
  remItem.onsuccess=function(event){
      console.log("done");
      if(page.match('^cart.html')) {
      updateCartTotal();
  }
  }
}
updateMiniCart();
}

function updateMiniCart(){
  var cartItemContainer = document.getElementsByClassName('mini-cart-products')[0];
  var cartRows = cartItemContainer.getElementsByClassName('content');
  // console.log(cartRows);
  if (dbase instanceof IDBDatabase) {
    var objectStore = dbase.transaction("products","readwrite").objectStore("products");
    objectStore.getAll().onsuccess = function(event){
      const length =event.target.result.length; 
      // console.log(length);
      var TotalQuantity=0;
      var Total =0;
      for(var i=0;i<length;i++){
        var cartRow =cartRows[i];
        // console.log(cartRow);
        var priceElement = cartRow.getElementsByClassName('price')[0];
        // console.log(priceElement);
        var quantityElement = cartRow.getElementsByClassName('qty')[0];
        var price = parseFloat(priceElement.innerText.replace('Price:' , ''));
	cartRow.getElementsByClassName('qty')[0].innerText = event.target.result[i].QOrdered;
        var quantity = parseInt(quantityElement.innerText.replace('Qty:' , ''));
        Total = Total + (price * quantity);
        TotalQuantity = TotalQuantity + parseInt(quantity);
        // console.log(quantityElement);
      }
    document.getElementsByClassName('cart-number')[0].innerText = TotalQuantity;
    document.getElementsByClassName('miniTotal')[0].innerText = '$' + Total;
    }
  }
}

function updateCartTotal(){
  var cartItemContainer = document.getElementsByClassName('table')[0];
  var cartRows = cartItemContainer.getElementsByClassName('cart-row');
  if (dbase instanceof IDBDatabase) {
    var objectStore = dbase.transaction("products","readwrite").objectStore("products");
    objectStore.getAll().onsuccess = function(event){
      const length =event.target.result.length; 
      var Total =0;
      var TotalQuantity=0;
      for(var i=0;i<length;i++){
        var cartRow =cartRows[i];
        var priceElement = cartRow.getElementsByClassName('pro-price')[0];
        var quantityElement = cartRow.getElementsByClassName('quan')[0].value;
        var price = parseFloat(priceElement.innerText.replace('$' , ''));
        // cartRow.getElementById(i)[0].innerText = '$' + (price*quantity);
        var quantity = quantityElement;
        Total = Total + (price * quantity);
        TotalQuantity = TotalQuantity + parseInt(quantity);
        cartRow.getElementsByClassName('sub-Total')[0].innerText = '$' + (price * quantity);
        console.log(Total);
        console.log(TotalQuantity);
      }
      document.getElementsByClassName('cart-number')[0].innerText = TotalQuantity;
      document.getElementsByClassName('cart-total')[0].innerText = '$' + Total;
    }
  }
}
