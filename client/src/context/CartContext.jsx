import { createContext, useEffect, useState } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {

  // LOAD CART FROM LOCAL STORAGE
  const [cartItems, setCartItems] = useState(() => {

    const savedCart = localStorage.getItem("cartItems")

    return savedCart ? JSON.parse(savedCart) : []

  })

  // SAVE TO LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    )

  }, [cartItems])

  // ADD TO CART
  const addToCart = (product) => {

    const existingItem = cartItems.find(
      (item) => item._id === product._id
    )

    if (existingItem) {

      const updatedCart = cartItems.map((item) => {

        if (item._id === product._id) {

          return {
            ...item,
            quantity: item.quantity + 1
          }

        }

        return item

      })

      setCartItems(updatedCart)

    } else {

      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1
        }
      ])

    }

  }

  // REMOVE ITEM
  const removeFromCart = (id) => {

    const updatedCart = cartItems.filter(
      (item) => item._id !== id
    )

    setCartItems(updatedCart)

  }

  // INCREASE QUANTITY
  const increaseQuantity = (id) => {

    const updatedCart = cartItems.map((item) => {

      if (item._id === id) {

        return {
          ...item,
          quantity: item.quantity + 1
        }

      }

      return item

    })

    setCartItems(updatedCart)

  }

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {

    const updatedCart = cartItems.map((item) => {

      if (item._id === id && item.quantity > 1) {

        return {
          ...item,
          quantity: item.quantity - 1
        }

      }

      return item

    })

    setCartItems(updatedCart)

  }

  // CLEAR CART
  const clearCart = () => {

    setCartItems([])

  }

  return (

    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
      }}
    >

      {children}

    </CartContext.Provider>

  )

}