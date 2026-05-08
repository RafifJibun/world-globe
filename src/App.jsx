import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CountryDetail from "./pages/CountryDetail"
import CountryList from "./pages/CountryList"
import Navbar from "./components/Navbar"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<CountryList />} />
        <Route path="/country/:name" element={<CountryDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App