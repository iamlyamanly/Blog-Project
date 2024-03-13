const blogsContainer = document.querySelector(".blogs-container");
let allData;

async function getBlogsData() {
  const res = await fetch("http://localhost:3000/blogs");
  const blogsData = await res.json();
  allData = blogsData;

  const blogsUsers = await Promise.all(
    blogsData.map(async (blog) => {
      const res = await fetch("http://localhost:3000/authors/" + blog.userId);
      const data = await res.json();
      return data;
    })
  );
  repeatBlog(blogsData, blogsUsers);
}
getBlogsData();

function repeatBlog(blogs, users) {
  blogsContainer.innerHTML = "";
  blogs.forEach((blog, index) => {
    const blogDate = new Date(blog.cratedAt).toLocaleDateString("en-EN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    blogsContainer.innerHTML += `
        <div class="blog-card">
            <div class="blog-content">
                <h3>${blog.title}</h3>
                <p>
                    ${blog.description.slice(0, 200).concat("...")}
                </p>
            </div>
            <div class="blog-about">
              <div class="like-comment">
                <div class="like-contet">
                  <i class="fa-${
                    blog.likes.includes(userID) ? "solid" : "regular"
                  } fa-thumbs-up" onclick="likeBlog(this, '${blog.id}')"></i>
                  <span class="like-count">${blog.likes?.length}</span>
                </div>
              </div>
                <a href="blog-about.html?blogID=${
                  blog.id
                }" class="read-btn">Read More</a>
                <div class="blog-date">${blogDate}</div>
                <div class="blog-author">
                    <img src="${users[index].photo}" alt="">
                    <span>${users[index].fullName}</span>
                </div>
            </div>
        </div>
    `;
  });
}

function likeBlog(elem, id) {
  allData.forEach((blog) => {
    if (blog.id === id && !blog.likes.includes(userID)) {
      elem.classList.replace("fa-regular", "fa-solid");
      const [postLikesData] = allData.filter((blog) => {
        return blog.id === id;
      });
      const blogData = {
        likes: [...postLikesData.likes, userID],
      };
      updateBlogData(id, blogData);
    } else if (blog.id === id && blog.likes.includes(userID)) {
      alert("sen buna like atmisan!");
    }
  });
}

function updateBlogData(blogID, data) {
  fetch("http://localhost:3000/blogs/" + blogID, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      getBlogsData();
      console.log(data);
    });
}
