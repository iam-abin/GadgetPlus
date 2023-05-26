(function ($) {
    "use strict";

    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        let ctx = document.getElementById('myChart').getContext('2d');

        let monthlyStr=$('#myChartData').data('monthly');
        let monthlyData=monthlyStr.split(',').map(Number)

        let chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Monthly',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(4, 209, 130, 0.2)',
                        borderColor: 'rgb(4, 209, 130)',
                        data: monthlyData
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
                }
            }
        });
    } //End if

    /*Sale statistics Chart*/
    if ($('#myChart2').length) {

        var ctx = document.getElementById("myChart2");

        let orderStatus = JSON.parse(document.getElementById('orderStatus').value)

        console.log(orderStatus);
        console.log(orderStatus.pending);

        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['pending', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'canceled'],
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

                        barThickness: 10,
                        data: [orderStatus.pending, orderStatus.confirmed, orderStatus.shipped, orderStatus.outForDelivery, orderStatus.delivered, orderStatus.canceled]
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

    if ($('#myChart3').length) {
        let ctx = document.getElementById('myChart3').getContext('2d');

        let dailyDataStr = $('#myChartData').data('daily')
        let dailyData = dailyDataStr.split(",").map(Number)

        console.log(dailyData);

        let chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [
                    {
                        label: 'Daily',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: dailyData
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
                }
            }
        });
    } //End if

})(jQuery);