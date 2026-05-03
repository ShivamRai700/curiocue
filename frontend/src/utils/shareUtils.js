// Share utilities

export const generateShareText = (title) => {
  return `Check out "${title.title}" on CurioCue! ${title.summary || title.plot || title.description || ''}

#CurioCue #Recommendations`;
};

export const generateShareUrl = (titleId) => {
  const path = String(titleId).startsWith('book-')
    ? `/book/${titleId}`
    : `/title/${titleId}`;
  return `${window.location.origin}${path}`;
};

export const shareToTwitter = (title) => {
  const text = generateShareText(title);
  const url = generateShareUrl(title.id);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
};

export const shareToWhatsApp = (title) => {
  const text = generateShareText(title);
  const url = generateShareUrl(title.id);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
  window.open(whatsappUrl, '_blank');
};

export const copyToClipboard = async (title) => {
  const text = `${title.title} - ${generateShareUrl(title.id)}`;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const shareNative = (title) => {
  if (navigator.share) {
    navigator.share({
      title: `Check out ${title.title}`,
      text: title.summary || title.plot || title.description || '',
      url: generateShareUrl(title.id),
    });
  }
};
