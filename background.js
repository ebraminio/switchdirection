/*!
 * Copyright 2010-2012, ebrahim@byagowi.com
 * Released under GPL Licenses.
 */
/*global window: false, localStorage: false, chrome: false */

(function () {
    "use strict";
    function loadOption(optionName) {
        return localStorage[optionName] === "true";
    }

    function saveOption(optionName, value) {
        localStorage[optionName] = value.toString();
    }

    // These will be injected to all pages
    var switchDirection = function (element, dir) {
        var node, currentDirection, elementType;
        if (element === undefined) {
            element = window.document.activeElement;
            elementType = element.nodeName.toLowerCase();
            if (elementType === "iframe") {
                return; // do interfere with iframes itselves
            }
            if (element.isContentEditable) {
                // http://stackoverflow.com/a/1211981/1414809
                node = window.document.getSelection().anchorNode;
                element = (node.nodeType === 3 ? node.parentNode : node);
            } else if (elementType !== "input" && elementType !== "textarea") {
                // do not intefere with non-content editables and non input or textarea elements
                return;
            }
        }
        if (dir === undefined) {
            currentDirection = window.getComputedStyle(element, null).getPropertyValue("direction");

            element.removeAttribute("dir");
            if (currentDirection === "rtl") {
                dir = "ltr";
            } else {
                dir = "rtl";
            }
        }
        element.style.setProperty("direction", dir, "important");
    }, addSwitchDirectionEvent = function (switchDirection) {
        window.addEventListener("keyup", function (event) {
            // Is Ctrl+Shift+X?
            var modifier = event.ctrlKey || event.metaKey;
            if (modifier && event.shiftKey && event.keyCode === 88) {
                switchDirection();
            }
        }, false);
    };

    if (!loadOption("isInitialized")) {
        saveOption("isInitialized", true);
        saveOption("simpleSwitch", true);
        saveOption("pageSwitch", false);
        saveOption("ctrlShiftXSwitch", false);
    }

    if (loadOption("pageSwitch")) {
        chrome.contextMenus.create({
            title: chrome.i18n.getMessage("pageSwitchButton"),
            contexts: ["page"],
            onclick: function () {
                chrome.tabs.executeScript(null, {
                    allFrames: true,
                    code: "(" + switchDirection + "(document.body))"
                });
            }
        });
    }

    if (loadOption("simpleSwitch")) {
        chrome.contextMenus.create({
            title: chrome.i18n.getMessage("simpleSwitchButton"),
            contexts: ["editable"],
            onclick: function () {
                chrome.tabs.executeScript(null, {
                    allFrames: true,
                    code: "(" + switchDirection + "())"
                });
            }
        });
    }

    if (loadOption("ctrlShiftXSwitch")) {
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
            if (changeInfo.status === "complete") {
                chrome.tabs.executeScript(tabId, {
                    allFrames: true,
                    code: "(" + addSwitchDirectionEvent + "(" + switchDirection + "))"
                });
            }
        });
    }
}());