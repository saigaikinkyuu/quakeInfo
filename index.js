// 震度に基づいた色の設定
function getColor(scale) {
    return scale >= 70 ? '#800026' :
           scale >= 60 ? '#BD0026' :
           scale >= 55 ? '#E31A1C' :
           scale >= 50 ? '#FC4E2A' :
           scale >= 46 ? '#FD8D3C' :
           scale >= 45 ? '#FEB24C' :
           scale >= 40 ? '#FED976' :
           scale >= 30 ? '#FFEDA0' :
           scale >= 20 ? '#FFFFCC' :
                        '#FFFFFF';
}

$.getJSON("https://api.p2pquake.net/v2/history?codes=551", function (data) {
    // p2pquakeのJSONから都道府県ごとの震度を取得
    var prefectures = data[0].points;

    // 各都道府県の震度を地図上に表示
    for (var i = 0; i < prefectures.length; i++) {
        var prefecture = prefectures[i];
        var scale = prefecture.scale;
        var fillColor = getColor(scale);

        // 都道府県の座標を取得
        var prefectureCoords = prefectureCoordsList[prefecture.pref];
        
        // 震度に応じた色付きの円を作成し、地図に追加
        var circle = L.circle([prefectureCoords.lat, prefectureCoords.lng], {
            color: 'none',
            fillColor: fillColor,
            fillOpacity: 0.5,
            radius: 5000 // 円の半径は適宜調整してください
        }).addTo(map);
    }

    // 以下は既存の地図アイコンの追加コードです
    let maxInt_data = data[0]['earthquake']['maxScale'];
    var maxIntText = maxInt_data == 10 ? "1" : maxInt_data == 20 ? "2" : maxInt_data == 30 ? "3" : maxInt_data == 40 ? "4" :
                     maxInt_data == 45 ? "5弱" : maxInt_data == 46 ? "5弱" : maxInt_data == 50 ? "5強" : maxInt_data == 55 ? "6弱" :
                     maxInt_data == 60 ? "6強" : maxInt_data == 70 ? "7" : "不明";
    
    var Magnitude = data[0]['earthquake']['hypocenter']['magnitude'] != -1 ?
                    (data[0]['earthquake']['hypocenter']['magnitude']).toFixed(1) : 'ー.ー';
    var Name = data[0]['earthquake']['hypocenter']['name'] != "" ?
               data[0]['earthquake']['hypocenter']['name'] : '情報なし';
    var Depth = data[0]['earthquake']['hypocenter']['depth'] != -1 ?
                "約"+data[0]['earthquake']['hypocenter']['depth']+"km" : '不明';
    var tsunamiText = data[0]['earthquake']['domesticTsunami'] == "None" ? "なし" :
                      data[0]['earthquake']['domesticTsunami'] == "Unknown" ? "不明" :
                      data[0]['earthquake']['domesticTsunami'] == "Checking" ? "調査中" :
                      data[0]['earthquake']['domesticTsunami'] == "NonEffective" ? "若干の海面変動" :
                      data[0]['earthquake']['domesticTsunami'] == "Watch" ? "津波注意報" :
                      data[0]['earthquake']['domesticTsunami'] == "Warning" ? "津波警報" : "情報なし";
    var Time = data[0]['earthquake']['time'];
    
    var shingenLatLng = new L.LatLng(data[0]["earthquake"]["hypocenter"]["latitude"], data[0]["earthquake"]["hypocenter"]["longitude"]);
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
});
