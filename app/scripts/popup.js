'use strict'

angular.module('myapp', ['chrome-extension-angular'])

angular.module('myapp').controller('PopupCtrl', function PopupCtrl ($scope, chrome) {
  function onUpdate (request/*, sender, sendResponse*/) {
    console.log('got message', request.type)
    if (request.type === 'data') {
      // aggregate by jira issue or branch name
      $scope.data = Object.keys(request.data).map(function (k) {
        var item = request.data[k]
        return {
          name: item.fullDisplayName,
          url: k,
          building: item.building,
          result: item.result,
          duration: item.duration
        }
      })
    }
  }

  chrome.onMessage(onUpdate)
  chrome.sendMessage({type: 'update-please'})
})
