(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      foundItms: '<',
      onRemove: '&'
    }
  };

  return ddo;
}


NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];
function NarrowItDownController($scope, MenuSearchService) {
  var conn = this;

  conn.getMatchedMenuItems = function () {

    var promise = MenuSearchService.getMenuCategories();

    promise.then(function (response) {
      console.log("we are here");
      console.log(response);
      console.log(response.data.menu_items);

      var narrow = [];

      for (var i = 0; i < response.data.menu_items.length; i++) {
        if (response.data.menu_items[i].name.toLowerCase().indexOf($scope.searchTerm) !== -1) {
          narrow.push(response.data.menu_items[i]);
        }
      }

      //conn.categories = response.data.menu_items;
      conn.categories = narrow;

    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });

  };

  conn.removeItem = function (itemIndex) {
    conn.categories.splice(itemIndex, 1);
  };

}

MenuSearchService.$inject = ['$http','ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMenuCategories = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    console.log(response);

    return response;
  };

}


})();
