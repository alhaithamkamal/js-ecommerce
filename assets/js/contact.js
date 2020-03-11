let myForm=document.getElementById("myForm");
myForm.addEventListener('submit',function(e){
    e.preventDefault();
    let userName=document.getElementById('name').value; 
    let userEmail=document.getElementById('email').value;
    let userSubject=document.getElementById('subject').value;
    let userMessage=document.getElementById('message').value;
    let user_msg = document.querySelector("#user_msg");
    

    const url = "https://afternoon-falls-30227.herokuapp.com/api/v1/contact_us"; 
    fetch(url, {
        method : "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({name:userName,
                            email:userEmail,
                            subject:userSubject,
                            message:userMessage
                           })
    }).then(function(response){
        return response.text();

    }).then(function(text){
        console.log(text);
        
        res = JSON.parse(text);

        // console.log(res.message);
        
        
        user_msg.innerText = res.message;
        
        
    }).catch(function(error){
        console.error(error);
        
    })
});


