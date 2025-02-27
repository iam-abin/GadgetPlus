$(document).ready(function () {
    $('#loginForm').submit((e) => {
      e.preventDefault();
      $.ajax({
        url: "/user-login",
        type: 'post',
        data: $('#loginForm').serialize()
      }).done((res) => {
        location.reload() 

      }).fail((err) => {
        console.error(err);
        
        document.getElementById("loginError").innerHTML=`${err?.responseJSON?.message}`
        document.getElementById("loginError").classList.remove('d-none')

        setTimeout(()=>{
          document.getElementById("loginError").classList.add('d-none')
          location.reload()
        },3000)

      })
    })
  })