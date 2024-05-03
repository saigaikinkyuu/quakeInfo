document.getElementById("histryON").addEventListener("click", function(event) {
  event.preventDefault(); // デフォルトのクリック動作を無効化
　let element1 = document.getElementById("histryON")
　let element2 = document.getElementById("histryOFF")
  let result = element1.dataset
  if(result === "off"){
    element1.dataset.swich = "on"
    element2.dataset.swich = "off"
    element1.classList.toggle('on');
    element1.classList.toggle('off');
    element2.classList.toggle('on');
    element2.classList.toggle('off');
    document.getElementById("infomation").style.display = "block"
  }
});

document.getElementById("histryOFF").addEventListener("click", function(event) {
  event.preventDefault(); // デフォルトのクリック動作を無効化
　let element2 = document.getElementById("histryON")
　let element1 = document.getElementById("histryOFF")
  let result = element1.dataset
  if(result === "off"){
    element1.dataset.swich = "on"
    element2.dataset.swich = "off"
    element1.classList.toggle('on');
    element1.classList.toggle('off');
    element2.classList.toggle('on');
    element2.classList.toggle('off');
    document.getElementById("infomation").style.display = "none"
  }
});

document.getElementById("infoON").addEventListener("click", function(event) {
  event.preventDefault(); // デフォルトのクリック動作を無効化
　let element1 = document.getElementById("infoON")
　let element2 = document.getElementById("infoOFF")
  let result = element1.dataset
  if(result === "off"){
    element1.dataset.swich = "on"
    element2.dataset.swich = "off"
    element1.classList.toggle('on');
    element1.classList.toggle('off');
    element2.classList.toggle('on');
    element2.classList.toggle('off');
    document.getElementById("list").style.display = "block"
  }
});

document.getElementById("infoOFF").addEventListener("click", function(event) {
  event.preventDefault(); // デフォルトのクリック動作を無効化
　let element2 = document.getElementById("infoON")
　let element1 = document.getElementById("infoOFF")
  let result = element1.dataset
  if(result === "off"){
    element1.dataset.swich = "on"
    element2.dataset.swich = "off"
    element1.classList.toggle('on');
    element1.classList.toggle('off');
    element2.classList.toggle('on');
    element2.classList.toggle('off');
    document.getElementById("list").style.display = "none"
  }
});
