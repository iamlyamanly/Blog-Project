const term = window.location.search;
const search = new URLSearchParams(term);
const blogID = search.get("blogID");
let blogWriterUserID;
let prevComments;
let allData;
//* constans
const blogAboutTitle = document.querySelector(".post-title");
const blogPostContent = document.querySelector(".post-content");
const popularBlogsLists = document.querySelector(".topic-list");
const similarBlogsLists = document.querySelector(".similar-blogs");
const userEvents = document.querySelector(".user-events");
const form = document.querySelector("form");
const commentsContainer = document.querySelector(".comments-container");

getBlogData();

async function getBlogData() {
  const response = await fetch("http://localhost:3000/blogs/" + blogID);
  const blogData = await response.json();
  allData = blogData;
  prevComments = blogData.comments;
  blogWriterUserID = blogData.userId;

  userBlogs(blogWriterUserID);

  commentsContainer.innerHTML = "";
  blogData.comments.forEach((comment) => {
    console.log(comment);
    commentsContainer.innerHTML += `
          <div class="comment">
            <div class="user-comment-profile">
              <p class="username">${comment.userName}</p>
            </div>
            <p class="comment-content">${comment.comment}</p>
          </div>
        `;
  });

  blogAboutTitle.innerText = blogData.title;
  blogPostContent.innerText = blogData.description;
  currentPageBlogTitle = blogData.title;
  if (blogData.userId === userID) {
    userEvents.classList.add("show");
    const editBtn = document.querySelector(".edit-btn");
    const deleteBtn = document.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      deleteBlog(blogData.id);
    });
    editBtn.addEventListener("click", function () {
      editBlog(blogData.id);
    });
  }
}

async function userBlogs(writerID) {
  const blogs = await fetch("http://localhost:3000/blogs");
  const data = await blogs.json();
  const result = data.filter((blog) => blog.userId === writerID);
  result.forEach((item) => {
    similarBlogsLists.innerHTML += `
      <li class="topic"><a href="/blog-about.html?blogID=${item.id}">${item.title}</a></li>
    `;
  });
}

async function popularBlogs() {
  const res = await fetch("http://localhost:3000/blogs");
  const blogs = await res.json();

  const sorted = blogs.sort((a, b) => b.likes.length - a.likes.length);
  sorted.forEach((blog, index) => {
    if (index < 5) {
      popularBlogsLists.innerHTML += `
        <li class="topic"><a href="/blog-about.html?blogID=${blog.id}">${blog.title}</a></li>
      `;
    }
  });

  //* user blogs:
}
popularBlogs();

function deleteBlog(id) {
  fetch("http://localhost:3000/blogs/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  alert("blog silindi");
  window.location.href = "/index.html";
}

function editBlog(id) {
  window.location.href = "/create_blog.html?blogID=" + id;
}

//! Comment write:
form.addEventListener("submit", formSubmit);

function formSubmit(e) {
  e.preventDefault();
  let commentValue = form.comment;
  const blogData = {
    comments: [
      ...prevComments,
      {
        comment: commentValue.value,
        userId: userData.id,
        userName: userData.fullName,
        createdAt: new Date(),
      },
    ],
  };
  console.log(blogData);
  sendCommentToServer(blogData);
  commentValue.value = "";
}

function sendCommentToServer(data) {
  fetch(`http://localhost:3000/blogs/${blogID}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      getBlogData();
      console.log(data);
    });
}
