angular.module('starter.controllers', ['ngCordova', 'starter.repositories', 'ngLodash'])
	.controller('ToDoListCtrl', ['$scope', '$rootScope', '$ionicModal', '$cordovaSQLite', 'taskRepository', 'lodash', function ($scope, $rootScope, $ionicModal, $cordovaSQLite, taskRepository, lodash) {

		$scope.items = [];

		var createModal = function () {
			$ionicModal.fromTemplateUrl('templates/modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modal = modal;
			});
		}
		createModal();

		var sqlErrorHandler = function (error) {
			console.error("SQL ERROR: %o", error);
		}

		$scope.openModal = function () {
			$scope.modal.show();
		};

		$scope.closeModal = function () {
			$scope.modal.remove();
		};

		$scope.$on('$destroy', function () {
			$scope.modal.remove();
		});

		$scope.AddItem = function (data) {
			var itemArray = [data.itemTitle, 0];

			console.log("Add item: %o", itemArray);

			taskRepository
				.addTask(itemArray)
				.then(function (result) {
					var item = {
						id: result.insertId,
						title: itemArray[0],
						status: itemArray[1]
					};

					$scope.items.push(item);
				}, sqlErrorHandler);

			$scope.closeModal();
			createModal(); //Because once closed, a modal can never be opened again (ffs...)
		}

		$scope.setTodoStatus = function (id, status) {
		}

		$scope.removeTodoItem = function (id) {
			console.log("Remove item: %i", id);
			console.log($scope.items);
			taskRepository
				.removeTask(id)
				.then(function () {
					var index = -1;
					lodash.each($scope.items, function (data, idx) {
						if (data.id === id) {
							index = idx;
							return;
						}
					});

					if (index >= 0) {
						$scope.items.splice(index, 1);
						$scope.$apply();
					}

					console.log("Items: %o", $scope.items);
				}, sqlErrorHandler);;
		}
		
		//Initial push
		$rootScope.$on('databaseLoaded', function () {
			taskRepository
				.getTasks()
				.then(function (items) {
					for (var i in items) {
						$scope.items.push(items[i]);
					}

					$scope.$apply();
				}, sqlErrorHandler);
		});
	}]);

