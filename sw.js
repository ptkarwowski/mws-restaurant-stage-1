/*based on the lecture of Doug Brown Webinar */
var cacheID = "mws-restaurant-1";
self.addEventListener("install", event => {
	event.waitUntil(caches.open(cacheID).then(cache => {
		return cache.addAll(['./', './index.html', './restaurant.html', './js/dbhelper.js', './js/main.js', './js/restaurant_info.js', './css/res.css', './css/styles.css', './data/restaurants.json', './img/brestaurant/na.png', ]).catch(error => {
			console.log("Caches open failed: " + error);
		});
	}));
});
self.addEventListener("fetch", event => {
	let cacheRequest = event.request;
	let cacheUrlObj = new URL(event.request.url);
	if (event.request.url.indexOf("restaurant.html") > -1) {
		const cacheURL = "restaurant.html";
		cacheRequest = new Request(cacheURL);
	}
	if (cacheUrlObj.hostname !== "localhost") {
		event.request.mode = "no-cors";
	}
	event.respondWith(caches.match(cacheRequest).then(response => {
		return (response || fetch(event.request).then(fetchResponse => {
			return caches.open(cacheID).then(cache => {
				cache.put(event.request, fetchResponse.clone());
				return fetchResponse;
			});
		}).catch(error => {
			if (event.request.url.indexOf(".jpg") > -1) {
				return caches.match("/img/iman/na.png");
			}
			return new Response("You are not connected to the internet", {
				status: 404,
				statusText: "You are not connected to the internet"
			});
		}));
	}));
});
