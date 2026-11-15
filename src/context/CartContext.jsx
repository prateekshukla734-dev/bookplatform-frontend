
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

const CART_STORAGE_KEY = 'bookstore-cart'

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)

    if (!savedCart) return []

    const parsedCart = JSON.parse(savedCart)

    if (!Array.isArray(parsedCart)) return []

    return parsedCart.filter(item =>
      item &&
      typeof item.itemId === 'string' &&
      typeof item.bookId === 'string' &&
      typeof item.title === 'string' &&
      typeof item.price === 'number' &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      ['paperback', 'hardcover', 'pdf'].includes(item.format) &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 1
    ).map(item => ({
      ...item,
      quantity: item.format === 'pdf'
        ? 1
        : item.quantity
    }))

  } catch (error) {
    console.error('Failed to load cart:', error)
    return []
  }
}

export function CartProvider({ children }) {

  const [cart, setCart] = useState(getSavedCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (book, format, price) => {

    if (!book?.id || !book?.title) return

    if (!['paperback', 'hardcover', 'pdf'].includes(format)) return

    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      return
    }

    const itemId = `${book.id}-${format}`

    setCart(previousCart => {

      const existingItem = previousCart.find(
        item => item.itemId === itemId
      )

      if (existingItem) {
        return previousCart.map(item =>
          item.itemId === itemId
            ? {
                ...item,
                quantity: format === 'pdf'
                  ? 1
                  : item.quantity + 1
              }
            : item
        )
      }

      return [
        ...previousCart,
        {
          itemId,
          bookId: book.id,
          title: book.title,
          cover: book.cover || null,
          format,
          price,
          quantity: 1
        }
      ]
    })
  }

  const removeFromCart = itemId => {
    setCart(previousCart =>
      previousCart.filter(item => item.itemId !== itemId)
    )
  }

  const updateQuantity = (itemId, quantity) => {

    if (!Number.isInteger(quantity) || quantity < 1) return

    setCart(previousCart =>
      previousCart.map(item =>
        item.itemId === itemId
          ? {
              ...item,
              quantity: item.format === 'pdf' ? 1 : quantity
            }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
