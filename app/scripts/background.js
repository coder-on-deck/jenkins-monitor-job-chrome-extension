'use strict'

angular.module('background', ['chrome-extension-angular'])

angular.module('background').controller('BackgroundCtrl', function BackgroundController (chrome, $scope, $interval, $http) {
  var results = {}
  $scope.config = {'version': 1, jobs: []}

  function readConfig () {
    chrome.readConfig().then(function (config) {
      if (!config) {
        config = $scope.config
      }
      if (config.version !== $scope.config.version) {
        $scope.config = config
        results = {} // clear
        $scope.getData()
      }
    })
  }

  function sendData () {
    chrome.sendMessage({type: 'data', data: results})
  }

  chrome.onMessage(function (request) {
    if (request.type === 'update-please') {
      sendData()
    }
  })

  $scope.getData = function () {
    $scope.config.jobs.forEach(function (job) {
      $http.get(job.url + '/lastBuild/api/json').then(function (result) {
        results[job.url] = result.data
      })
    })
  }

  $interval($scope.getData, 1000 * 30)
  $interval(readConfig, 1000) // once configuration changes, I want to know about it - would probably be better with a message.. need to consider
})
