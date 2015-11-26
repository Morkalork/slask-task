angular.module('starter.controllers', ['ngCordova', 'starter.repositories', 'ngLodash'])
	.controller('ToDoListCtrl', ['$scope', '$rootScope', '$ionicModal', '$cordovaSQLite', 'taskRepository', 'lodash', 
	function ($scope, $rootScope, $ionicModal, $cordovaSQLite, taskRepository, lodash) {

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

		var calculateNewStatus = function (status) {
			switch (status) {
				case 0: return 1;
				case 1: return 0;
				default: return 0;
			}
		}

		var getIcon = function (icon) {
			var platform = "android";
			var isIos = ionic.Platform.isIOS();
			if (isIos) {
				platform = "ios";
			}
			var iconName = "";

			switch (icon) {
				case "checkbox": iconName = isIos ? "circle-outline" : "checkbox-outline-blank"; break;
				case "checkbox-checked": iconName = isIos ? "circle-filled" : "checkbox-outline"; break;
			}

			return "ion-" + platform + "-" + iconName;
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

		$scope.getButtonStatusClass = function (status) {
			switch (status) {
				case 0:
					var buttonIcon = getIcon("checkbox");
					return buttonIcon;
				case 1:
					var buttonIcon = getIcon("checkbox-checked");
					return buttonIcon;
				default:
					return "broken";
			}
		};

		$scope.getItemStatusClass = function (status) {
			switch (status) {
				case 0:
					return "unfinished-task";
				case 1:
					return "finished-task";
				default:
					return "broken";
			}
		};

		$scope.AddItem = function (data) {
			var itemArray = [data.itemTitle, 0];

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
		};

		$scope.setTodoStatus = function (id, status) {

			status = calculateNewStatus(status);

			taskRepository
				.updateTaskStatus(id, status)
				.then(function (result) {


					lodash.each($scope.items, function (data, idx) {
						if (data.id === id) {
							data.status = status;
							return;
						}
					});

					$scope.$apply();
				}, sqlErrorHandler);
		};

		$scope.removeTodoItem = function (id) {
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

				}, sqlErrorHandler);;
		};
		
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

