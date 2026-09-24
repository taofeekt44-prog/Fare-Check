document.addEventListener("DOMContentLoaded", function () {

    const labelsElement = document.getElementById("chart-labels");
    const dataElement = document.getElementById("chart-data");
    const chartElement = document.getElementById("fareTrendChart");

    if (!labelsElement || !dataElement || !chartElement) {
        return;
    }

    const chartLabels = JSON.parse(
        labelsElement.textContent
    );

    const chartData = JSON.parse(
        dataElement.textContent
    );

    const ctx = chartElement.getContext("2d");

    new Chart(ctx, {

        type: "line",

        data: {

            labels: chartLabels,

            datasets: [
                {
                    label: "Average Fare",

                    data: chartData,

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true,

                    pointRadius: 5,

                    pointHoverRadius: 7
                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: true
                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            return "₦" +
                                Number(context.raw)
                                    .toLocaleString();

                        }

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: false,

                    ticks: {

                        callback: function (value) {

                            return "₦" +
                                Number(value)
                                    .toLocaleString();

                        }

                    }

                }

            }

        }

    });

});