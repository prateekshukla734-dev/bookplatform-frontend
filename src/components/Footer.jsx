
function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#111113] px-6 py-16 text-[#f5f0e8]"
    >
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">

        <div>
          <h2 className="font-serif text-3xl">
            THE AUTHORS' SHELF<span className="text-[#e9b348]">.</span>
          </h2>

          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
            A space for independent authors, meaningful stories
            and conversations that deserve to be heard.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#e9b348]">
            Explore
          </h3>

          <div className="mt-6 flex flex-col gap-4 text-sm text-stone-400">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#books" className="hover:text-white">Explore Books</a>
            <a href="#author" className="hover:text-white">Authors</a>
            <a href="#featured-book" className="hover:text-white">Featured Book</a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#e9b348]">
            Connect
          </h3>

          <div className="mt-6 flex flex-col gap-4 text-sm text-stone-400">
            <a href="mailto:books.by.anuj@gmail.com" className="hover:text-white">
              Email Us
            </a>
            <a
              href="https://www.instagram.com/no.one_reads?rpxt=MW4xZDFkMnF5bHd2eg=="
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>

      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-stone-800 pt-7">
        <p className="text-center text-xs text-stone-500">
          © {new Date().getFullYear()} The Authors' Shelf.
          All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
