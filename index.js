var map = L.map('map').setView([36.575, 137.984], 6);
L.control.scale({ maxWidth: 150, position: 'bottomright', imperial: false }).addTo(map);
map.zoomControl.setPosition('topright');

var PolygonLayer_Style_nerv = {
    "color": "#ffffff",
    "weight": 1.5,
    "opacity": 1,
    "fillColor": "#3a3a3a",
    "fillOpacity": 1
}

$.getJSON("./prefectures.geojson", function (data) {
    L.geoJson(data, {
        style: PolygonLayer_Style_nerv
    }).addTo(map);

    $.getJSON("https://api.p2pquake.net/v2/history?codes=551", function (quakeData) {
        var maxIntensity = quakeData[0]['earthquake']['maxScale'];

        var maxIntensityText = '';
        switch (maxIntensity) {
            case 10:
                maxIntensityText = "1";
                break;
            case 20:
                maxIntensityText = "2";
                break;
            case 30:
                maxIntensityText = "3";
                break;
            case 40:
                maxIntensityText = "4";
                break;
            case 45:
            case 46:
                maxIntensityText = "5弱";
                break;
            case 50:
                maxIntensityText = "5強";
                break;
            case 55:
                maxIntensityText = "6弱";
                break;
            case 60:
                maxIntensityText = "6強";
                break;
            case 70:
                maxIntensityText = "7";
                break;
            default:
                maxIntensityText = "不明";
        }

        var magnitude = quakeData[0]['earthquake']['hypocenter']['magnitude'] != -1 ?
                        quakeData[0]['earthquake']['hypocenter']['magnitude'].toFixed(1) : 'ー.ー';
        var name = quakeData[0]['earthquake']['hypocenter']['name'] != "" ?
                   quakeData[0]['earthquake']['hypocenter']['name'] : '情報なし';
        var depth = quakeData[0]['earthquake']['hypocenter']['depth'] != -1 ?
                    "約" + quakeData[0]['earthquake']['hypocenter']['depth'] + "km" : '不明';
        var tsunamiText = quakeData[0]['earthquake']['domesticTsunami'] == "None" ? "なし" :
                          quakeData[0]['earthquake']['domesticTsunami'] == "Unknown" ? "不明" :
                          quakeData[0]['earthquake']['domesticTsunami'] == "Checking" ? "調査中" :
                          quakeData[0]['earthquake']['domesticTsunami'] == "NonEffective" ? "若干の海面変動" :
                          quakeData[0]['earthquake']['domesticTsunami'] == "Watch" ? "津波注意報" :
                          quakeData[0]['earthquake']['domesticTsunami'] == "Warning" ? "津波警報" : "情報なし";
        var time = quakeData[0]['earthquake']['time'];

        var shingenLatLng = new L.LatLng(quakeData[0]["earthquake"]["hypocenter"]["latitude"], quakeData[0]["earthquake"]["hypocenter"]["longitude"]);
        var shingenIconImage = L.icon({
            iconUrl: 'source/shingen.png',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -40]
        });
        var shingenIcon = L.marker(shingenLatLng, {icon: shingenIconImage }).addTo(map);
        shingenIcon.bindPopup('発生時刻：'+time+'<br>最大震度：'+maxIntensityText+'<br>震源地：'+name+'<span style=\"font-size: 85%;\"> ('+quakeData[0]["earthquake"]["hypocenter"]["latitude"]+", "+quakeData[0]["earthquake"]["hypocenter"]["longitude"]+')</span><br>規模：M'+magnitude+'　深さ：'+depth+'<br>受信：'+quakeData[0]['issue']['time']+', '+quakeData[0]['issue']['source'],{closeButton: false, zIndexOffset: 10000, maxWidth: 10000});
        shingenIcon.on('mouseover', function (e) {this.openPopup();});
        shingenIcon.on('mouseout', function (e) {this.closePopup();});

        // Add coloring based on seismic intensity to prefectures.geojson
        $.each(quakeData[0]['points'], function(index, point) {
            var prefectureCode = point['pref'];
            var seismicIntensity = point['scale'];

            // Define colors based on seismic intensity
            var color = '';
            switch (seismicIntensity) {
                case 10:
                    color = 'red';
                    break;
                case 20:
                    color = 'orange';
                    break;
                case 30:
                    color = 'yellow';
                    break;
                // Add more cases as needed for other seismic intensities
                default:
                    color = 'gray';
            }

            // Find the corresponding prefecture in the geojson data and update its style
            $.each(data.features, function(index, feature) {
                if (feature.properties.pref === prefectureCode) {
                    feature.properties['fillColor'] = color;
                    feature.properties['fillOpacity'] = 0.5; // Adjust opacity as needed
                    return false; // Exit loop once the prefecture is found
                }
            });
        });

        // Update the map with the modified geojson data
        L.geoJson(data, {
            style: function(feature) {
                return {
                    fillColor: feature.properties.fillColor,
                    fillOpacity: feature.properties.fillOpacity,
                    color: '#ffffff',
                    weight: 1.5,
                    opacity: 1
                };
            }
        }).addTo(map);
    });
});
