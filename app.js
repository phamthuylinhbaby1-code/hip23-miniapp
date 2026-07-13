const telegram = window.Telegram?.WebApp;

const welcomeElement = document.getElementById("welcome");
const userIdElement = document.getElementById("userId");
const usernameElement = document.getElementById("username");
const testButton = document.getElementById("testButton");

if (telegram) {
    telegram.ready();
    telegram.expand();

    const user = telegram.initDataUnsafe?.user;

    if (user) {
        welcomeElement.textContent =
            `Xin chào ${user.first_name || "bạn"}!`;

        userIdElement.textContent = user.id || "---";

        usernameElement.textContent = user.username
            ? `@${user.username}`
            : "Chưa có username";
    } else {
        welcomeElement.textContent =
            "Ứng dụng đang chạy ngoài Telegram.";
    }
} else {
    welcomeElement.textContent =
        "Ứng dụng đang chạy ngoài Telegram.";
}

testButton.addEventListener("click", () => {
    if (telegram) {
        telegram.showAlert("Mini App đang hoạt động.");
    } else {
        alert("Website đang hoạt động.");
    }
});