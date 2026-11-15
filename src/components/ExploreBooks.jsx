
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBooks } from '../services/bookService'

function ExploreBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks()

        const formattedBooks = data.map(book => {
          const formats = {}

          book.editions.forEach(edition => {
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

          return {
            id: book.slug,
            title: book.title,
            subtitle: book.subtitle,
            author: book.authorId?.name || book.author,
            cover: book.coverImage
              ? `${import.meta.env.VITE_API_URL}${book.coverImage}`
              : null,
            formats,
            status: book.status
          }
        })

        setBooks(formattedBooks)
      } catch (err) {
        console.error('Failed to fetch books:', err)
        setError('Unable to load books. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const publishedBooks = books.filter(
    book => book.status === 'published'
  )

  if (loading) {
    return (
      <section className="bg-[#17171b] px-6 py-24 text-center text-[#f5f0e8]">
        Loading books...
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-[#17171b] px-6 py-24 text-center text-red-400">
        {error}
      </section>
    )
  }

  return (
    <section
      id="books"
      className="bg-[#17171b] px-6 py-24 text-[#f5f0e8]"
    >
      <div className="mx-auto max-w-7xl">

        <p className="text-sm uppercase tracking-[0.3em] text-[#e9b348]">
          The Collection
        </p>

        <h2 className="mt-4 font-serif text-4xl md:text-5xl">
          Explore Books
        </h2>

        <p className="mt-4 max-w-xl text-stone-400">
          Discover ideas, stories and conversations
          from independent authors.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {publishedBooks.map(book => {
            const availableEditions = Object.entries(book.formats)
              .filter(([, format]) => format.enabled)

            const lowestIndiaPrice = availableEditions
              .map(([type, format]) => ({
                type,
                price: type === 'pdf'
                  ? format.price.IN
                  : format.price
              }))
              .filter(edition => typeof edition.price === 'number')
              .sort((a, b) => a.price - b.price)[0]

            return (
              <article key={book.id} className="group">

                <div className="overflow-hidden bg-[#25252a]">
                  {book.cover && (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="mx-auto h-[390px] w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-widest text-[#e9b348]">
                    {book.author}
                  </p>

                  <h3 className="mt-2 font-serif text-2xl">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-400">
                    {book.subtitle}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableEditions.map(([type]) => (
                      <span
                        key={type}
                        className="border border-stone-600 px-2 py-1 text-xs uppercase tracking-wider text-stone-400"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg text-[#e9b348]">
                      {lowestIndiaPrice
                        ? `₹${lowestIndiaPrice.price}`
                        : 'Price unavailable'}
                    </span>

                    <Link
                      to={`/books/${book.id}`}
                      className="border border-stone-600 px-4 py-2 text-xs uppercase tracking-wider transition hover:border-[#e9b348] hover:text-[#e9b348]"
                    >
                      View Book
                    </Link>
                  </div>
                </div>

              </article>
            )
          })}

        </div>
      </div>
    </section>
  )
}

export default ExploreBooks
