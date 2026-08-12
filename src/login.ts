const loginButton = document.getElementById("oauth-login");
if (loginButton) {
    loginButton.addEventListener("click", initOauth);
}

function initOauth(): void {
    window.location.href = "/oauth2/";
}

