async function requestToServer() {
  const originalLink = document.getElementById("userInput");
  const endPoint = "/api/new";
  const payload = {
    original_link: originalLink
  }
  const response = await fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "applications/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  console.log(data);

}

const button = document.getElementById("buttonPress");
button.addEventListener("click", requestToServer);
