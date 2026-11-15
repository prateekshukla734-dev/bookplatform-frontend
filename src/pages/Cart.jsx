
import { Link,useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
  const navigate = useNavigate
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart()

  return (
    <div className="min-h-screen bg-[#17171b] px-6 py-12 text-[#f5f0e8]">

      <div className="mx-auto max-w-5xl">

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl">
            ANUJ TIWARI<span className="text-[#e9b348]">.</span>
          </Link>

          <Link
            to="/"
            className="text-sm text-stone-400 transition hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Heading */}
        <h1 className="mt-16 font-serif text-4xl">
          Your Shopping Cart
        </h1>

        <p className="mt-3 text-sm text-stone-400">
          {cart.length} {cart.length === 1 ? 'product' : 'products'} · {cartCount} {cartCount === 1 ? 'item' : 'items'}
        </p>

        {cart.length === 0 ? (

          /* Empty Cart */
          <div className="mt-16 text-center">
            <p className="font-serif text-2xl">
              Your cart is empty.
            </p>

            <p className="mt-3 text-stone-400">
              Discover something worth reading.
            </p>

            <Link
              to="/"
              className="mt-8 inline-block bg-[#e9b348] px-8 py-3 text-black transition hover:bg-[#d5a13c]"
            >
              Explore Books
            </Link>
          </div>

        ) : (

          <div className="mt-12 grid gap-12 md:grid-cols-3">

            {/* Cart Items */}
            <div className="space-y-6 md:col-span-2">

              {cart.map(item => (

                <div
                  key={item.itemId}
                  className="flex gap-5 border-b border-stone-700 pb-6"
                >

                  {/* Book Cover */}
                  <div className="flex h-36 w-24 shrink-0 items-center justify-center bg-[#25252a]">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl text-[#e9b348]">
                        ✦
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">

                    <h2 className="font-serif text-xl">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm capitalize text-stone-400">
                      {item.format === 'pdf'
                        ? 'Digital PDF Edition'
                        : `${item.format} Edition`}
                    </p>

                    <p className="mt-3 text-[#e9b348]">
                      ₹{item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex flex-wrap items-center gap-4">

                      {item.format !== 'pdf' && (
                        <div className="flex items-center gap-4 border border-stone-700 px-3 py-2">

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.itemId,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="disabled:opacity-30"
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.itemId,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>

                        </div>
                      )}

                      {item.format === 'pdf' && (
                        <span className="text-sm text-stone-400">
                          Quantity: 1
                        </span>
                      )}

                      <button
                        onClick={() => removeFromCart(item.itemId)}
                        className="text-sm text-red-400 transition hover:text-red-300"
                      >
                        Remove
                      </button>

                    </div>

                    {/* Item Subtotal */}
                    <p className="mt-4 text-sm text-stone-400">
                      Item total: ₹{item.price * item.quantity}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* Order Summary */}
            <div className="h-fit border border-stone-700 p-6">

              <h2 className="font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-8 flex justify-between">
                <span className="text-stone-400">
                  Products
                </span>

                <span>{cart.length}</span>
              </div>

              <div className="mt-5 flex justify-between">
                <span className="text-stone-400">
                  Subtotal
                </span>

                <span>₹{cartTotal}</span>
              </div>

              <div className="mt-5 flex justify-between gap-4">
                <span className="text-stone-400">
                  Shipping
                </span>

                <span className="text-right text-sm">
                  Calculated at checkout
                </span>
              </div>

              <div className="mt-6 border-t border-stone-700 pt-6">
                <div className="flex justify-between text-lg">
                  <span>Total</span>

                  <span className="text-[#e9b348]">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              {/* Checkout */}
             <Link
              to="/checkout"
              className="mt-8 block w-full bg-[#e9b348] py-4 text-center font-semibold text-black transition hover:bg-[#d5a13c]"
              >
              PROCEED TO CHECKOUT
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-stone-500">
                Secure payment and digital delivery will be available soon.
              </p>

            </div>

          </div>

        )}

      </div>
    </div>
  )
}

export default Cart
