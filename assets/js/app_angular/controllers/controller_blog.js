app
	.service('ServiceBlog', function() { /* ... */ })
	.controller('ControllerBlog', [
		'$scope',
		'$http',
		'ServiceBlog',
		function($scope, ServiceBlog) {

			//console.log(ServiceBlog.message);

		/*	$scope.getInfoBlog = function() {
				ServiceBlog.fetchInfoBlog().then((value) => {
					console.log(JSON.stringify(value));
				});
			};*/

			//	$scope.getInfoBlog();
		}
	]);
