function timeChange(timeJson){
  var time = new Date(timeJson).toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'});
  return time
}
let list = document.getElementById('list');
fetch('https://www.jma.go.jp/bosai/quake/data/list.json')
  .then(response => response.json())
  .then(data => {
    for(var i = 0;i<data.length;i++){
      if(data[i].ttl === "震源・震度情報"){
        var at = timeChange(data[i].at)
        var anm = data[i].anm
        var mag = data[i].mag
        var maxi = data[i].maxi
        let div_element = document.createElement('div');
        let p_element = document.createElement('p');
        let img_element = document.createElement('img');
        p_element.setAttribute("id", "list_p");
        img_element.setAttribute("id", "list_img");
        div_element.setAttribute("id", "list_div");
        div_element.setAttribute("onclick", "chengeMap("+i+")");
        img_element.setAttribute("src", "source/"+maxi+".png");
        p_element.innerHTML = anm+'<br><span style"font-size: 30%;">マグニチュード：'+mag+' 震度：'+maxi+'</span>';
        list.appendChild(div_element);
        div_element.appendChild(p_element);
        div_element.appendChild(img_element);
      }
    }
  })
  .catch(error => console.error('Error:', error));
