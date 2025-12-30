const app = document.getElementById("app");
function generatePlaceholderImage(title, size = "400x300") {
  const colors = ["3498db", "e74c3c", "2ecc71", "f39c12", "9b59b6", "1abc9c"];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = colors[hash % colors.length];
  return `https://via.placeholder.com/${size}/${color}/FFFFFF?text=${encodeURIComponent(
    title
  )}`;
}

function extractExcerpt(markdown, lineCount = 3) {
  const lines = markdown.split("\n").filter((line) => line.trim().length > 0);
  let excerpt = "";
  let count = 0;

  for (let line of lines) {
    if (
      line.startsWith("#") ||
      line.startsWith("```") ||
      line.startsWith(">")
    ) {
      continue;
    }
    excerpt += line + " ";
    count++;
    if (count >= lineCount) break;
  }

  return excerpt.substring(0, 200) + (excerpt.length > 200 ? "..." : "");
}

function extractFirstImage(markdown) {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imageRegex);
  return match ? match[1] : null;
}

async function fetchMarkdownContent(blogName) {
  try {
    const response = await fetch(`./blogs/${blogName}.md`);
    if (!response.ok) throw new Error("Not found");
    return await response.text();
  } catch (error) {
    return null;
  }
}

async function renderHome() {
  document.title = "Arjc - Blogs";
  let html = `<div class="featured-section">
    <h2>Adipoli Blog</h2>`;
  const featuredBlog = blogs[Math.floor(Math.random() * blogs.length)];
  const content = await fetchMarkdownContent(featuredBlog.name);
  const excerpt = content
    ? extractExcerpt(content, 5)
    : "Click to read more...";
  const image = content
    ? extractFirstImage(content)
    : generatePlaceholderImage(featuredBlog.title, "800x400");
  const finalImage =
    image || generatePlaceholderImage(featuredBlog.title, "800x400");

  html += `
    <a href="#/${featuredBlog.name}" class="featured-blog-link">
      <div class="featured-blog">
        <img src="${finalImage}" alt="${featuredBlog.title}" class="featured-blog-image" />
        <div class="featured-blog-content">
          <h3>${featuredBlog.title}</h3>
          <p>${excerpt}</p>
        </div>
      </div>
    </a>
  </div>`;

  html += `<div class="blogs-grid-section"><h2>All Blogs</h2><div class="blogs-grid">`;
  const app = document.getElementById("app");
  function generatePlaceholderImage(title, size = "400x300") {
    const colors = ["3498db", "e74c3c", "2ecc71", "f39c12", "9b59b6", "1abc9c"];
    const hash = title
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];
    return `https://via.placeholder.com/${size}/${color}/FFFFFF?text=${encodeURIComponent(
      title
    )}`;
  }

  function extractExcerpt(markdown, lineCount = 3) {
    const lines = markdown.split("\n").filter((line) => line.trim().length > 0);
    let excerpt = "";
    let count = 0;

    for (let line of lines) {
      if (
        line.startsWith("#") ||
        line.startsWith("```") ||
        line.startsWith(">")
      ) {
        continue;
      }
      excerpt += line + " ";
      count++;
      if (count >= lineCount) break;
    }

    return excerpt.substring(0, 200) + (excerpt.length > 200 ? "..." : "");
  }

  function extractFirstImage(markdown) {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = markdown.match(imageRegex);
    return match ? match[1] : null;
  }

  async function fetchMarkdownContent(blogName) {
    try {
      const response = await fetch(`./blogs/${blogName}.md`);
      if (!response.ok) throw new Error("Not found");
      return await response.text();
    } catch (error) {
      return null;
    }
  }

  async function renderHome() {
    document.title = "Arjc - Blogs";
    let html = `<div class="featured-section">
        <h2>Adipoli Blog</h2>`;
    const featuredBlog = blogs[Math.floor(Math.random() * blogs.length)];
    const content = await fetchMarkdownContent(featuredBlog.name);
    const excerpt = content
      ? extractExcerpt(content, 5)
      : "Click to read more...";
    const image = content
      ? extractFirstImage(content)
      : generatePlaceholderImage(featuredBlog.title, "800x400");
    const finalImage =
      image || generatePlaceholderImage(featuredBlog.title, "800x400");

    html += `
        <a href="#/${featuredBlog.name}" class="featured-blog-link">
            <div class="featured-blog">
                <img src="${finalImage}" alt="${featuredBlog.title}" class="featured-blog-image" />
                <div class="featured-blog-content">
                    <h3>${featuredBlog.title}</h3>
                    <p>${excerpt}</p>
                </div>
            </div>
        </a>
    </div>`;

    html += `<div class="blogs-grid-section"><h2>All Blogs</h2><div class="blogs-grid">`;

    for (const blog of blogs) {
      const blogContent = await fetchMarkdownContent(blog.name);
      const blogExcerpt = blogContent
        ? extractExcerpt(blogContent, 2)
        : "Click to read more...";
      const firstImage = blogContent ? extractFirstImage(blogContent) : null;
      const blogImage =
        firstImage || generatePlaceholderImage(blog.title, "400x300");

      html += `
            <a href="#/${blog.name}" class="blog-card-link">
                <div class="blog-card">
                    <img src="${blogImage}" alt="${blog.title}" class="blog-card-image" />
                    <div class="blog-card-content">
                        <div class="blog-card-title">${blog.title}</div>
                        <p class="blog-card-excerpt">${blogExcerpt}</p>
                    </div>
                </div>
            </a>
        `;
    }

    html += `</div></div>`;
    app.innerHTML = html;
  }

  async function renderBlogsList() {
    document.title = "All Blogs - My Blog";
    let html = `<div class="blogs-grid-section"><h2>All Blogs</h2><div class="blogs-grid">`;

    for (const blog of blogs) {
      const blogContent = await fetchMarkdownContent(blog.name);
      const blogExcerpt = blogContent
        ? extractExcerpt(blogContent, 2)
        : "Click to read more...";
      const firstImage = blogContent ? extractFirstImage(blogContent) : null;
      const blogImage =
        firstImage || generatePlaceholderImage(blog.title, "400x300");

      html += `
            <a href="#/${blog.name}" class="blog-card-link">
                <div class="blog-card">
                    <img src="${blogImage}" alt="${blog.title}" class="blog-card-image" />
                    <div class="blog-card-content">
                        <div class="blog-card-title">${blog.title}</div>
                        <p class="blog-card-excerpt">${blogExcerpt}</p>
                    </div>
                </div>
            </a>
        `;
    }

    html += `</div></div>`;
    app.innerHTML = html;
  }

  async function renderBlog(blogName) {
    app.innerHTML =
      '<div class="loading"><div class="spinner"></div><p>Loading blog...</p></div>';

    try {
      const response = await fetch(`./blogs/${blogName}.md`);
      if (!response.ok) {
        throw new Error("Blog not found");
      }
      const markdown = await response.text();
      const html = marked.parse(markdown);

      const blog = blogs.find((b) => b.name === blogName);
      if (blog) {
        document.title = `${blog.title} - My Blog`;
      }

      app.innerHTML = `<div class="markdown-body">${html}</div>`;
    } catch (error) {
      app.innerHTML = `
            <div class="error">
                <strong>Error:</strong> Could not load the blog "${blogName}". ${error.message}
            </div>
            <p><a href="#/">← Back to Home</a></p>
        `;
    }
  }

  function handleRoute() {
    const hash = window.location.hash.slice(1) || "/";
    const [, blogName] = hash.split("/");

    if (!blogName || hash === "/") {
      renderHome();
    } else if (hash === "/blogs") {
      renderBlogsList();
    } else {
      renderBlog(blogName);
    }
  }

  window.addEventListener("hashchange", handleRoute);

  handleRoute();

  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  for (const blog of blogs) {
    const blogContent = await fetchMarkdownContent(blog.name);
    const blogExcerpt = blogContent
      ? extractExcerpt(blogContent, 2)
      : "Click to read more...";
    const firstImage = blogContent ? extractFirstImage(blogContent) : null;
    const blogImage =
      firstImage || generatePlaceholderImage(blog.title, "400x300");

    html += `
      <a href="#/${blog.name}" class="blog-card-link">
        <div class="blog-card">
          <img src="${blogImage}" alt="${blog.title}" class="blog-card-image" />
          <div class="blog-card-content">
            <div class="blog-card-title">${blog.title}</div>
            <p class="blog-card-excerpt">${blogExcerpt}</p>
          </div>
        </div>
      </a>
    `;
  }

  html += `</div></div>`;
  app.innerHTML = html;
}

