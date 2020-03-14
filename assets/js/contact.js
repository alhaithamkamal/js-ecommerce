let myForm=document.getElementById("myForm");
myForm.addEventListener('submit',function(e){
    e.preventDefault();
    if (validateForm()) {
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
            user_msg.innerText = res.error;
        })}
});


function printError(elemId, hintMsg) {
    document.getElementById(elemId).innerHTML = hintMsg;
}
function validateForm() {
    // Retrievin'g the values of form elements     
    var name = myForm.name.value;
    var email = myForm.email.value;
    var subject = myForm.subject.value;
    var message = myForm.message.value;
    

    
	// Defining error variables with a default value
    var err = false;
    
    // Validate name
    if(name == "") {
        printError("nameErr", "Please enter your name");
        err = true;
    } else {
        var regex = /^[a-zA-Z\s]+$/;                
        if(regex.test(name) === false) {
            printError("nameErr", "Please enter a valid name");
            err = true;
        }
    }
    
    // Validate email address
    if(email == "") {
        printError("emailErr", "Please enter your email address");
        err = true;
    } else {
        // Regular expression for basic email validation
        var regex = /^\S+@\S+\.\S+$/;
        if(regex.test(email) === false) {
            printError("emailErr", "Please enter a valid email address");
            err = true;
        }
    }
    if(subject == "") {
        printError("subjectErr", "Please enter the subject");
        err = true;
    }
    if(message == "") {
        printError("messageErr", "Please enter a message");
        err = true;
    }
    
    
    // Prevent the form from being submitted if there are any errors
    if(err == true) {
       return false;
    }
    return true;
};
