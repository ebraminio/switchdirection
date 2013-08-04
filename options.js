/*jslint indent: 2*/
/*global localStorage, chrome, document*/
(function () {
  'use strict';
  function loadOptionByName(optionName) {
    return localStorage[optionName] === 'true';
  }

  function saveOptionByName(optionName, value) {
    localStorage[optionName] = value.toString();
  }

  function refreshBackgroundPage() {
    chrome.contextMenus.removeAll();
    chrome.extension.getBackgroundPage().window.location.reload();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var options = document.getElementsByTagName('input'); // our checkboxes
    Array.prototype.forEach.call(options, function (x) { // forEach for dom elements
      x.checked = loadOptionByName(x.id);
      x.onchange = function () {
        saveOptionByName(x.id, x.checked);
        refreshBackgroundPage();
      };
    });
  });
}());