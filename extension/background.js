const CLASSIFIER_URL = "http://localhost:8000";
const THRESHOLD = 0.1;

class ImageTester {
  constructor() {
    this.imageUrls = [];
    this.shouldBlock = true;
  }

  async registerImage(url) {
    this.imageUrls.push(url);

    return this.testImage(url);
  }

  static arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach(b => (binary += String.fromCharCode(b)));

    return window.btoa(binary);
  }

  static async base64EncodeURL(url) {
    let response = await fetch(url);
    let buffer = await response.arrayBuffer();

    return [
      ImageTester.arrayBufferToBase64(buffer)
    ]; /*new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(response.arrayBuffer());
    });*/
  }

  async testImage(url) {
    let handleBlock = block => {
      console.log("shouldBlock", block);
      if (block != this.shouldBlock) {
        // TODO: let the content script know
        this.shouldBlock = block;
      }
      return block;
    };

    let base64 = await ImageTester.base64EncodeURL(url);

    return fetch(CLASSIFIER_URL, {
      method: "POST",
      body: JSON.stringify({
        threshold: THRESHOLD,
        images: base64
      })
    })
      .then(resp => resp.json())
      .then(json => handleBlock(json.shouldBlock))
      .catch(e => {
        console.error("Error testing images: ", e);
      });
  }
}

const tester = new ImageTester();

function testImage(requestDetails) {
  console.log("Testing image: " + requestDetails.url);

  return tester.testImage(requestDetails.url).then(cancel => ({
    cancel
  }));
}

browser.webRequest.onBeforeRequest.addListener(
  testImage,
  { urls: ["<all_urls>"], types: ["image", "imageset"] },
  ["blocking"]
);

/*
TODO: add option to block the entire page first
browser.webRequest.onBeforeRequest.addListener(
  testImage,
  { urls: ["<all_urls>"] }
  ["blocking"]
);*/
