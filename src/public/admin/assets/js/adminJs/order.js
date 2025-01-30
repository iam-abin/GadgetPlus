function changeOrderStatus(orderId,status,nextButtonValue){
    swal('Do you want to change the order Status',{
            buttons:["No","Yes"]
    })
    .then((res)=>{
        if(res){
            $.ajax({
                url:'/admin/order-status',
                type:'post',
                data:{
                    orderId:orderId,
                    status:status
                }
            })
            .done((res)=>{
                if(res){
                    if(!res.error){
                        window.location.reload();
                    }
                }

            })
            .fail((err)=>{
                console.error(err);
            })
        }
                
    })
               
    
}