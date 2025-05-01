/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

// 2) Then pull in your functions (the import will no longer crash):
const { getApiKey, fetchAndProcessArticles } = require("../static/main.js");

beforeEach(() => {
  document.body.innerHTML = `
  <div id ="image-grid" class="main-container"></div>
  `;
  global.fetch = jest.fn();
});

describe("getApiKey()", () => {
  it("fetches from /api/key and returns apiKey", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ apiKey: "FAKE_KEY" }),
    });

    const key = await getApiKey();
    expect(key).toBe("FAKE_KEY");
    expect(fetch).toHaveBeenCalledWith("/api/key");
  });
});

describe("fetchAndProcessArticles()", () => {
  it("renders a fake article into the DOM", async () => {
    // first fetch → API key
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ apiKey: "FKEY" }),
      })
      // second fetch → NYT payload
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            response: {
              docs: [
                {
                  headline: { main: "My Test Title" },
                  abstract: "Some cool abstract",
                  multimedia: [{ url: "img1.jpg" }],
                  web_url: "http://example.com",
                },
              ],
            },
          }),
      });

    await fetchAndProcessArticles();

    const header = document.querySelector(".article-header");
    const para = document.querySelector(".article-paragraph");
    expect(header.textContent).toBe("My Test Title");
    expect(para.textContent).toBe("Some cool abstract");
  });

  it("calls NYT with the Davis/Sacramento filter in the URL", async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ apiKey: "FKEY" }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ response: { docs: [] } }),
      });

    await fetchAndProcessArticles();

    // the second fetch call is index 1
    const calledUrl = fetch.mock.calls[1][0];
    expect(calledUrl).toMatch(
      /^https:\/\/api\.nytimes\.com\/svc\/search\/v2\/articlesearch\.json/
    );
    expect(calledUrl).toMatch(
      /fq=timesTag\.location:\(%22Davis%22%20%22Sacramento%22\)/
    );
  });

  it("validates that NYT payload has title, url, multimedia & abstract", async () => {
    const goodDoc = {
      headline: { main: "T" },
      web_url: "u",
      multimedia: [],
      abstract: "A",
    };
    // simulate API key + payload
    fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve({ apiKey: "K" }) })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ response: { docs: [goodDoc] } }),
      });

    await fetchAndProcessArticles();

    // we know payload docs[0] was our goodDoc
    expect(goodDoc.headline.main).toEqual(expect.any(String));
    expect(goodDoc.web_url).toEqual(expect.stringContaining(""));
    expect(Array.isArray(goodDoc.multimedia)).toBe(true);
    expect(goodDoc.abstract).toEqual(expect.any(String));
  });
});
