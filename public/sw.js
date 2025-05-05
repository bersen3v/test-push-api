/* eslint-disable @typescript-eslint/no-unused-vars */

self.addEventListener("install", function (event) {
  console.log("Hello world from the Service Worker 🤙");
});

self.addEventListener('push', function(event){

  const data = event.data.json();

  const options = {
    body: data.body,
  }

  let promise = self.registration.showNotification(data.title, options);
  event.waitUntil(promise)
}) 