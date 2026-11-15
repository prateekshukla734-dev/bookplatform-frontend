
import { useEffect, useState } from 'react'
import { getAuthor } from '../services/authorService'

function AuthorSection() {
  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await getAuthor('anuj-tiwari')
        setAuthor(data)
      } catch (err) {
        console.error('Failed to fetch author:', err)
        setError('Unable to load author information.')
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [])

  if (loading) {
    return (
      <section
        id="author"
        className="bg-[#211f20] px-6 py-24 text-center text-[#f5f0e8]"
      >
        Loading author information...
      </section>
    )
  }

  if (error || !author) {
    return (
      <section
        id="author"
        className="bg-[#211f20] px-6 py-24 text-center text-[#f5f0e8]"
      >
        {error || 'Author not found.'}
      </section>
    )
  }

  return (
    <section
      id="author"
      className="bg-[#211f20] px-6 py-24 text-[#f5f0e8]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">

        <div className="mx-auto flex h-72 w-72 items-center justify-center rounded-full border border-[#e9b348]/40 bg-[#302d2c]">
          <span className="font-serif text-7xl text-[#e9b348]">
            AT
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#e9b348]">
            Meet the Author
          </p>

          <h2 className="mt-5 font-serif text-5xl">
            {author.name}
          </h2>

          <p className="mt-7 whitespace-pre-line text-base leading-8 text-stone-400">
            {author.biography}
          </p>

          <div className="mt-8">
            <a
              href="#books"
              className="inline-block border border-[#e9b348] px-6 py-3 text-sm text-[#e9b348] transition hover:bg-[#e9b348] hover:text-black"
            >
              Explore His Books
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AuthorSection
