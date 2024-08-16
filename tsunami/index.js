var map
function drawMap(){
  map = L.map('map', {
    zoomControl: false,
	 minZoom: 1, // 最低ズームレベルを1に設定
	 maxZoom: 12, // 最大ズームレベルを9に設定
	 doubleClickZoom:false, // ダブルクリックで、マップをズームするかしないか。
	 boxZoom:false, // シフトキーを押しながらマウスをドラッグすることで、マップの表示範囲をズームするかしないか。
	 zoomControl:false, // ズームコントロールの表示、非表示。
  });
  L.control.scale({
    maxWidth: 150,
	 position: 'bottomright',
	 imperial: false
  }).addTo(map);
  fetch('https://www.jma.go.jp/bosai/tsunami/data/list.json')
    .then(response => response.json())
    .then(datas => {
      if(datas[0]){
        fetch('https://www.jma.go.jp/bosai/tsunami/data/' + datas[0].json + '.json')
        .then(response => response.json())
        .then(data => {
          var pointFlag = true
          if(data.Control.Title === "津波警報・注意報・予報a" || data.Control.Title === "津波情報a"){
            if(data.Control.Title === "津波情報a"){
              if(data.Head.Title === "各地の満潮時刻・津波到達予想時刻に関する情報"){
                pointFlag = false
              }
            }else {
              pointFlag = false
            }
          }
          let forecast_items = data.Body.Tsunami.Item
          var areaNameArray = [ '北海道太平洋沿岸東部','北海道太平洋沿岸中部','北海道太平洋沿岸西部','北海道日本海沿岸北部','北海道日本海沿岸南部','オホーツク海沿岸','青森県日本海沿岸','青森県太平洋沿岸','陸奥湾','岩手県','宮城県','秋田県','山形県','福島県','茨城県','千葉県九十九里・外房','千葉県内房','東京湾内湾','伊豆諸島','小笠原諸島','相模湾・三浦半島','新潟県上中下越','佐渡','富山県','石川県能登','石川県加賀','福井県','静岡県','愛知県外海','伊勢・三河湾','三重県南部','京都府','大阪府','兵庫県北部','兵庫県瀬戸内海沿岸','淡路島南部','和歌山県','鳥取県','島根県出雲・石見','隠岐','岡山県','広島県','徳島県','香川県','愛媛県宇和海沿岸','愛媛県瀬戸内海沿岸','高知県','山口県日本海沿岸','山口県瀬戸内海沿岸','福岡県瀬戸内海沿岸','福岡県日本海沿岸','有明・八代海','佐賀県北部','長崎県西方','壱岐・対馬','熊本県天草灘沿岸','大分県瀬戸内海沿岸','大分県豊後水道沿岸','宮崎県','鹿児島県東部','種子島・屋久島地方','奄美群島・トカラ列島','鹿児島県西部','沖縄本島地方','大東島地方','宮古島・八重山地方' ]
          var areaNumArray = [ '100','101','102','110','111','120','200','201','202','210','220','230','240','250','300','310','311','312','320','321','330','340','341','350','360','361','370','380','390','391','400','500','510','520','521','522','530','540','550','551','560','570','580','590','600','601','610','700','701','710','711','712','720','730','731','740','750','751','760','770','771','772','773','800','801','802' ]
          $.getJSON("../prefJson.geojson", function(data) {
				     // areaDataに含まれる値のセットを作成
					  L.geoJson(data, {
					    style: function(feature) {
					      // areaDataに含まれない場合は、デフォルトのスタイルを適用
					      return {
						     color: #c0c0c0",
						     weight: 1.5,
							  opacity: 1,
							  fillColor: "#c0c0c0",
							  fillOpacity: 1
						   };
					    }
					  }).addTo(map);
				   });
          for(var i = 0;i<forecast_items.length;i++){
				     // areaDataに含まれる値のセットを作成
             let color = ""
             if(forecast_items.Category.Kind.Name === "津波予報（若干の海面変動）"){
               color = "#00bfff"
             }else if(forecast_items.Category.Kind.Name === "津波注意報"){
               color = "yellow"
             }else if(forecast_items.Category.Kind.Name === "津波警報"){
               color = "#ff0000"
             }else if(forecast_items.Category.Kind.Name === "大津波警報：発表"){
               color = "#4b0082"
             }else {
               color = "#4b0082"
             }
             if(areaNameArray.indexOf(forecast_items[i].Area.Name) !== -1){
             $.getJSON("https://geoshape.ex.nii.ac.jp/jma/resource/AreaTsunami/20240520/" + areaNumArray[areaNameArray.indexOf(forecast_items[i].Area.Name)] + ".geojson", function(data) {
					     L.geoJson(data, {
					       style: function(feature) {
					         // areaDataに含まれない場合は、デフォルトのスタイルを適用
					         return {
						        color: color,
						        weight: 1.5,
							      opacity: 1,
							      fillColor: color,
							      fillOpacity: 1
						       };
					        }
					      }).addTo(map);
                onEachFeature: function(feature, layer) {
                  layer.bindPopup("<b>" + forecast_items[i].Area.Name + "</b><br>" + forecast_items[i].FirstHeight.Condition + "<br>" + "最大波(予想)：" + forecast_items[i].MaxHeight.TsunamiHeight + "m");
                }
				     });
             }
          }
          if(pointFlag === true){
            let observation_items = data.Observation.Item
            for(var n = 0;n < observation_items.length;n++){
              let stations = observation_items[n].Station
              for(var s = 0;s < stations.length;s++){
                stations[s]
                var marker = L.marker(new L.LatLng()).bindPopup('<b>Hello world!</b><br>I am a marker.').addTo(map);
              }
            }
          }
        })
      }else {
        //
      }
    })
}
