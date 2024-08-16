function drawMap(){
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
          //forecastでマップを描く
          //pointFlagがtrueの場合のみobservationにて観測情報を上乗せする
        })
      }else {
        //
      }
    })
}
