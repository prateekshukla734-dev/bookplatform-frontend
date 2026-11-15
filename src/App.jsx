import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import BookDetails from './pages/BookDetails'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'

import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route  path="/books/:slug" element={<BookDetails />}/>

          <Route path="/cart" element={<Cart />}/>

          <Route path="/checkout" element={<Checkout/>} />
          
          <Route path="/order-success" element={<OrderSuccess />}/>
        </Routes>

      </BrowserRouter>
    </CartProvider>
  )
}

export default App