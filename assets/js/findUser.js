const userProfileName = document.querySelector(".user-profile >p");
const userProfileImage = document.querySelector(".user-profile > img.user-img");
const userLogoutImage = document.querySelector("img.logout");
const userToken =
  localStorage.getItem("user") || sessionStorage.getItem("user");
const userID = CryptoJS.AES.decrypt(userToken, "mastercode").toString(
  CryptoJS.enc.Utf8
);

let userData;

userLogoutImage.addEventListener("click", function () {
  window.location.href = "login.html";
  localStorage.clear();
  sessionStorage.clear();
});

function getUser() {
  fetch("http://localhost:3000/authors/" + userID)
    .then((res) => res.json())
    .then((user) => {
      userProfileName.innerText = user.fullName;
      userProfileImage.src = user.photo;
      userData = user;
    });
}
getUser();
