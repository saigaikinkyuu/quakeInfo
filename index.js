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
});
$.getJSON("https://www.jma.go.jp/bosai/quake/data/list.json", function (data) {
    var json_url = data[0]['json']
})

$.getJSON("https://www.jma.go.jp/bosai/quake/data/" + json_url + ".json", function (data) {
    function formatDate(date) {
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月を2桁にする
      var day = ('0' + date.getDate()).slice(-2); // 日を2桁にする
      var hours = ('0' + date.getHours()).slice(-2); // 時を2桁にする
      var minutes = ('0' + date.getMinutes()).slice(-2); // 分を2桁にする
      var seconds = ('0' + date.getSeconds()).slice(-2); // 秒を2桁にする
      return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
    let maxInt_data = data[0]['Body']['Intensity']['MaxInt'];
    var maxIntText = maxInt_data == "1" ? "1" : maxInt_data == "2" ? "2" : maxInt_data == "3" ? "3" : maxInt_data == "4" ? "4" :
                     maxInt_data == "5-" ? "5弱" : maxInt_data == "5+" ? "5強" : maxInt_data == "6-" ? "6弱" :
                     maxInt_data == "6+" ? "6強" : maxInt_data == "7" ? "7" : "不明";
    
    var Magnitude = data[0]['Body']['Earthquake']['Magnitude']
    var Name = data[0]['Body']['Earthquake']['Hypocenter']["Area"]["Name"] != "" ?
               data[0]['Body']['Earthquake']['Hypocenter']["Area"]["Name"] : '情報なし';
    var Hypo = data[0]['Body']['Earthquake']['Hypocenter']["Area"]["Coordinate"]
    var DepthHypo = Hypo.match(/(\d+)\/$/);
    var Depth = DepthHypo[1] / 1000
    var tsunamiText = data[0]['Body']['Comments']["ForecastComment"]["Text"]
    var Time = formatDate(new Date(data[0]['Body']['Earthquake']["2024-04-29T12:54:00+09:00"]));
    var latitudeHypo = Hypo.match(/([-+]?\d+\.\d+)/);
    var latitude = latitudeHypo[0]
    var longitudeHypo = Hypo.match(/\+(\d+\.\d+)/);
    var longitude = longitudeHypo[1]
    
    var shingenLatLng = new L.LatLng(latitude, longitude);
    var shingenIconImage = L.icon({
        iconUrl: 'source/shingen.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -40]
    });
    var shingenIcon = L.marker(shingenLatLng, {icon: shingenIconImage }).addTo(map);
    shingenIcon.bindPopup('発生時刻：'+Time+'<br>最大震度：'+maxIntText+'<br>震源地：'+Name+'<span style=\"font-size: 85%;\"> ('+data[0]["earthquake"]["hypocenter"]["latitude"]+", "+data[0]["earthquake"]["hypocenter"]["longitude"]+')</span><br>規模：M'+Magnitude+'　深さ：'+Depth+'<br>受信：'+data[0]['issue']['time']+', '+data[0]['issue']['source'],{closeButton: false, zIndexOffset: 10000, maxWidth: 10000});
    shingenIcon.on('mouseover', function (e) {this.openPopup();});
    shingenIcon.on('mouseout', function (e) {this.closePopup();});

    // Add coloring based on seismic intensity to prefectures.geojson
    $.getJSON(jsonURL, function(data) {
            // data 内の Pref をループ
            $.each(data.Intensity, function(prefIndex, pref) {
                // Pref 内の Area をループ
                $.each(pref.Area, function(areaIndex, area) {
                    // Area 内の City をループ
                    $.each(area.City, function(cityIndex, city) {
                        // City 内の IntensityStation をループ
                        $.each(city.IntensityStation, function(stationIndex, station) {
                            var shingenLatLng = new L.LatLng(station.latlon[0], station.latlon[1]);
                            var shingenIconImage = L.icon({
                                iconUrl: 'source/' + maxInt_data + '.png',
                                iconSize: [20, 20],
                                iconAnchor: [20, 20],
                                popupAnchor: [0, -40]
                            });
                        });
                    });
                });
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
