/*!
 * Copyright 2010-2012, ebrahim@byagowi.com
 * Released under GPL Licenses.
 */
/*global localStorage: false, chrome: false, document: false */
// require background.js

function loadOptionByName(optionName) {
    "use strict";
    var savedState = localStorage[optionName];
    if (savedState === "true") {
        return true;
    } 
    return false;
}

function saveOptionByName(optionName, value) {
    "use strict";
    localStorage[optionName] = value.toString();
}

function refreshBackgroundPage() {
    "use strict";
    chrome.contextMenus.removeAll();
    chrome.extension.getBackgroundPage().window.location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var options = document.getElementsByTagName("input"); // our checkboxes

    Array.prototype.forEach.call(options, function (x) { // forEach for dom elements
        x.checked = loadOptionByName(x.id);
        x.onchange = function () {
            saveOptionByName(x.id, x.checked);
            refreshBackgroundPage();
        };
    });
});