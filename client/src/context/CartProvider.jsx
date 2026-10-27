import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext(null)

function loadCart() {
  try { return JSON.parse(localStorage.getItem('vv_cart') || '[]') } catch { return [] }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem('vv_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((perfume, size, qty = 1) => {
    setCart(prev => {
      const key = `${perfume._id}_${size}`
      const existing = prev.find(i => `${i._id}_${i.size}` === key)
      if (existing) {
        return prev.map(i =>
          `${i._id}_${i.size}` === key
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [...prev, {
        _id: String(perfume._id),
        name: perfume.name,
        brand: perfume.brand,
        image: perfume.image,
        price: perfume.price,
        size,
        qty,
      }]
    })
  }, [])

  const removeFromCart = useCallback((id, size) => {
    setCart(prev => prev.filter(i => !(i._id === id && i.size === size)))
  }, [])

  const updateQty = useCallback((id, size, qty) => {
    if (qty < 1) return
    setCart(prev => prev.map(i =>
      i._id === id && i.size === size ? { ...i, qty } : i
    ))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
