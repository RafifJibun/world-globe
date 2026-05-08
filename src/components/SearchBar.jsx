import { useState } from "react"

function SearchBar({ countries, onSelect }) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const handleChange = (e) => {
    const val = e.target.value
    setInput(val)
    if (val.trim() === "") {
      setSuggestions([])
      return
    }
    const filtered = countries
      .filter(c => c.name.common.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 5)
    setSuggestions(filtered)
  }

  const handleSelect = (country) => {
    onSelect(country)
    setInput("")
    setSuggestions([])
  }

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="🔍 Cari negara..."
        value={input}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((c, i) => (
            <li key={i} onClick={() => handleSelect(c)}>
              <img src={c.flags.png} alt="" />
              <span>{c.name.common}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar