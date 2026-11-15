
import { Link, useLocation } from 'react-router-dom'

function OrderSuccess() {
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return (
      <div className="min-h-screen bg-[#17171b] flex flex-col items-center justify-center text-[#f5f0e8]">
        <h1 className="font-serif text-3xl">Order information unavailable</h1>
        <Link to="/" className="mt-6 text-[#e9b348]">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#17171b] flex items-center justify-center px-6 text-[#f5f0e8]">
      <div className="w-full max-w-xl border border-stone-700 p-10 text-center">

        <div className="text-5xl text-[#e9b348]">✓</div>

        <h1 className="mt-6 font-serif text-3xl">
          Order Created Successfully!
        </h1>

        <p className="mt-4 text-stone-400">
          Your order has been recorded. Payment is still pending.
        </p>

        <div className="mt-8 border-y border-stone-700 py-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-stone-400">Order Number</span>
            <span>{order.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-400">Total</span>
            <span className="text-[#e9b348]">
              {order.currency} {order.totalAmount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-400">Payment Status</span>
            <span className="capitalize">{order.paymentStatus}</span>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 inline-block bg-[#e9b348] px-8 py-3 font-semibold text-black"
        >
          Continue Shopping
        </Link>

      </div>
    </div>
  )
}

export default OrderSuccess
