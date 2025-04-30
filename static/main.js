const BASE_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=timesTag.location:(%22Davis%22%20%22Sacramento%22)&page=0&api-key=RmyDhz4NtjXQMhBO6eTE1FAs7l31AXoJ`;

const imageGrid = document.getElementById("image-grid");

const imagePaths = [
  "/static/assets/image1.jpg",
  "/static/assets/image2.jpg",
  "/static/assets/image3.jpg",
  "/static/assets/image4.jpg",
  "/static/assets/image5.jpg",
  "/static/assets/image6.jpg",
  "/static/assets/image7.jpg",
  "/static/assets/image8.jpg",
  "/static/assets/image9.jpg",
];

function fetchAndProcessArticles() {
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((data) => {
      const articles = data.response.docs;
      console.log(data);
      console.log(`🎉 Retrieved ${articles.length} article(s):`);
      articles.forEach((article, idx) => {
        if (idx === 9) return;
        const gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container");

        const articleContainer = document.createElement("div");
        articleContainer.classList.add("article-container");

        // create image
        const image = document.createElement("img");
        const imageFromArray = imagePaths[idx % imagePaths.length]; // This ensures a circular fallback
        image.src = imageFromArray;
        image.alt = "Article Image";
        image.classList.add("article-image"); // Optional class for styling
        articleContainer.appendChild(image);

        // Create the header
        const header = document.createElement("h1");
        header.textContent = article.headline.main;
        header.classList.add("article-header");
        articleContainer.appendChild(header);

        // // Create a small paragraph (summary or excerpt)
        const paragraph = document.createElement("p");
        paragraph.textContent = article.abstract || "No description available."; // Use abstract or fallback text
        paragraph.classList.add("article-paragraph"); // Optional class for styling
        articleContainer.appendChild(paragraph);

        gridContainer.appendChild(articleContainer);
        // Append the article container to the grid
        imageGrid.appendChild(gridContainer);
      });
    })
    .catch((err) => {
      showError(`Fetch failed: ${err.message}`);
    });
}

fetchAndProcessArticles();
