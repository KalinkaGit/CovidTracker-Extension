$(document).ready(() => {
    $.getJSON('../data/countries.json', data => {
        for (let i = 0; i < data.iso.length; i++) {
            $('#ul-id').append(`<li role="option" id="${data.iso[i]}" class="ng-binding ng-scope" tabindex="-1" aria-selected="false"><img src="../data/svg/${data.iso[i]}.svg" width="15px"></img> ${data.names[i]}</li>`);
        }

        $('.md-select').on('click', e => {
            let el = $(e.currentTarget);

            el.toggleClass('sactive');
        });
        
        $('.md-select ul li').on('click', async e => {
            let el = $(e.currentTarget);
            let v = el.attr('id');
            let stats = await GetDailyStats(v);

            $('.md-select ul li').not(el).removeClass('sactive');
            el.addClass('sactive');
            $('.md-select label button').html(`<img src="../data/svg/${v}.svg" width="20px"></img>`);

            $('#h-stats').html(String(stats.todayCases));
        });
    });
});