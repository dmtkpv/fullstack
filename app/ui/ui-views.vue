<!--
    Styles
-->

<style lang="scss">

    .ui-views {

        height: 300px;

        canvas {
            width: 100% !important;
            height: 100% !important;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-views">
        <canvas ref="$chart" />
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { onMounted, ref, watch } from 'vue'
    import { useState } from '#app/services/utils.js'



    // -------------------
    // Data
    // -------------------

    const props = defineProps([
        'views',
        'days'
    ])

    const $chart = ref(null);
    const { locale } = useState();



    // -------------------
    // Configure
    // -------------------

    function configure ({ labels, values }) {
        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ data: values }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                backgroundColor: '#489FF8',
                borderColor: '#489FF8',
                scales: {
                    x: {
                        ticks: { callback: index => labels[index].short },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                        grid: { color: '#ecedf2' }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            title: ([{dataIndex}]) => labels[dataIndex].long,
                            label: ({ raw }) => `Views: ${raw}`
                        }
                    }
                }
            }
        }
    }



    // -------------------
    // Get Data
    // -------------------

    function getData () {

        const today = new Date();
        const values = [];
        const labels = [];

        for (let i = props.days - 1; i >= 0; i--) {

            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            const dt = date.getDate()
            const ms = date.toLocaleString(locale, { month: 'short' });
            const ml = date.toLocaleString(locale, { month: 'long' });
            const yr = date.getFullYear()
            const short = `${ms} ${dt}`;
            const long = `${ml} ${dt}, ${yr}`;

            const count = props.views.reduce((count, view) => {
                if (new Date(view.date).toDateString() === date.toDateString()) count += view.count;
                return count;
            }, 0)

            labels.push({ short, long });
            values.push(count);
            
        }

        return {
            values,
            labels
        }

    }



    // -------------------
    // Hooks
    // -------------------

    onMounted(async () => {

        const { Chart } = await import('chart.js/auto');
        const data = getData();
        const chart = new Chart($chart.value, configure(data));

        watch(() => props.views, () => {
            const data = getData()
            chart.data.labels = data.labels;
            chart.data.datasets[0].data = data.values;
            chart.update();
        })

    })

</script>