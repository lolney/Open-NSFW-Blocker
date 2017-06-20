function testImage(requestDetails) {
  console.log("Testing image: " + requestDetails.url);
  return {
    redirectUrl: "http://g01.a.alicdn.com/kf/HTB1LU0zKFXXXXbQXVXXq6xXFXXXn/asdfasdf.jpg"
  };
}

browser.webRequest.onBeforeRequest.addListener(
  testImage,
  {urls: ["<all_urls>"], types:["image"]},
  ["blocking"]
);