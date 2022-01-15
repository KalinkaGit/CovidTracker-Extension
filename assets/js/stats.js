$(async () => {
    let stats = await GetDailyStats('FR');

    $('#h-stats').append(String(stats.country));

    let globalStats = await GetStats('FR');

    console.log(globalStats);

    labels = [];
    data = [];
    
    for (let [k, v] of Object.entries(globalStats.timeline.cases)) {
      labels.push(k);
      data.push(v);
    }

    const dailyCasesChart = await NewChart($('#chart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
              label: 'Total cases',
              fill: true,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: data,
            }]
          },
        options: {pointRadius: 0.5},
        plugins: [{
          id: 'custom_canvas_background_color',
          beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          }
        }]
    });

    console.log(dailyCasesChart);
});