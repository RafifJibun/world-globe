import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CountryDetail from "./pages/CountryDetail"
import CountryList from "./pages/CountryList"
import Navbar from "./components/Navbar"
import "./App.css"

function App() {
  const [dark, setDark] = useState(true)

  return (
    <div className={dark ? "dark" : "light"} style={{ minHeight: "100vh" }}>
      <BrowserRouter>
        <Navbar dark={dark} setDark={setDark} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<CountryList />} />
          <Route path="/country/:name" element={<CountryDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App