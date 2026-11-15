
import { useEffect, useState } from 'react'
import { getBookBySlug } from '../services/bookService'

function FeaturedBook() {
  const [book, setBook] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState('paperback')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFeaturedBook = async () => {
      try {
        const data = await getBookBySlug(
          'why-men-cant-hug-their-fathers'
        )

        setBook(data)
      } catch (err) {
        console.error('Failed to fetch featured book:', err)
        setError('Unable to load featured book.')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedBook()
  }, [])

  if (loading) {
    return (
      <section
        id="featured-book"
        className="bg-[#17171b] px-6 py-24 text-center text-[#f5f0e8]"
      >
        Loading featured book...
      </section>
    )
  }

  if (error || !book) {
    return (
      <section
        id="featured-book"
        className="bg-[#17171b] px-6 py-24 text-center text-[#f5f0e8]"
      >
        {error || 'Featured book not found.'}
      </section>
    )
  }

  const paperback = book.editions.find(
    edition => edition.type === 'paperback' && edition.enabled
  )

  const pdf = book.editions.find(
    edition => edition.type === 'pdf' && edition.enabled
  )

  const coverUrl = book.coverImage
    ? `${import.meta.env.VITE_API_URL}${book.coverImage}`
    : null

  return (
    <section
      id="featured-book"
      className="bg-[#17171b] px-6 py-24 text-[#f5f0e8]"
    >

      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">

        {/* Book cover */}
        <div className="flex justify-center">
          {coverUrl && (
            <img
              src={coverUrl}
              alt={`${book.title} by ${book.authorId?.name || book.author}`}
              className="w-full max-w-sm rounded-sm shadow-2xl shadow-black/50"
            />
          )}
        </div>

        {/* Book details */}
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#e9b348]">
            Featured Book
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
            {book.title}
          </h2>

          <p className="mt-5 leading-8 text-stone-400">
            {book.subtitle}
          </p>

          <div className="mt-8 flex gap-6 border-y border-stone-700 py-5 text-sm">
            <div>
              <p className="text-stone-500">Author</p>
              <p className="mt-1">
                {book.authorId?.name || book.author}
              </p>
            </div>

            <div>
              <p className="text-stone-500">Pages</p>
              <p className="mt-1">{book.pages}</p>
            </div>

            <div>
              <p className="text-stone-500">Language</p>
              <p className="mt-1">{book.language}</p>
            </div>
          </div>

          <h3 className="mt-8 text-sm uppercase tracking-widest text-stone-400">
            Choose your edition
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3">

            {paperback && (
              <button
                onClick={() => setSelectedFormat('paperback')}
                className={`border p-4 text-left transition ${
                  selectedFormat === 'paperback'
                    ? 'border-[#e9b348] bg-[#e9b348]/10'
                    : 'border-stone-700 hover:border-stone-400'
                }`}
              >
                <p className="font-medium">Paperback</p>

                <p className="mt-2 text-xl text-[#e9b348]">
                  ₹{paperback.priceIndia}
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  Printed edition
                </p>
              </button>
            )}

            {pdf && (
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`border p-4 text-left transition ${
                  selectedFormat === 'pdf'
                    ? 'border-[#e9b348] bg-[#e9b348]/10'
                    : 'border-stone-700 hover:border-stone-400'
                }`}
              >
                <p className="font-medium">Digital PDF</p>

                <p className="mt-2 text-xl text-[#e9b348]">
                  ₹{pdf.priceIndia} / ${pdf.priceInternational}
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  Instant digital access
                </p>
              </button>
            )}

          </div>

          <button
            disabled
            className="mt-7 w-full bg-[#e9b348] px-6 py-4 font-semibold text-black opacity-70"
          >
            Checkout coming soon
          </button>

          <p className="mt-4 text-center text-xs text-stone-500">
            {selectedFormat === 'paperback'
              ? 'Selected: Paperback edition'
              : 'Selected: Digital PDF edition'}
          </p>

        </div>
      </div>
    </section>
  )
}

export default FeaturedBook
