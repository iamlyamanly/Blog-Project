const searchTerm = window.location.search;
const editBlogID = new URLSearchParams(searchTerm)?.get("blogID");
const createBlogBtn = document.querySelector(".create-btn");
const form = document.querySelector("form");
const formTitle = form.querySelector(".title");
const formDescription = form.querySelector(".description");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("salam");
  if (!editBlogID) {
    createBlog();
  } else {
    updateBlog();
  }
});

async function createBlog() {
  const blogData = {
    userId: userID,
    title: formTitle.value,
    description: formDescription.value,
    cratedAt: new Date(),
    likes: [],
    comments: [],
  };

  fetch("http://localhost:3000/blogs", {
    method: "POST",
    body: JSON.stringify(blogData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => console.log(res))
    .then((data) => console.log(data));
  window.location.href = "/index.html";
}

if (editBlogID) {
  createBlogBtn.textContent = "Update Blog";
  fetch("http://localhost:3000/blogs/" + editBlogID)
    .then((res) => res.json())
    .then((data) => {
      formTitle.value = data.title;
      formDescription.value = data.description;
    });
}

function updateBlog() {
  const blogData = {
    title: formTitle.value,
    description: formDescription.value,
    updateAt: new Date(),
  };

  fetch("http://localhost:3000/blogs/" + editBlogID, {
    method: "PATCH",
    body: JSON.stringify(blogData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  window.location.href = "/index.html";
}
