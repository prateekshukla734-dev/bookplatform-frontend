//import { ArrowRight } from 'lucide-react'

function Hero() {
  return (
    <section
      id="home"
      className="bg-[#faf9f6] px-6 py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl">

        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-amber-800">
          Independent Voices · Extraordinary Stories
        </p>

        <h1 className="max-w-4xl font-serif text-5xl leading-tight text-stone-900 md:text-7xl">
          Some emotions are
          <span className="italic text-amber-800">
            {' '}never spoken.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600">
          Explore the unspoken emotions, relationships and stories
          that shape our lives through the writing of independent authors.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">

          <a
            href="#books"
            className="flex items-center gap-3 bg-stone-900 px-7 py-4 text-sm text-white transition hover:bg-amber-900"
          >
            Explore Books
            →
          </a>

          <a
            href="#author"
            className="border border-stone-300 px-7 py-4 text-sm text-stone-800 transition hover:bg-stone-100"
          >
            Meet the Authors
          </a>

        </div>

      </div>
    </section>
  )
}

export default Hero