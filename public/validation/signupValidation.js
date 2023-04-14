const loginForm=document.getElementById("signup-form")
const userName=document.getElementById("name");
const email=document.getElementById("email");
const mobile=document.getElementById("phone")




const usernameRegex = /^[a-zA-Z0-9_]+$/;
const emailRegX = /^[A-Za-z\._\-[0-9][@][A-Za-z][\.][a-z]{2,4}$/;
const mobileRegex = /^\d{10}$/;
const passRegX = /^(?=.\d)(?=.[a-z])(?=.*[A-Z]).{6,20}$/;

loginForm.addEventListener('submit',(e)=>{
    if(userName.value==="" || userName.value===null){
        e.preventDefault();
        document.getElementById("nameError").classList.remove('d-none');
        document.getElementById("nameError").innerHTML="Name must be filled!"
    }else if(!userName.value.match(usernameRegex)){
        e.preventDefault();
        document.getElementById("nameError").classList.remove('d-none');
        document.getElementById("nameError").innerHTML="invalid name"
    }else if(userName.value.match(usernameRegex)){
        document.getElementById('nameError').innerHTML = "";
        document.getElementById('nameError').classList.add('d-none')
    }


    if(email.value==="" || email.value===null){
        e.preventDefault();
        document.getElementById("emailError").classList.remove('d-node');
        document.getElementById("emailError").innerHTML="Email must be filled!"
    }else if(email.value.match(emailRegX)){
        e.preventDefault();
        document.getElementById("emailError").classList.remove('d-none');
        document.getElementById("emailError").innerHTML="Invalid Email Address";
    }else if(email.value.match(emailRegX)){
        e.preventDefault();
        document.getElementById("emailError").classList.remove('d-none');
        document.getElementById("emailError").innerHTML=""
    }


    if(mobile.value==="" || mobile.value===null){
        e.preventDefault();
        document.getElementById("mobileNumError").classList.remove('d-node');
        document.getElementById("mobileNumError").innerHTML="Phone number must be filled!"
    }else if(mobile.value.match(mobileRegex)){
        e.preventDefault();
        document.getElementById("mobileNumError").classList.remove('d-none');
        document.getElementById("mobileNumError").innerHTML="Invalid Phone Number";
    }else if(mobile.value.match(mobileRegex)){
        e.preventDefault();
        document.getElementById("mobileNumError").classList.remove('d-none');
        document.getElementById("mobileNumError").innerHTML=""
    }
})