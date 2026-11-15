
import { useCart } from '../context/CartContext'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBookBySlug } from '../services/bookService'

function BookDetails() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError('')

        const backendBook = await getBookBySlug(slug)

        if (!backendBook) {
          setBook(null)
          return
        }

        // Convert backend editions into frontend formats.
        const formats = {}

        backendBook.editions.forEach(edition => {
          formats[edition.type] = {
            enabled: edition.enabled,
            price:
              edition.type === 'pdf'
                ? {
                    IN: edition.priceIndia,
                    INTERNATIONAL: edition.priceInternational
                  }
                : edition.priceIndia
          }
        })

        const formattedBook = {
          id: backendBook.slug,
          title: backendBook.title,
          subtitle: backendBook.subtitle,
          author: backendBook.authorId?.name || backendBook.author,
          authorBiography: backendBook.authorId?.biography || '',
          cover: backendBook.coverImage
            ? `${import.meta.env.VITE_API_URL}${backendBook.coverImage}`
            : null,
          description: backendBook.description,
          isbn: backendBook.isbn,
          pages: backendBook.pages,
          language: backendBook.language,
          dimensions: backendBook.dimensions,
          formats,
          status: backendBook.status
        }

        setBook(formattedBook)

        // Automatically select the first enabled edition.
        const availableFormat = Object.entries(formats).find(
          ([, details]) => details.enabled
        )

        setSelectedFormat(availableFormat ? availableFormat[0] : '')

      } catch (err) {
        if (err.response?.status === 404) {
          setBook(null)
        } else {
          console.error('Failed to fetch book:', err)
          setError('Unable to load book details. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17171b] p-10 text-center text-[#f5f0e8]">
        Loading book details...
      </div>
    )
  }

  if (error || !book || book.status !== 'published') {
    return (
      <div className="min-h-screen bg-[#17171b] p-10 text-center text-[#f5f0e8]">
        <h1 className="font-serif text-3xl">
          {error || 'Book not found'}
        </h1>

        <Link to="/" className="mt-6 inline-block text-[#e9b348]">
          Return Home
        </Link>
      </div>
    )
  }

  // Get all enabled editions.
  const availableFormats = Object.entries(book.formats).filter(
    ([, details]) => details.enabled
  )

  const selectedDetails = book.formats[selectedFormat]

  // Indian price for now. International pricing will be handled
  // through the payment and checkout flow.
  const selectedPrice =
    selectedFormat === 'pdf'
      ? selectedDetails?.price.IN
      : selectedDetails?.price

  return (
    <div className="min-h-screen bg-[#17171b] text-[#f5f0e8]">

      {/* Navigation */}
      <nav className="border-b border-stone-800 px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="font-serif text-2xl">
            ANUJ TIWARI<span className="text-[#e9b348]">.</span>
          </Link>

          <Link to="/" className="text-sm text-stone-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Product */}
      <main className="mx-auto grid max-w-6xl items-start gap-14 px-6 py-20 md:grid-cols-2">

        {/* Cover */}
        <div className="flex justify-center bg-[#211f20] p-8">
          {book.cover && (
            <img
              src={book.cover}
              alt={book.title}
              className="w-full max-w-sm object-contain shadow-2xl"
            />
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#e9b348]">
            A Book by {book.author}
          </p>

          <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            {book.title}
          </h1>

          <p className="mt-4 text-lg text-stone-400">
            {book.subtitle}
          </p>

          <div className="mt-8 border-y border-stone-700 py-6">
            <p className="text-sm leading-8 text-stone-300 whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="mt-7 grid grid-cols-2 gap-5 text-sm">
            {book.pages && (
              <div>
                <p className="text-stone-500">Pages</p>
                <p className="mt-1">{book.pages}</p>
              </div>
            )}

            <div>
              <p className="text-stone-500">Author</p>
              <p className="mt-1">{book.author}</p>
            </div>

            {book.language && (
              <div>
                <p className="text-stone-500">Language</p>
                <p className="mt-1">{book.language}</p>
              </div>
            )}

            {book.isbn && (
              <div>
                <p className="text-stone-500">ISBN</p>
                <p className="mt-1">{book.isbn}</p>
              </div>
            )}

            {book.dimensions && (
              <div>
                <p className="text-stone-500">Dimensions</p>
                <p className="mt-1">{book.dimensions}</p>
              </div>
            )}
          </div>

          {/* Format selection */}
          <div className="mt-10">
            <h2 className="text-sm uppercase tracking-widest text-stone-400">
              Select your edition
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

              {availableFormats.map(([format, details]) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`border p-4 text-left capitalize transition ${
                    selectedFormat === format
                      ? 'border-[#e9b348] bg-[#e9b348]/10'
                      : 'border-stone-700 hover:border-stone-400'
                  }`}
                >
                  <p>{format}</p>

                  <p className="mt-3 font-semibold text-[#e9b348]">
                    {format === 'pdf'
                      ? `₹${details.price.IN} / $${details.price.INTERNATIONAL}`
                      : `₹${details.price}`}
                  </p>
                </button>
              ))}

              {availableFormats.length === 0 && (
                <p className="text-sm text-stone-400">
                  No editions are currently available.
                </p>
              )}

            </div>
          </div>

          {/* Price and Actions */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            <button
              disabled={!selectedFormat || selectedPrice == null}
              onClick={() => {
                addToCart(book, selectedFormat, selectedPrice)
                alert('Book added to cart!')
              }}
              className="flex-1 border border-[#e9b348] px-6 py-4 text-[#e9b348] transition hover:bg-[#e9b348] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              ADD TO CART
            </button>

            <button
              disabled={!selectedFormat || selectedPrice == null}
              onClick={() => {
                addToCart(book, selectedFormat, selectedPrice)
                navigate('/cart')
              }}
              className="flex-1 bg-[#e9b348] px-6 py-4 font-semibold text-black transition hover:bg-[#d5a13c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              BUY NOW
            </button>

          </div>

          <p className="mt-5 text-xs leading-6 text-stone-500">
            PDF editions will be delivered digitally after successful payment.
            Physical editions will be shipped to your delivery address.
          </p>

        </div>
      </main>
    </div>
  )
}

export default BookDetails
