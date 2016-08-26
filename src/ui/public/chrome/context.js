define(function (require) {
  var _ = require('lodash');
  var ConfigTemplate = require('ui/ConfigTemplate');

  var moment = require('moment');

  require('ui/modules')
  .get('kibana')
  // TODO: all of this really belongs in the timepicker
  .directive('chromeContext', function (timefilter, globalState, $rootScope, config) {

    var listenForUpdates = _.once(function ($scope) {
      $scope.$listen(timefilter, 'update', function (newVal, oldVal) {
        globalState.time = _.clone(timefilter.time);
        globalState.refreshInterval = _.clone(timefilter.refreshInterval);
        globalState.save();
      });
    });

    return {
      link: function ($scope) {
        listenForUpdates($scope);

        // chrome is responsible for timepicker ui and state transfer...
        $scope.timefilter = timefilter;
        $scope.pickerTemplate = new ConfigTemplate({
          filter: require('ui/chrome/config/filter.html'),
          interval: require('ui/chrome/config/interval.html')
        });

        $scope.toggleRefresh = function () {
          timefilter.refreshInterval.pause = !timefilter.refreshInterval.pause;
        };

        $scope.timezonenames = moment.tz.names();
        $scope.timezones = [];
        $scope.timezonenames.forEach(function (zone) {
          $scope.timezones.push({
            name: zone,
            value: zone
          });
        });
        $scope.currentTimeZone = config.get('timepicker:activetz');

        $scope.$watch('currentTimeZone', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            config.set('timepicker:activetz', newVal);
            window.localStorage.setItem('timepicker:activetz', newVal);
            // $rootScope.$broadcast('courier:searchRefresh');
            $rootScope.$$timefilter.emit('update');
            $rootScope.$$timefilter.emit('fetch');
          }
        });

        $rootScope.$on('init:config', function () {
          $scope.currentTimeZone = config.get('timepicker:activetz');
        });
      }
    };
  });

});
