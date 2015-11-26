// Ionic Starter App
var db = null;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

  .run(function ($rootScope, $ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function () {
      defaultStartupChecks();

      initDatabase($cordovaSQLite);

      $cordovaSQLite
        .execute(db, "CREATE TABLE IF NOT EXISTS TaskTbl (id integer primary key, title text, status int)")
        .then(function(result){ console.log("Completed creating table: %o", result);})
        .then(function(error){ console.error("Failed to create database: %o", error);});
      
      //addDefaultContent($cordovaSQLite);
      
      $rootScope.$broadcast('databaseLoaded');
    });
  })

function defaultStartupChecks() {
  if (window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }

  if (window.StatusBar) {
    StatusBar.styleDefault();
  }
}

function initDatabase($cordovaSQLite) {

  var dbName = "tasks.db";

  if (window.cordova) { //Device
    db = $cordovaSQLite.openDB(dbName, 1);
  }
  else { //Browser
    db = window.openDatabase(dbName, '1.1', 'A database for tasks', 1024 * 1024 * 1024);
  }
}

function addDefaultContent($cordovaSQLite) {
  var data = [
    ['Samarin', 0],
    ['Panodil', 0]
  ];
    
  // $cordovaSQLite.execute(db, "DELETE FROM TaskTbl", [])
  //   .then(function(result){ console.info("Successfully queried for tables: %o", result);})
  //   .then(function(error){ console.error("Failed to fetch tables: %o", error);});
    
  for(var d in data){
    console.info("Inserting %o", data[d]);
    $cordovaSQLite.execute(db, "INSERT INTO TaskTbl (title, status) VALUES (?, ?)", data[d])
      .then(function(result){
        
      }, function(error){
        console.error(error);
      });
  }
}