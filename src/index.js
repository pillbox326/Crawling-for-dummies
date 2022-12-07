let MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
let clickedElement;
let prevDOM = null;
let flag = 0;
let mouseEventListener


let getSelector = function (el) {
  if (el.tagName.toLowerCase() == "html")
    return "html";
  var str = el.tagName.toLowerCase();
  str += (el.id != "") ? "#" + el.id : "";
  if (el.className) {
    var classes = el.className.trim().split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      str += "." + classes[i]
    }
  }

  if (document.querySelectorAll(str).length == 1) return str;

  return getSelector(el.parentNode) + " > " + str;
}


let mouseEvent = function (e) {
  var srcElement = e.srcElement;
  if (true) {
    if (prevDOM != null) {
      prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
    }
    srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
    prevDOM = srcElement;
  }
};

// document.addEventListener('mousemove', mouseEvent);



let selectorToJson = (selector) => {
  let elements = document.querySelectorAll(selector);

  let data = [];
  let result = [];
  for(let i = 0; i<elements.length; i++) {
    let tmp = new Object();
    let attr = new Object();
    tmp.element = elements[i].tagName;
    tmp.text = elements[i].innerText;
      
    let attrs = elements[i].getAttributeNames();
    for(let j = 0; j < attrs.length; j++) {
      attr[attrs[j]] = elements[i].getAttribute(attrs[j]);
    }
    tmp.attribute = attr;

    data.push(tmp);
  }

  console.log(data);
}

let clickEvent = function (e) {
  
   e.preventDefault();
  clickedElement = e.target;
  let selector = clickedElement.parentNode.tagName 
  if(clickedElement.parentNode.classList.length > 0){
      selector +=  "." + clickedElement.parentNode.classList.value.toString().replaceAll(" ", ",")
      selector = selector.replace(/,\s*$/, "");
   } 
  selector +=  ' ' + clickedElement.tagName
  if(clickedElement.classList.toString().replaceAll("crx_mouse_visited", "").length > 0){
      selector +=  "." + clickedElement.classList.value.toString().replaceAll("crx_mouse_visited", "").replaceAll(" ", ",");
      selector = selector.replace(/,\s*$/, "");
  }


  window.navigator.clipboard.writeText(selector).then(() => {
    alert("selector {{" + selector + "}} is copied in your clipboard");
  });
  
  selectorToJson(selector);
};


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log('haha!!!', message);
    console.log('really..');
      switch(message.type) {
          case "btnClick":
            chrome.storage.local.get(["flag"]).then((result) => {
              let flag = result.flag;
              console.log(flag);
              if(flag == "0") {
                chrome.storage.local.set({flag: "1" })
                document.addEventListener('mousemove', mouseEvent);
                document.addEventListener('click', clickEvent);

              }
              
              else if(flag == "1") {
                chrome.storage.local.set({ flag: "0" })
                document.removeEventListener('mousemove', mouseEvent);
                document.removeEventListener('mousemove', clickEvent);

                let elems = document.querySelectorAll(".crx_mouse_visited");

                [].forEach.call(elems, function(el) {
                    el.className = el.className.replaceAll("crx_mouse_visited", "");
                });

              }
              sendResponse({status: 'ok'});
            });
          break;
      }
      sendResponse({status: 'ok'});
  }
);
