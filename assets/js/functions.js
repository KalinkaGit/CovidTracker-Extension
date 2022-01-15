/**
 * Change popup tab.
 * 
 * @param {string} newTab tab name.
 */
function ShowTab(newTab) {
    let newNavTab = $('#nav-' + newTab);
    let newPageTab = $('#' + newTab);
    let newPageTab2 = $('#' + newTab + ' div');

    if (newNavTab.hasClass('active'))
        return;

    if (newTab == 'home')
        $(document.body).animate({'width': '500px'}, 500);
    else
        $(document.body).animate({'width': '350px'}, 500);

    $('.active').removeClass('active');
    newNavTab.addClass('active');

    $('main div').hide();
    newPageTab.fadeIn('fast');
    newPageTab2.fadeIn('fast');
}

/**
 * Get daily statistics from a country.
 * 
 * @param {string} iso country's iso.
 * @return {Object} data.
 */
function GetDailyStats(iso) {
    return new Promise(resolve => {
        let url = 'https://disease.sh/v3/covid-19/countries';

        if (iso != 'WORLD')
            url = url + `/${iso}`;
    
        $.get(url).done(data => resolve(data)).fail(() => resolve(false));
    });
}

/**
 * Get historical statistics from a country.
 * 
 * @param {string} iso country's iso.
 * @return {Object} data.
 */
function GetStats(iso) {
    return new Promise(resolve => {
        let url = 'https://disease.sh/v3/covid-19/historical';

        if (iso != 'WORLD')
            url = url + `/${iso}?lastdays=all`;
        else
            url = url + '/ALL?lastdays=all';
    
        $.get(url).done(data => resolve(data)).fail(() => resolve(false));
    });
}

/**
 * Create new chart.
 * 
 * @param {Object} canvasObj chart's id.
 * @param {Object} config chart's config.
 * @return {Object} new chart.
 */
function NewChart(canvasObj, config) {
    return new Promise(resolve => {
        let newChart = new Chart(canvasObj, config);

        resolve(newChart);
    });
}

/**
 * Update all stats from home tab. (async)
 * 
 * @param {string} iso country's iso.
 */
async function UpdateHome(iso) {
    const isWorld = (iso == 'WORLD' ? true : false);
    const stats = await GetDailyStats(iso);
    const globalStats = await GetStats(iso);

    if (!stats || !globalStats)
        return console.log('Error: Impossible to retrieve data of %s', iso);

    $('#h-stats').append(String(stats.country));


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
}

/**
 * Formats a timestamp into a AM/PM date format.
 * 
 * @param {int} timestamp timestamp to format.
 * @return {string} formatted date.
*/
function FormatTimestamp(timestamp) {
    let date = new Date(timestamp);

    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    let ampm = date.getHours() <= 12 ? 'am' : 'pm';
    let hours = ((date.getHours() % 12) ? date.getHours() % 12 : 12);
    let minutes = date.getMinutes();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${month}-${day}-${year} (${hours}:${minutes}${ampm})`;
}