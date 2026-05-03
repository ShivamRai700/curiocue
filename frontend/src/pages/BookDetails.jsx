import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExplainSection from "../components/ExplainSection";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  addToHistory,
  isTitleSaved,
  removeTitleFromList,
  saveTitleToList,
} from "../utils/storage";
import { copyToClipboard, shareNative } from "../utils/shareUtils";
import { getAIExplanation, getBookDetails, handleApiError } from "../utils/api";
import {
  BOOK_PLACEHOLDER_IMAGE,
  cleanBookId,
  getBookImageCandidates,
} from "../utils/books";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const WIKIPEDIA_NAME_PATTERN = /^[A-Za-z][A-Za-z\s.'-]{1,120}$/;
const SCREEN_LANGUAGE_REGEX =
  /\b(film|movie|cinematic|screen|watch|watching|viewing|episode|director|performance|scene|adaptation|show)\b/i;

const buildFallbackExplanation = (book) => {
  const descriptionText = stripHtml(book.description || "");
  const summarySource =
    descriptionText || "This book does not have a publisher summary yet.";
  const themes =
    Array.isArray(book.categories) && book.categories.length > 0
      ? book.categories.slice(0, 4)
      : [book.languageLabel || "General fiction or nonfiction"];

  const valuePoints = [
    book.pageCount ? `${book.pageCount} pages of material` : null,
    book.publisher ? `published by ${book.publisher}` : null,
    typeof book.averageRating === "number"
      ? `rated ${book.averageRating.toFixed(1)} by readers`
      : null,
  ].filter(Boolean);

  return {
    summary: summarySource,
    themes,
    whyWorthIt:
      valuePoints.length > 0
        ? `It stands out for ${valuePoints.join(", ")}.`
        : "It is worth exploring if the subject, author, or premise matches what you want to read next.",
    readingStyle: book.maturityRating
      ? `Reading profile: ${book.maturityRating}.`
      : book.categories?.length
        ? `Best for readers interested in ${book.categories.slice(0, 2).join(" and ")}.`
        : null,
  };
};

const buildIntroductionFallback = (book) => {
  const authors =
    Array.isArray(book.authors) && book.authors.length > 0
      ? book.authors.join(", ")
      : "an unknown author";
  const categories =
    Array.isArray(book.categories) && book.categories.length > 0
      ? book.categories.slice(0, 2).join(" and ")
      : "literature";
  const publishedLine = book.publishedDate
    ? ` first published in ${book.publishedDate}`
    : "";
  const publisherLine = book.publisher ? ` by ${book.publisher}` : "";
  const pagesLine = book.pageCount
    ? ` This edition spans ${book.pageCount} pages`
    : "";
  const ratingLine =
    typeof book.averageRating === "number"
      ? ` and holds a reader rating of ${book.averageRating.toFixed(1)}`
      : "";

  return `${book.title} by ${authors} is a notable ${categories} book${publishedLine}${publisherLine}.${pagesLine}${ratingLine} It stands out for its literary presence, enduring themes, and the kind of reading experience that stays with you after the final page.`;
};

const infoChips = (book) => [
  book.publishedDate ? `Published: ${book.publishedDate}` : null,
  book.pageCount ? `Pages: ${book.pageCount}` : null,
  book.publisher ? `Publisher: ${book.publisher}` : null,
  typeof book.averageRating === "number"
    ? `Rating: ${book.averageRating.toFixed(1)}`
    : null,
  typeof book.ratingsCount === "number"
    ? `Ratings: ${book.ratingsCount}`
    : null,
];

export default function BookDetails() {
  const { id } = useParams();
  const cleanId = cleanBookId(id);

  const [book, setBook] = useState(null);
  const [explanations, setExplanations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingIntroduction, setLoadingIntroduction] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coverImage, setCoverImage] = useState(BOOK_PLACEHOLDER_IMAGE);
  const [generatedIntroduction, setGeneratedIntroduction] = useState("");

  useEffect(() => {
    fetchDetails();
  }, [cleanId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getBookDetails(cleanId);
      const bookData = res?.data?.data || null;

      setBook(bookData);
      setCoverImage(
        bookData
          ? getBookImageCandidates(bookData)[0] || BOOK_PLACEHOLDER_IMAGE
          : BOOK_PLACEHOLDER_IMAGE,
      );
      setIsSaved(bookData ? isTitleSaved(bookData.id) : false);
      setExplanations(null);
      setShowExplanation(false);
      setGeneratedIntroduction("");
      setLoadingIntroduction(false);

      if (bookData) {
        addToHistory(bookData);
      }
    } catch (err) {
      setBook(null);
      setGeneratedIntroduction("");
      setLoadingIntroduction(false);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const shouldGenerateIntroduction =
      book && !book.description && !book.longDescription;

    if (!shouldGenerateIntroduction) {
      setGeneratedIntroduction("");
      setLoadingIntroduction(false);
      return;
    }

    let cancelled = false;

    const generateIntroduction = async () => {
      try {
        setLoadingIntroduction(true);
        const res = await getAIExplanation(book.title, "", cleanId, {
          contentType: "book",
          purpose: "introduction",
          authors: book.authors,
          categories: book.categories,
          publishedDate: book.publishedDate,
        });

        if (cancelled) return;

        const summary = res?.data?.data?.summary?.trim();
        const safeSummary =
          summary && !SCREEN_LANGUAGE_REGEX.test(summary)
            ? summary
            : buildIntroductionFallback(book);
        setGeneratedIntroduction(safeSummary);
      } catch (_) {
        if (!cancelled) {
          setGeneratedIntroduction(buildIntroductionFallback(book));
        }
      } finally {
        if (!cancelled) {
          setLoadingIntroduction(false);
        }
      }
    };

    generateIntroduction();

    return () => {
      cancelled = true;
    };
  }, [book, cleanId]);

  const handleExplain = async () => {
    if (!book || loadingExplain) return;

    try {
      setShowExplanation(true);
      setLoadingExplain(true);

      const res = await getAIExplanation(
        book.title,
        stripHtml(book.description || ""),
        cleanId,
        {
          contentType: "book",
          authors: book.authors,
          categories: book.categories,
          publishedDate: book.publishedDate,
        },
      );

      setExplanations(res?.data?.data || buildFallbackExplanation(book));
    } catch (err) {
      console.error("Book explanation failed:", err);
      setExplanations(buildFallbackExplanation(book));
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleSave = () => {
    if (!book) return;

    if (isSaved) {
      removeTitleFromList(book.id);
    } else {
      saveTitleToList(book);
    }

    setIsSaved(!isSaved);
  };

  const handleCopy = async () => {
    if (!book) return;

    const success = await copyToClipboard(book);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const primaryAuthor =
    Array.isArray(book?.authors) && book.authors.length > 0
      ? book.authors[0]
      : null;
  const authorLink =
    primaryAuthor && WIKIPEDIA_NAME_PATTERN.test(primaryAuthor)
      ? `https://en.wikipedia.org/wiki/${encodeURIComponent(primaryAuthor.replace(/\s+/g, "_"))}`
      : null;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Book not found</p>
          <button onClick={fetchDetails} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12 text-slate-300">Book not found</div>
      </div>
    );
  }

  const imageCandidates = getBookImageCandidates(book);
  const currentCoverIndex = imageCandidates.indexOf(coverImage);
  const hasDescription = Boolean(book.description || book.longDescription);
  const introductionText = hasDescription
    ? null
    : generatedIntroduction || buildIntroductionFallback(book);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="grid md:grid-cols-[280px,1fr] gap-8 items-start">
        <div>
          <img
            src={coverImage}
            alt={book.title}
            className="w-full max-w-[280px] rounded-xl shadow-2xl ring-1 ring-white/10 bg-slate-800 object-cover"
            onLoad={(e) => {
              const img = e.target;
              const ratio = img.naturalWidth / img.naturalHeight;

              // 🚨 If image is too wide → it's not a real book cover
              if (ratio > 1.2) {
                img.onerror = null;
                img.src = BOOK_PLACEHOLDER_IMAGE;
                setCoverImage(BOOK_PLACEHOLDER_IMAGE);
              }
            }}
            onError={(event) => {
              event.target.onerror = null;

              const nextImage = imageCandidates[currentCoverIndex + 1];

              if (nextImage) {
                setCoverImage(nextImage);
                event.target.src = nextImage;
              } else {
                event.target.src = BOOK_PLACEHOLDER_IMAGE;
                setCoverImage(BOOK_PLACEHOLDER_IMAGE);
              }
            }}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge">Book</span>
              {book.maturityRating && (
                <span className="badge">{book.maturityRating}</span>
              )}
              {book.languageLabel && (
                <span className="badge">{book.languageLabel}</span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-xl text-slate-300 mb-3">{book.subtitle}</p>
            )}
            {Array.isArray(book.authors) && book.authors.length > 0 && (
              <p className="text-lg text-slate-300">
                by {book.authors.join(", ")}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {infoChips(book)
              .filter(Boolean)
              .map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-200"
                >
                  {item}
                </div>
              ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleSave} className="btn-primary">
              {isSaved ? "Saved" : "Save"}
            </button>
            <button onClick={() => shareNative(book)} className="btn-secondary">
              Share
            </button>
            <button onClick={handleCopy} className="btn-secondary">
              {copied ? "Copied" : "Copy Link"}
            </button>
            <button
              onClick={handleExplain}
              className="btn-primary bg-indigo-600 hover:bg-indigo-500"
            >
              Explain Better
            </button>
            {authorLink && (
              <a
                href={authorLink}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                Know more about author
              </a>
            )}
          </div>

          {loadingExplain && (
            <p className="text-indigo-400">
              Building a clearer reading guide...
            </p>
          )}

          {!showExplanation && !loadingExplain && (
            <p className="text-sm text-slate-400">
              Use Explain Better for a simple summary, major themes, and why
              this book is worth reading.
            </p>
          )}

          {Array.isArray(book.categories) && book.categories.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category) => (
                  <span key={category} className="badge">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(book.authors) && book.authors.length > 0 && (
            <div className="card detail-card p-6">
              <h2 className="text-2xl font-bold mb-4">Author</h2>
              <p className="text-slate-300 leading-relaxed">
                {book.authors.join(", ")}
              </p>
            </div>
          )}

          <div className="card detail-card p-6">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            {hasDescription ? (
              <div
                className="text-slate-300 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{
                  __html: book.description || book.longDescription,
                }}
              />
            ) : loadingIntroduction ? (
              <p className="text-slate-400 leading-relaxed">
                Preparing a fuller introduction...
              </p>
            ) : (
              <p className="text-slate-300 leading-relaxed">
                {introductionText}
              </p>
            )}
          </div>

          {(book.industryIdentifiers?.length > 0 ||
            book.previewLink ||
            book.infoLink) && (
            <div className="card detail-card p-6">
              <h2 className="text-2xl font-bold mb-4">More Details</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-slate-300">
                {book.industryIdentifiers?.map((identifier) => (
                  <div key={`${identifier.type}-${identifier.identifier}`}>
                    {identifier.type}: {identifier.identifier}
                  </div>
                ))}
                {book.previewLink && (
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-300 hover:text-indigo-200"
                  >
                    Preview on Google Books
                  </a>
                )}
                {book.infoLink && (
                  <a
                    href={book.infoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-300 hover:text-indigo-200"
                  >
                    View full Google Books listing
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showExplanation && explanations && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Explain Better</h2>
          <ExplainSection explanations={explanations} contentType="book" />
        </div>
      )}
    </div>
  );
}
