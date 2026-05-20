import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

import { BrowserRouter } from "react-router-dom"

import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"

ReactDOM.createRoot(document.getElementById("root")).render(



    <CartProvider>

      <WishlistProvider>

        <BrowserRouter>

          <App />

        </BrowserRouter>

      </WishlistProvider>

    </CartProvider>



)