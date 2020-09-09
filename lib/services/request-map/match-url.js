import UrlGlob from 'url-glob'

export default (urlExp, url) => new UrlGlob(urlExp).match(url)
