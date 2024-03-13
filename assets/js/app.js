const form = document.querySelector(".register-container > form");
const preview = document.querySelector(".profile-photo > img");

form.register.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("clicked");
  validateForm();
});

form.photo.addEventListener("change", function (e) {
  const file = form.photo.files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      preview.src = reader.result;
    },
    false
  );
  if (file) {
    reader.readAsDataURL(file);
    console.log(reader);
  }
});

function validateForm() {
  //! regular expressions:
  const fullnameRegex = /^[a-z,',-]+(\s)[a-z,',-]+$/i;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //* checking inputs:
  if (form.username.value !== "" && fullnameRegex.test(form.username.value)) {
    console.log("passed username");
  }
  if (form.email.value !== "" && emailRegex.test(form.email.value)) {
    console.log("passed email");
  }
  if (form.password.value !== "" && passwordRegex.test(form.password.value)) {
    console.log("passed password");
  }
  if (form.confirmPassword.value === form.password.value) {
    console.log("Parollar eynidir");
    console.log(form.password.value);
  }
  if (
    passwordRegex.test(form.password.value) &&
    emailRegex.test(form.email.value) &&
    fullnameRegex.test(form.username.value) &&
    form.confirmPassword.value === form.password.value
  ) {
    console.log("hamisindan kecdi");
    const user = {
      fullName: form.username.value,
      password: form.password.value,
      email: form.email.value,
      photo: preview.getAttribute("src"),
    };
    alert("Succesfully profile");
    dataSendToServer(user);
    form.reset();
  } else {
    console.log("Error");
  }
}

function dataSendToServer(data) {
  fetch("http://localhost:3000/authors", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  window.location.href = "../../login.html";
}
