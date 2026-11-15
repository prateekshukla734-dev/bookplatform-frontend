
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../services/api'


const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'

    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)

    document.body.appendChild(script)
  })
}


function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  
  const navigate = useNavigate()
  
  const hasPhysicalBooks = cart.some(item => item.format !== 'pdf')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currency: 'INR',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(previous => ({
      ...previous,
      [name]: value
    }))
  }


const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (cart.length === 0) {
    setError('Your cart is empty.')
    return
  }

  if (form.currency === 'USD' && hasPhysicalBooks) {
    setError(
      'International orders are currently limited to PDF editions.'
    )
    return
  }

  const orderData = {
    customer: {
      name: form.name,
      email: form.email,
      phone: form.phone
    },

    currency: form.currency,

    items: cart.map(item => ({
      bookId: item.bookId,
      format: item.format,
      quantity: item.quantity
    })),

    ...(hasPhysicalBooks && {
      shippingAddress: {
        fullName: form.fullName,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country
      }
    })
  }

  try {
    setLoading(true)

    // 1. Load Razorpay Checkout.
    const isLoaded = await loadRazorpay()

    if (!isLoaded) {
      throw new Error('Unable to load Razorpay Checkout.')
    }

    // 2. Create bookstore order and Razorpay payment order.
    const response = await API.post('/api/orders', orderData)

    const { order, razorpay } = response.data

    // 3. Configure Razorpay Checkout.
    const options = {
      key: razorpay.keyId,
      amount: razorpay.amount,
      currency: razorpay.currency,

      name: 'Anuj Tiwari Bookstore',
      description: `Order ${order.orderNumber}`,

      order_id: razorpay.orderId,

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone
      },

      notes: {
        orderNumber: order.orderNumber
      },

      theme: {
        color: '#e9b348'
      },

      // 4. Razorpay returns payment details here.
      handler: async function (paymentResponse) {
        try {
          setLoading(true)
          setError('')

          // 5. Verify payment through our backend.
          const verificationResponse = await API.post(
            '/api/orders/verify-payment',
            paymentResponse
          )

          // 6. Clear cart only after backend verification.
          clearCart()

          navigate('/order-success', {
            state: {
              order: {
                ...order,
                paymentStatus:
                  verificationResponse.data.paymentStatus,
                orderStatus:
                  verificationResponse.data.orderStatus
              }
            }
          })

        } catch (err) {
          setError(
            err.response?.data?.message ||
            'Payment verification failed. Please contact support before attempting another payment.'
          )
        } finally {
          setLoading(false)
        }
      },

      modal: {
        ondismiss: function () {
          setLoading(false)
        }
      }
    }

    // 7. Open Razorpay payment window.
    const paymentObject = new window.Razorpay(options)

    paymentObject.on('payment.failed', function (paymentResponse) {
      setError(
        paymentResponse.error?.description ||
        'Payment failed. Please try again.'
      )

      setLoading(false)
    })

    paymentObject.open()

  } catch (err) {
    console.error('Checkout error:', err)

    setError(
      err.response?.data?.message ||
      err.message ||
      'Unable to initiate payment. Please try again.'
    )

    setLoading(false)
  }
}

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#17171b] p-10 text-center text-[#f5f0e8]">
        <h1 className="font-serif text-3xl">Your cart is empty</h1>
        <Link to="/" className="mt-6 inline-block text-[#e9b348]">
          Explore Books
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#17171b] px-6 py-12 text-[#f5f0e8]">
      <div className="mx-auto max-w-5xl">

        <Link to="/cart" className="text-sm text-stone-400 hover:text-white">
          ← Back to Cart
        </Link>

        <h1 className="mt-8 font-serif text-4xl">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-12 md:grid-cols-3">

          <div className="space-y-8 md:col-span-2">

            <section>
              <h2 className="mb-5 font-serif text-2xl">Customer Details</h2>

              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full border border-stone-700 bg-[#25252a] p-4"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full border border-stone-700 bg-[#25252a] p-4"
                />

                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number (optional)"
                  className="w-full border border-stone-700 bg-[#25252a] p-4"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-5 font-serif text-2xl">Payment Currency</h2>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full border border-stone-700 bg-[#25252a] p-4"
              >
                <option value="INR">INR (India)</option>
                <option value="USD" disabled={hasPhysicalBooks}>
                  USD (International — PDF only)
                </option>
              </select>

              {hasPhysicalBooks && (
                <p className="mt-2 text-sm text-stone-400">
                  Your cart contains physical books. These are currently available only in India.
                </p>
              )}
            </section>

            {hasPhysicalBooks && (
              <section>
                <h2 className="mb-5 font-serif text-2xl">Shipping Address</h2>

                <div className="space-y-4">
                  {[
                    ['fullName', 'Recipient Full Name'],
                    ['addressLine1', 'Address Line 1'],
                    ['addressLine2', 'Address Line 2 (optional)'],
                    ['city', 'City'],
                    ['state', 'State'],
                    ['postalCode', 'PIN Code']
                  ].map(([name, placeholder]) => (
                    <input
                      key={name}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required={!['addressLine2'].includes(name)}
                      className="w-full border border-stone-700 bg-[#25252a] p-4"
                    />
                  ))}

                  <input
                    value="India"
                    readOnly
                    className="w-full border border-stone-700 bg-[#25252a] p-4 text-stone-400"
                  />
                </div>
              </section>
            )}

          </div>

          <aside className="h-fit border border-stone-700 p-6">
            <h2 className="font-serif text-2xl">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cart.map(item => (
                <div key={item.itemId} className="flex justify-between gap-4 text-sm">
                  <span className="text-stone-300">
                    {item.title} ({item.format}) × {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-stone-700 pt-5">
              <div className="flex justify-between text-lg">
                <span>Total</span>
                <span className="text-[#e9b348]">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-5 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-[#e9b348] py-4 font-semibold text-black disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : 'PAY NOW'}
            </button>

          </aside>

        </form>
      </div>
    </div>
  )
}

export default Checkout
