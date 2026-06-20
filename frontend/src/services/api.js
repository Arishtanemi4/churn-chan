const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const get = (path) => fetch(`${BASE_URL}${path}`).then((r) => r.json())

const post = (path, body) =>
  fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((r) => r.json())

export const api = {
  health: () => get('/health'),
  personas: () => get('/personas'),
  simulate: (payload) => post('/simulate', payload),
}
