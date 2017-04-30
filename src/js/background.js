function innerHandler(urlString) {
  var a = document.createElement("a");
  a.href = urlString;
  if (a.search) {
    var query = parseQuery(a.search);
    if (query.q && isUrl(query.q)) {
      var searchedUrl = unescape(query.q);
      innerHandler(searchedUrl);
      return;
    } else if (query.url && isUrl(query.url)) {
      var searchedUrl = unescape(query.url);
      innerHandler(searchedUrl);
      return;
    }
  }
  openDistillerWithUrl(urlString);
}

function isUrl(urlString) {
  try {
    var url = new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

function openDistillerWithUrl(urlString) {
  try {
    var url = new URL(urlString);
  } catch (e) {
    alert("Url "+urlString + " is not an valid URL");
  }
  
  var distillerBase = "chrome-distiller://6f8a02b6-79b7-4031-950f-97b2946e5ca7/?time=140534513&url="
  if (urlString.toLowerCase().startsWith('http://') ||
      urlString.toLowerCase().startsWith('https://')) {
    chrome.tabs.create({ url: distillerBase+urlString, active:true});
  } else {
    chrome.tabs.create({ url: distillerBase+"http://"+urlString, active:true});
  }
}

function parseQuery(qstr) {
    var query = {};
    var a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

function onClickHandler(info, tab) {
  if (info.menuItemId == "contextPage") {
    innerHandler(tab.url);
  } else if (info.menuItemId == "contextLink") {
    innerHandler(info.linkUrl);
  } else if (info.menuItemId == "contextSelection") {
    innerHandler(info.selectionText);
  }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "title": "open current page in distiller",
    "contexts": ["page"],
    "id": "contextPage"});
  
  chrome.contextMenus.create({
    "title": "open link in distiller",
    "id": "contextLink",
    "contexts": ["link"]});
  
  chrome.contextMenus.create({
    "title": "open \"%s\" distiller",
    "contexts": ["selection"],
    "id": "contextSelection"});
});
