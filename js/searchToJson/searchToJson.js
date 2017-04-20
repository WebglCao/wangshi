/**
 * Created by Administrator on 2016/6/21.
 */
String.prototype.searchToJson = function () {
    var search = window.location.search.replace('?', "");
    var kvArr = search.split('&');
    var finalJson = {};
    for (i = 0; i < kvArr.length; i++) {
        var kvSplit = kvArr[i].split('=');
        finalJson[kvSplit[0].toLowerCase()] = decodeURIComponent(kvSplit[1]);
    }
    return finalJson;
};

window.jsonToSearch = function (json) {
    var arr = [];
    for (var k in json) {
        arr.push(k + '=' + json[k]);
    }
    return arr.join('&');
};