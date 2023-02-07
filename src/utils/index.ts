export const isDev = document.location.hostname === 'localhost';
export const siteUrl = isDev ? 'http://localhost:3001' : 'https://www.konstnarscentrum.org'