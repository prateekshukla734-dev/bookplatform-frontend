
import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-[#faf9f6] px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        <a href="/" className="font-serif text-2xl font-bold">
          ANUJ TIWARI.
        </a>

        <div className="hidden gap-8 md:flex">
          <a href="#home">Home</a>
          <a href="#book">The Book</a>
          <a href="#author">About Author</a>
          <a href="#contact">Contact</a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <div className="mt-5 flex flex-col gap-4 md:hidden">
          <a href="#home">Home</a>
          <a href="#book">The Book</a>
          <a href="#author">About Author</a>
          <a href="#contact">Contact</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar
