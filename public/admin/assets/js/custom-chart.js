(function ($) {
    "use strict";

    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            
            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                        label: 'Sales',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: [18, 17, 4, 3, 2, 20, 25, 31, 25, 22, 20, 9]
                    },
                    {
                        label: 'Visitors',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(4, 209, 130, 0.2)',
                        borderColor: 'rgb(4, 209, 130)',
                        data: [40, 20, 17, 9, 23, 35, 39, 30, 34, 25, 27, 17]
                    },
                    {
                        label: 'Products',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(380, 200, 230, 0.2)',
                        borderColor: 'rgb(380, 200, 230)',
                        data: [30, 10, 27, 19, 33, 15, 19, 20, 24, 15, 37, 6]
                    }

                ]
            },
            options: {
                plugins: {
                legend: {
                    labels: {
                    usePointStyle: true,
                    },
                }
                }
            }
        });
    } //End if

    /*Sale statistics Chart*/
    if ($('#myChart2').length) {
        
        var ctx = document.getElementById("myChart2");
        let orderStatus=JSON.parse(document.getElementById('orderStatus').value)

        console.log(orderStatus);
        console.log(orderStatus.pending);

        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
            labels: ['pending','confirmed', 'shipped', 'out for delivery' ,'delivered' ,'canceled'],
            datasets: [
                {
                    label: "US",
                    backgroundColor: [
                        "#5897fb",
                        "#FFC154",
                        "#47B39C",  
                        "#EC6B56",
                        "#EA5F89",
                        "#57167E",

                    ],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,

                    barThickness:10,
                    data: [orderStatus.pending,orderStatus.confirmed,orderStatus.shipped,orderStatus.outForDelivery,orderStatus.delivered,orderStatus.canceled]
                }, 
                
            ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                        usePointStyle: true,
                        },
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } //end if
    
})(jQuery);