
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedBook from '../components/FeaturedBook'
import ExploreBooks from '../components/ExploreBooks'
import AuthorSection from '../components/AuthorSection'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <Navbar />
      <main>
      <Hero />
      <FeaturedBook/>
      <ExploreBooks/>
      <AuthorSection/>
      </main>

      <Footer/>
    </>
  )
}

export default Home
