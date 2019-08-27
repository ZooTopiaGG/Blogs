function getParam(paramName){
    var paramValue = "";
    var isFound = false;
    if (location.search.indexOf("?") == 0 && location.search.indexOf("=") > 1) {
    var arrSource = unescape(location.search).substring(1, location.search.length).split("&");
    var i = 0;
    while (i < arrSource.length && !isFound) {
      if (arrSource[i].indexOf("=") > 0) {
        if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
          paramValue = arrSource[i].split("=")[1];
          isFound = true;
        }
      }
      i++;
      }
    }
    return paramValue;
}