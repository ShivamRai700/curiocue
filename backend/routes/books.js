import express from "express";

const router = express.Router();

const toHttpsImage = (url) =>
  url ? url.replace(/^http:\/\//i, "https://") : null;

const enhanceBookImage = (url) =>
  toHttpsImage(url)?.replace("zoom=1", "zoom=2") || null;

const pickCoverImage = (imageLinks = {}) =>
  enhanceBookImage(
    imageLinks.extraLarge ||
      imageLinks.large ||
      imageLinks.medium ||
      imageLinks.thumbnail ||
      imageLinks.smallThumbnail ||
      null
  );

const buildBookResponse = (data) => {
  const volumeInfo = data.volumeInfo || {};
  const saleInfo = data.saleInfo || {};
  const accessInfo = data.accessInfo || {};

  return {
    id: `book-${data.id}`,
    sourceId: data.id,
    type: "book",
    typeLabel: "Book",
    title: volumeInfo.title || "Unknown Title",
    subtitle: volumeInfo.subtitle || null,
    authors: Array.isArray(volumeInfo.authors) ? volumeInfo.authors : [],
    description: volumeInfo.description || "",
    imageLinks: volumeInfo.imageLinks || {},
    thumbnail: pickCoverImage(volumeInfo.imageLinks),
    publishedDate: volumeInfo.publishedDate || null,
    publishedYear: volumeInfo.publishedDate?.split("-")[0] || null,
    categories: Array.isArray(volumeInfo.categories) ? volumeInfo.categories : [],
    pageCount: volumeInfo.pageCount || null,
    averageRating: typeof volumeInfo.averageRating === "number" ? volumeInfo.averageRating : null,
    ratingsCount: typeof volumeInfo.ratingsCount === "number" ? volumeInfo.ratingsCount : null,
    publisher: volumeInfo.publisher || null,
    language: volumeInfo.language || null,
    languageLabel: volumeInfo.language ? volumeInfo.language.toUpperCase() : null,
    maturityRating: accessInfo.accessViewStatus || volumeInfo.maturityRating || null,
    previewLink: volumeInfo.previewLink || null,
    infoLink: volumeInfo.infoLink || null,
    canonicalVolumeLink: volumeInfo.canonicalVolumeLink || null,
    industryIdentifiers: Array.isArray(volumeInfo.industryIdentifiers)
      ? volumeInfo.industryIdentifiers.map((identifier) => ({
          type: identifier.type || "Identifier",
          identifier: identifier.identifier || "",
        }))
      : [],
    readingModes: volumeInfo.readingModes || {},
    saleability: saleInfo.saleability || null,
    webReaderLink: accessInfo.webReaderLink || null,
  };
};

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sourceId = id.startsWith("book-") ? id.replace("book-", "") : id;
    const url = `https://www.googleapis.com/books/v1/volumes/${sourceId}${process.env.GOOGLE_BOOKS_API_KEY ? `?key=${process.env.GOOGLE_BOOKS_API_KEY}` : ""}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.error) {
      return res.status(404).json({
        success: false,
        error: { message: "Book not found" },
      });
    }

    res.json({
      success: true,
      data: buildBookResponse(data),
    });
  } catch (error) {
    console.error("Book error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch book" },
    });
  }
});

export default router;