async function renderBlogsList() {
  document.title = "All Blogs - My Blog";
  let html = `<div class="blogs-grid-section"><h2>All Blogs</h2><div class="blogs-grid">`;
  for (const blog of blogs) {
    const blogContent = await fetchMarkdownContent(blog.name);
    const blogExcerpt = blogContent
      ? extractExcerpt(blogContent, 2)
      : "Click to read more...";
    const firstImage = blogContent ? extractFirstImage(blogContent) : null;
    const blogImage =
      firstImage || generatePlaceholderImage(blog.title, "400x300");

    html += `
      <a href="#/${blog.name}" class="blog-card-link">
        <div class="blog-card">
          <img src="${blogImage}" alt="${blog.title}" class="blog-card-image" />
          <div class="blog-card-content">
            <div class="blog-card-title">${blog.title}</div>
            <p class="blog-card-excerpt">${blogExcerpt}</p>
          </div>
        </div>
      </a>
    `;
  }

  html += `</div></div>`;
  app.innerHTML = html;
}

async function renderBlog(blogName) {
  app.innerHTML =
    '<div class="loading"><div class="spinner"></div><p>Loading blog...</p></div>';

  try {
    const response = await fetch(`./blogs/${blogName}.md`);
    if (!response.ok) {
      throw new Error("Blog not found");
    }
    const markdown = await response.text();
    const html = marked.parse(markdown);

    const blog = blogs.find((b) => b.name === blogName);
    if (blog) {
      document.title = `${blog.title} - My Blog`;
    }

    app.innerHTML = `<div class="markdown-body">${html}</div>`;
  } catch (error) {
    app.innerHTML = `
      <div class="error">
        <strong>Error:</strong> Could not load the blog "${blogName}". ${error.message}
      </div>
      <p><a href="#/">← Back to Home</a></p>
    `;
  }
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || "/";
  const [, blogName] = hash.split("/");

  if (!blogName || hash === "/") {
    renderHome();
  } else if (hash === "/blogs") {
    renderBlogsList();
  } else {
    renderBlog(blogName);
  }
}

window.addEventListener("hashchange", handleRoute);

handleRoute();

marked.setOptions({
  breaks: true,
  gfm: true,
});
