$(document).ready(function() {
    $('.btnSubmit').click(function() {
        var selectedApi = $(this).data('api');
        var requestData = {};

        switch(selectedApi) {
            case 'countryInfo':
                requestData = {
                    api: 'countryInfo',
                    country: $('#countryInfoCountry').val(),
                    lang: $('#countryInfoLang').val()
                };
                break;
            case 'timezone':
                requestData = {
                    api: 'timezone',
                    lat: $('#timezoneLat').val(),
                    lng: $('#timezoneLng').val()
                };
                break;
            case 'findNearbyPlaceName':
                requestData = {
                    api: 'findNearbyPlaceName',
                    lat: $('#nearbyLat').val(),
                    lng: $('#nearbyLng').val()
                };
                break;
        }

        $.ajax({
            url: "libs/php/getApiInfo.php",
            type: 'POST',
            dataType: 'json',
            data: requestData,
            success: function(result) {
                console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    displayResult(result.data, selectedApi);
                } else {
                    $('#txtApiResult').html('Error: ' + result.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Error:', textStatus, errorThrown);
                $('#txtApiResult').html('AJAX error: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });
});

function displayResult(data, api) {
    var html = '';
    switch(api) {
        case 'countryInfo':
            html += '<p>Continent: ' + data[0].continent + '</p>';
            html += '<p>Capital: ' + data[0].capital + '</p>';
            html += '<p>Languages: ' + data[0].languages + '</p>';
            html += '<p>Population: ' + data[0].population + '</p>';
            html += '<p>Area (km<sup>2</sup>): ' + data[0].areaInSqKm + '</p>';
            break;
        case 'timezone':
            html += '<p>Time Zone ID: ' + data.timezoneId + '</p>';
            html += '<p>GMT Offset: ' + data.gmtOffset + '</p>';
            html += '<p>Country: ' + data.countryName + '</p>';
            html += '<p>Sunrise: ' + data.sunrise + '</p>';
            html += '<p>Sunset: ' + data.sunset + '</p>';
            break;
        case 'findNearbyPlaceName':
            if (data.length > 0) {
                html += '<ul>';
                for (var i = 0; i < data.length; i++) {
                    html += '<li>' + data[i].name + ' (' + data[i].countryName + ')</li>';
                }
                html += '</ul>';
            } else {
                html += '<p>No nearby places found.</p>';
            }
            break;
    }
    $('#txtApiResult').html(html);
}
