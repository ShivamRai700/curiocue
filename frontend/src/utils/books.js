const BOOK_PLACEHOLDER = "https://placehold.co/500x750?text=No+Book+Cover";

export const cleanBookId = (id = "") => String(id).replace(/^book-/, "");

const getPrimaryIsbn = (book) => {
  const identifiers = Array.isArray(book?.industryIdentifiers) ? book.industryIdentifiers : [];
  const isbn13 = identifiers.find((item) => item?.type === "ISBN_13" && item?.identifier);
  const isbn10 = identifiers.find((item) => item?.type === "ISBN_10" && item?.identifier);
  const fallback = identifiers.find((item) => item?.identifier);

  return (isbn13 || isbn10 || fallback)?.identifier?.replace(/[^0-9Xx]/g, "") || null;
};

const getGooglePosterImage = (book) =>
  book?.sourceId
    ? `https://books.google.com/books/content?id=${book.sourceId}&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api`
    : null;

const getOpenLibraryImage = (book) => {
  const isbn = getPrimaryIsbn(book);
  return isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : null;
};

export const getBookImageCandidates = (book) => {
  const imageCandidates = [
    getOpenLibraryImage(book),
    getGooglePosterImage(book),
    book?.imageLinks?.extraLarge ||
    book?.imageLinks?.large ||
    book?.imageLinks?.medium ||
    book?.imageLinks?.thumbnail ||
    book?.thumbnail ||
    book?.image,
    BOOK_PLACEHOLDER,
  ].filter(Boolean);

  return [...new Set(imageCandidates)].map((image) =>
    image.replace("zoom=1", "zoom=2").replace("http://", "https://")
  );
};

export const getBestBookImage = (book) => getBookImageCandidates(book)[0] || BOOK_PLACEHOLDER;

export const BOOK_PLACEHOLDER_IMAGE = BOOK_PLACEHOLDER;
