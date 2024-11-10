let origin

if (import.meta.env.MODE === 'production') {
  origin = location.origin
} else {
  origin = 'http://localhost:4000'
}

export { origin }
