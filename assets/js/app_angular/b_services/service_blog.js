/*app.factory('serviceBlog', ['$http', '$q'],
	function serviceBlog($http, $q) {
		// interface
		var service = {
			albums: [],
			fetchInfoBlog: fetchInfoBlog
		};
		return service;

		// implementation
		function fetchInfoBlog() {
			var def = $q.defer();

			$http.get("/blog")
				.success(function(data) {
					service.albums = data;
					def.resolve(data);
				})
				.error(function() {
					def.reject("Failed to get albums");
				});
			return def.promise;
		}
	}
);
*/
