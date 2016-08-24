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
        
        $scope.timezonenames = moment.tz.names();
        $scope.timezones = [
        //   {name: 'GMT-12', value: -12},
        //   {name: 'GMT-11', value: -11},
        //   {name: 'GMT-10', value: -10},
        //   {name: 'GMT-9', value: -9},
        //   {name: 'GMT-8', value: -8},
        //   {name: 'GMT-7', value: -7},
        //   {name: 'GMT-6', value: -6},
        //   {name: 'GMT-5', value: -5},
        //   {name: 'GMT-4', value: -4},
        //   {name: 'GMT-3', value: -3},
        //   {name: 'GMT-2', value: -2},
        //   {name: 'GMT-1', value: -1},
        //   {name: 'GMT', value: 0},
        //   {name: 'GMT+1', value: 1},
        //   {name: 'GMT+2', value: 2},
        //   {name: 'GMT+3', value: 3},
        //   {name: 'GMT+4', value: 4},
        //   {name: 'GMT+5', value: 5},
        //   {name: 'GMT+6', value: 6},
        //   {name: 'GMT+7', value: 7},
        //   {name: 'GMT+8', value: 8},
        //   {name: 'GMT+9', value: 9},
        //   {name: 'GMT+10', value: 10},
        //   {name: 'GMT+11', value: 11},
        //   {name: 'GMT+12', value: 12}
        ];
        $scope.timezonenames.forEach(function (zone) {
          $scope.timezones.push({
            name: zone,
            value: zone
          });
        });
        $scope.currentTimeZone = $scope.timezones[0];
        $scope.$watch('currentTimeZone', function (newVal, oldVal) {
          config.set('timepicker:activetz', newVal.value);
          $rootScope.$broadcast('courier:searchRefresh');
          //config.set('dateFormat:tz', newVal.value);
          // if (oldVal != newVal) {

          // }
        });

        console.log('**dateFormat**', config.get('dateFormat:tz'));

        $scope.toggleRefresh = function () {
          timefilter.refreshInterval.pause = !timefilter.refreshInterval.pause;
        };
      }
    };
  });

});
