var map = L.map('map')
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
$.getJSON("https://www.jma.go.jp/bosai/quake/data/list.json", function (datas) {
    var json_url = ""
    for (var i = 0; i < datas.length; i++) {
        if(datas[i].ttl === "震源・震度情報"){
            json_url = datas[i]['json']
            i = datas.length
        }
    }
    $.getJSON("https://www.jma.go.jp/bosai/quake/data/" + json_url, function (data) {
    function formatDate(date) {
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月を2桁にする
      var day = ('0' + date.getDate()).slice(-2); // 日を2桁にする
      var hours = ('0' + date.getHours()).slice(-2); // 時を2桁にする
      var minutes = ('0' + date.getMinutes()).slice(-2); // 分を2桁にする
      var seconds = ('0' + date.getSeconds()).slice(-2); // 秒を2桁にする
      return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
    let maxInt_data = data['Body']['Intensity']["Observation"]['MaxInt'];
    var maxIntText = maxInt_data == "1" ? "1" : maxInt_data == "2" ? "2" : maxInt_data == "3" ? "3" : maxInt_data == "4" ? "4" :
                     maxInt_data == "5-" ? "5弱" : maxInt_data == "5+" ? "5強" : maxInt_data == "6-" ? "6弱" :
                     maxInt_data == "6+" ? "6強" : maxInt_data == "7" ? "7" : "不明";
    
    var Magnitude = data['Body']['Earthquake']['Magnitude']
    var Name = data['Body']['Earthquake']['Hypocenter']["Area"]["Name"] != "" ?
               data['Body']['Earthquake']['Hypocenter']["Area"]["Name"] : '情報なし';
    var Hypo = data['Body']['Earthquake']['Hypocenter']["Area"]["Coordinate"]
    var DepthHypo = Hypo.match(/(\d+)\/$/);
    var Depth = (DepthHypo[1]/1000) + "km"
    var tsunamiText = data['Body']['Comments']["ForecastComment"]["Text"]
    var Time = formatDate(new Date(data['Body']['Earthquake']["OriginTime"]));
    var latitudeHypo = Hypo.match(/\+(\d+\.\d+)/);
    var latitude = latitudeHypo[1]
    var longitudeHypo = Hypo.match(/\+(\d+\.\d+)/g);
    var longitude = longitudeHypo[1]
    var issueTime = formatDate(new Date(data["Control"]["DateTime"]))
    console.log(latitude + "" + longitude)
            // data 内の Pref をループ
            $.each(data.Body.Intensity.Observation.Pref, function(prefIndex, pref) {
                // Pref 内の Area をループ
                $.each(pref.Area, function(areaIndex, area) {
                    // Area 内の City をループ
                    $.each(area.City, function(cityIndex, city) {
                        // City 内の IntensityStation をループ
                            console.log(city.IntensityStation[0].latlon.lat + "" + city.IntensityStation[0].latlon.lon)
                            var markerL = new L.LatLng(city.IntensityStation[0].latlon.lat, city.IntensityStation[0].latlon.lon);
                            var markerIcon = L.icon({
                                iconUrl: 'source/' + city.IntensityStation[0].Int + '.png',
                                iconSize: [18, 18],
                                iconAnchor: [9, 9],
                                popupAnchor: [0, -18],
                                zIndexOffset: 10
                            });
                            var marker = L.marker(markerL, { icon: markerIcon }).addTo(map);
                            // 地図にマーカーを追加
                            marker.addTo(map);
                    });
                });
            });
    
    var shingenLatLng = new L.LatLng(latitude, longitude);
    var shingenIconImage = L.icon({
        iconUrl: 'source/shingen.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -40],
        zIndexOffset: 10000
    });
    var shingenIcon = L.marker(shingenLatLng, {icon: shingenIconImage }).addTo(map);
    var initialLatLng = L.latLng(latitude, longitude);
    map.setView(initialLatLng, 8);
    shingenIcon.bindPopup('発生時刻：'+Time+'<br>最大震度：'+maxIntText+'<br>震源地：'+Name+'<span style=\"font-size: 85%;\"> ('+latitude+", "+longitude+')</span><br>規模：M'+Magnitude+'　深さ：'+Depth+'<br>受信：'+issueTime+', '+data['Control']['EditorialOffice'],{closeButton: false, zIndexOffset: 10000, maxWidth: 10000});
    shingenIcon.on('mouseover', function (e) {this.openPopup();});
    shingenIcon.on('mouseout', function (e) {this.closePopup();});

});
    
})
