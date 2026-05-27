/** iframe src with native toolbar hidden (download, print, etc.) */
export function pdfEmbedUrl(url: string, page?: number): string {
  const base = url.split('#')[0] ?? url
  const hashParts = ['toolbar=0', 'navpanes=0', 'statusbar=0']
  if (page != null && page > 0) {
    hashParts.unshift(`page=${page}`)
  }
  return `${base}#${hashParts.join('&')}`
}
