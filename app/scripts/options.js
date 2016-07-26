'use strict'

angular.module('myoptions', [])

angular.module('myoptions').controller('MyOptionsCtrl', function ($scope, $log) {
  var controller = this
  $log.info('loading my options ctrl')
  $log.info('chrome storage is', chrome.storage)

  controller.details = {jobs: []}

  // add a job to monitor
  controller.add = function () {
    if (!controller.details) {
      controller.details = {}
    }

    if (!controller.details.jobs) {
      controller.details.jobs = []
    }
    controller.details.jobs.push({})
  }

  // rmeove job to monitor
  controller.remove = function (job) {
    controller.details.jobs.splice(controller.details.jobs.indexOf(job), 1)
  }

  // Saves options to chrome.storage
  function saveOptions () {
    controller.details.version = new Date().getTime()
    try {
      $log.info('saving', controller.details)
      chrome.storage.sync.set(controller.details, function () {
        // Update status to let user know options were saved.
        controller.statusMessage = 'Options saved'
        $scope.$apply()
      })
    } catch (e) {
      $log.error('unable to save', e)
    }
  }

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
  function restoreOptions () {
    try {
      // Use default value color = 'red' and likesColor = true.
      chrome.storage.sync.get(null, function (items) {
        $log.info('items is', items)
        controller.details = items
        $scope.$apply()
      })
    } catch (e) {
      $log.error('unable to restore', e)
    }
  }

  controller.save = function ($event) {
    $log.info('saving!')
    try {
      $event.preventDefault()
    } catch (e) {
    }
    saveOptions()
  }

  restoreOptions()
})
