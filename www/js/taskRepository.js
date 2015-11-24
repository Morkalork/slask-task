angular.module('starter.repositories', ['ngCordova'])
	.factory('taskRepository', ['$cordovaSQLite', function ($cordovaSQLite) {
		return {
			getTasks: function () {
				return new Promise(function (resolve, reject) {
					var toDoListItems = [];

					var query = "SELECT id, title, status FROM TaskTbl";
					$cordovaSQLite.execute(db, query)
						.then(function (result) {
							if (result.rows.length <= 0) {
								return;
							}

							for (var i = 0; i < result.rows.length; i++) {
								var item = { id: result.rows.item(i).id, title: result.rows.item(i).title, status: result.rows.item(i).status };
								console.log(item);
								toDoListItems.push(item);
							}

							resolve(toDoListItems);
						}, reject);
				});
			},
			
			removeTask: function(taskId){
				return new Promise(function(resolve, reject){
					var query = "DELETE FROM TaskTbl WHERE id = ?";
					
					$cordovaSQLite.execute(db, query, [taskId])
						.then(resolve, reject);
				});
			},
			
			addTask: function(item){
				return new Promise(function(resolve, reject){
					var query = "INSERT INTO TaskTbl (title, status) VALUES (?, ?)";
					
					$cordovaSQLite
						.execute(db, query, item)
						.then(resolve, reject);
				});
			},
			
			updateTaskStatus: function(id, newStatus){
				var query = "UPDATE TaskTbl SET status = ? WHERE id = ?";
				
				$cordovaSQLite
					.execute(db, query, [newStatus, id]);
			}
		};
	}]);