/*!
 * Copyright 2010-2012, ebrahim@byagowi.com
 * Released under GPL Licenses.
 */
/*global localStorage: false, window: false, chrome: false */

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

function initializeOptionsStorage() {
    "use strict";
    saveOptionByName("simpleSwitch", true); // I prefer this be true by default
    saveOptionByName("pageSwitch", false);
    saveOptionByName("ctrlShiftXSwitch", false);
    saveOptionByName("isInitialized", true);
}

if (!loadOptionByName("isInitialized")) {
    initializeOptionsStorage();
}

// NOTE: this function will be injected to all page.
var switchDirection = function (element) {
    "use strict";
    var currentDirection = window.getComputedStyle(element, null).getPropertyValue("direction");

    element.removeAttribute("dir");
    if (currentDirection === "rtl") {
        element.style.setProperty("direction", "ltr", "important");
    } else {
        element.style.setProperty("direction", "rtl", "important");
    }
};

if (loadOptionByName("pageSwitch") === true) {
    chrome.contextMenus.create({
        title: chrome.i18n.getMessage("pageSwitchButton"),
        contexts: ["page"],
        onclick: function () {
            "use strict";
            chrome.tabs.executeScript(null, {
                code: "(" + switchDirection + "(document.body))"
            });
        }
    });
}

if (loadOptionByName("simpleSwitch") === true) {
    chrome.contextMenus.create({
        title: chrome.i18n.getMessage("simpleSwitchButton"),
        contexts: ["editable"],
        onclick: function () {
            "use strict";
            chrome.tabs.executeScript(null, {
                code: "(" + switchDirection + "(document.activeElement))"
            });
        }
    });
}

// NOTE: this function will be injected to all pages.
var addSwitchDirectionEvent = function (switchDirection) {
    "use strict";
    window.addEventListener("keyup", function (event) {
        var modifier = event.ctrlKey || event.metaKey;
        if (modifier && event.shiftKey && event.keyCode === 88) {
            switchDirection(window.document.activeElement); // document of dest. page
        }
    }, false);
};

if (loadOptionByName("ctrlShiftXSwitch") === true) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
        "use strict";
        if (changeInfo.status === "complete") {
            chrome.tabs.executeScript(tabId, {
                code: "(" + addSwitchDirectionEvent + "(" + switchDirection + "))"
            });
        }
    });
}