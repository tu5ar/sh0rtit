async function requestToServer() {
  const originalLink = document.getElementById("userInput").value;
  const endPoint = "/api/new";
  const payload = {
    original_link: originalLink
  }
  const response = await fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const newShortLink = await response.text();
  const heading = document.getElementById("newLink");
  const domain = window.location.hostname;
  heading.textContent = domain + "/api/" + newShortLink;

}

const button = document.getElementById("buttonPress");
button.addEventListener("click", requestToServer);
