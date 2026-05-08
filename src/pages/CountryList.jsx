import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"]

function CountryList() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState("")
  const [region, setRegion] = useState("All")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,population")
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        )
        setCountries(sorted)
        setLoading(false)
      })
  }, [])

  const filtered = countries.filter(c => {
    const matchSearch = c.name.common.toLowerCase().includes(search.toLowerCase())
    const matchRegion = region === "All" || c.region === region
    return matchSearch && matchRegion
  })

  return (
    <div className="container">
      <h1 style={{ color: "white", marginBottom: "16px" }}>🌍 Semua Negara</h1>

      <input
        type="text"
        placeholder="🔍 Cari negara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="region-filters">
        {REGIONS.map(r => (
          <button
            key={r}
            className={`region-btn ${region === r ? "active" : ""}`}
            onClick={() => setRegion(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Memuat negara...</p>
      ) : (
        <>
          <p className="count">{filtered.length} negara ditemukan</p>
          <div className="grid">
            {filtered.map((country, index) => (
              <div
                key={index}
                className="country-card"
                onClick={() => navigate(`/country/${country.name.common}`)}
              >
                <img src={country.flags.png} alt={country.name.common} />
                <div className="country-info">
                  <h3>{country.name.common}</h3>
                  <p>{country.region}</p>
                  <p>{country.population.toLocaleString()} jiwa</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CountryList