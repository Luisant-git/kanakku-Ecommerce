import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, createContext } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import NotFound from './pages/NotFound/NotFound'
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation'
import Account from './pages/Account/Account'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Loading from './components/Loading/Loading'
import './styles/main.scss'

// Create context for cart and user
export const CartContext = createContext()
export const UserContext = createContext()

function App() {
  // Cart state
  const [cart, setCart] = useState([])
  const [isCartLoading, setIsCartLoading] = useState(false)
  const [cartError, setCartError] = useState(null)

  // User state
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  // Add to cart function
  const addToCart = (product, quantity = 1) => {
    setIsCartLoading(true)
    try {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id)
        
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        
        return [...prevCart, { ...product, quantity }]
      })
      setCartError(null)
    } catch (error) {
      setCartError('Failed to add item to cart')
      console.error(error)
    } finally {
      setIsCartLoading(false)
    }
  }

  // Remove from cart function
  const removeFromCart = (productId) => {
    setIsCartLoading(true)
    try {
      setCart(prevCart => prevCart.filter(item => item.id !== productId))
      setCartError(null)
    } catch (error) {
      setCartError('Failed to remove item from cart')
      console.error(error)
    } finally {
      setIsCartLoading(false)
    }
  }

  // Update cart quantity function
  const updateCartQuantity = (productId, newQuantity) => {
    setIsCartLoading(true)
    try {
      if (newQuantity < 1) {
        removeFromCart(productId)
        return
      }

      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
      setCartError(null)
    } catch (error) {
      setCartError('Failed to update cart quantity')
      console.error(error)
    } finally {
      setIsCartLoading(false)
    }
  }

  // Clear cart function
  const clearCart = () => {
    setIsCartLoading(true)
    try {
      setCart([])
      setCartError(null)
    } catch (error) {
      setCartError('Failed to clear cart')
      console.error(error)
    } finally {
      setIsCartLoading(false)
    }
  }

  // Login function
  const login = async (credentials) => {
    setIsAuthLoading(true)
    try {
      // In a real app, you would make an API call here
      // const response = await authApi.login(credentials)
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: credentials.email,
        token: 'mock-token'
      }
      setUser(mockUser)
      setAuthError(null)
      return mockUser
    } catch (error) {
      setAuthError(error.message || 'Login failed')
      throw error
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setIsAuthLoading(true)
    try {
      setUser(null)
      setAuthError(null)
    } catch (error) {
      setAuthError('Logout failed')
      console.error(error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    setIsAuthLoading(true)
    try {
      // In a real app, you would make an API call here
      // const response = await authApi.register(userData)
      const mockUser = {
        id: 2,
        name: userData.name,
        email: userData.email,
        token: 'mock-token'
      }
      setUser(mockUser)
      setAuthError(null)
      return mockUser
    } catch (error) {
      setAuthError(error.message || 'Registration failed')
      throw error
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <Router>
      <UserContext.Provider 
        value={{ 
          user, 
          isAuthLoading, 
          authError, 
          login, 
          logout, 
          register 
        }}
      >
        <CartContext.Provider
          value={{
            cart,
            cartCount,
            cartTotal,
            isCartLoading,
            cartError,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart
          }}
        >
          <div className="app">
            <Header />
            <main>
              {/* Show loading spinner when either cart or auth is loading */}
              {(isCartLoading || isAuthLoading) && <Loading />}
              
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes - only for authenticated users */}
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account/orders" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account/details" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order-confirmation" 
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartContext.Provider>
      </UserContext.Provider>
    </Router>
  )
}

export default App