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

function getApiKey() {
  return fetch("/api/key")
    .then((response) => response.json())
    .then((data) => data.apiKey) // extract API key from response
    .catch((err) => {
      console.error("Error fetching API key:", err);
      throw new Error("Unable to fetch API key");
    });
}

function fetchAndProcessArticles() {
  // fetch API key
  getApiKey()
    .then((apiKey) => {
      // Construct the BASE_URL using the API key fetched from the backend
      const BASE_URL =
        `https://api.nytimes.com/svc/search/v2/articlesearch.json` +
        `?fq=timesTag.location:(%22Davis%22%20%22Sacramento%22)` +
        `&sort=newest` +
        `&page=0` +
        `&api-key=${apiKey}`;

      // fetch articles
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

            // Create image
            const image = document.createElement("img");
            const imageFromArray = imagePaths[idx % imagePaths.length]; // Circular fallback
            image.src = imageFromArray;
            image.alt = "Article Image";
            image.classList.add("article-image");
            articleContainer.appendChild(image);

            // Create header
            const header = document.createElement("h1");
            header.textContent = article.headline.main;
            header.classList.add("article-header");
            articleContainer.appendChild(header);

            // Create paragraph (summary or excerpt)
            const paragraph = document.createElement("p");
            paragraph.textContent =
              article.abstract || "No description available.";
            paragraph.classList.add("article-paragraph");
            articleContainer.appendChild(paragraph);

            gridContainer.appendChild(articleContainer);
            imageGrid.appendChild(gridContainer);
          });
        })
        .catch((err) => {
          showError(`Fetch failed: ${err.message}`);
        });
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}

fetchAndProcessArticles();
