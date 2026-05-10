import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Skeleton from "../components/Skeleton"

function CountryDetail() {
  const { name } = useParams()
  const [country, setCountry] = useState(null)
  const [wiki, setWiki] = useState(null)
  const [funFacts, setFunFacts] = useState([])
  const [attractions, setAttractions] = useState([])
  const [foods, setFoods] = useState([])
  const [photo, setPhoto] = useState(null)
  const [neighbors, setNeighbors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resCountry = await fetch(`https://restcountries.com/v3.1/name/${name}`)
        if (!resCountry.ok) throw new Error()
        const dataCountry = await resCountry.json()
        const c = dataCountry[0]
        setCountry(c)

        const resWiki = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${name}`)
        if (resWiki.ok) {
          const dataWiki = await resWiki.json()
          setWiki(dataWiki)
        }

        const resPhoto = await fetch(
          `https://api.unsplash.com/search/photos?query=${name} country landscape&per_page=1&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`
        )
        if (resPhoto.ok) {
          const dataPhoto = await resPhoto.json()
          if (dataPhoto.results.length > 0) {
            setPhoto(dataPhoto.results[0].urls.regular)
          }
        }

        const resFacts = await fetch(`http://localhost:8000/api/fun-facts/${name}`)
        if (resFacts.ok) {
          const dataFacts = await resFacts.json()
          setFunFacts(dataFacts)
        }

        const resAttractions = await fetch(`http://localhost:8000/api/attractions/${name}`)
        if (resAttractions.ok) {
          const dataAttractions = await resAttractions.json()
          setAttractions(dataAttractions)
        }

        const resFoods = await fetch(`http://localhost:8000/api/foods/${name}`)
        if (resFoods.ok) {
          const dataFoods = await resFoods.json()
          setFoods(dataFoods)
        }

        if (c.borders?.length > 0) {
          const resBorders = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${c.borders.join(",")}&fields=name,flags`
          )
          if (resBorders.ok) {
            const dataBorders = await resBorders.json()
            setNeighbors(dataBorders)
          }
        }

      } catch {
        setError("Negara tidak ditemukan")
      }
      setLoading(false)
    }

    fetchAll()
  }, [name])

  if (loading) return (
    <div className="container">
      <div className="card">
        <Skeleton height="280px" borderRadius="0" />
        <div className="info">
          <div className="info-grid">
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="80px" />
          </div>
          <Skeleton height="150px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </div>
      </div>
    </div>
  )
  if (error) return <div className="container"><p className="error">{error}</p></div>

  const callingCode = country.idd?.root
    ? `${country.idd.root}${country.idd.suffixes?.[0] ?? ""}`
    : "Tidak ada"

  return (
    <div className="container">
      <div className="card">

        {/* Hero */}
        <div className="card-hero">
          <img src={photo ?? country.flags.png} alt={country.name.common} className="hero-img" />
          <div className="hero-overlay">
            <img src={country.flags.png} alt="bendera" className="flag-small" />
            <div>
              <h2>{country.name.common}</h2>
              <p className="official-name">{country.name.official}</p>
            </div>
          </div>
        </div>

        <div className="info">

          {/* Info Penting - Grid */}
          <div className="info-grid">
            <div className="info-box">
              <span className="info-box-label">🏙️ Ibu Kota</span>
              <span className="info-box-value">{country.capital?.[0] ?? "Tidak ada"}</span>
            </div>
            <div className="info-box">
              <span className="info-box-label">👥 Populasi</span>
              <span className="info-box-value">{country.population.toLocaleString()}</span>
            </div>
            <div className="info-box">
              <span className="info-box-label">🌏 Region</span>
              <span className="info-box-value">{country.region}</span>
            </div>
            <div className="info-box">
              <span className="info-box-label">📐 Luas Wilayah</span>
              <span className="info-box-value">{country.area?.toLocaleString() ?? "Tidak ada"} km²</span>
            </div>
          </div>

          {/* Wikipedia */}
          {wiki?.extract && (
            <div className="wiki-box">
              <p className="wiki-label">📖 Wikipedia</p>
              <p className="wiki-text">{wiki.extract}</p>
              <a href={wiki.content_urls?.desktop?.page} target="_blank" rel="noreferrer" className="wiki-link">
                Baca selengkapnya di Wikipedia →
              </a>
            </div>
          )}

          {/* Detail Tambahan */}
          <div className="section-title">📋 Detail</div>
          <div className="details">
            <div className="detail-item">
              <span className="label">💰 Mata Uang</span>
              <span>{Object.values(country.currencies ?? {})[0]?.name ?? "Tidak ada"} ({Object.keys(country.currencies ?? {})[0] ?? ""})</span>
            </div>
            <div className="detail-item">
              <span className="label">🗣️ Bahasa</span>
              <span>{Object.values(country.languages ?? {}).join(", ")}</span>
            </div>
            <div className="detail-item">
              <span className="label">📞 Kode Telepon</span>
              <span>{callingCode}</span>
            </div>
            <div className="detail-item">
              <span className="label">🌐 Domain Internet</span>
              <span>{country.tld?.[0] ?? "Tidak ada"}</span>
            </div>
            <div className="detail-item">
              <span className="label">🕐 Zona Waktu</span>
              <span>{country.timezones?.[0] ?? "Tidak ada"}</span>
            </div>
            <div className="detail-item">
              <span className="label">🗺️ Benua</span>
              <span>{country.continents?.join(", ") ?? "Tidak ada"}</span>
            </div>
            <div className="detail-item">
              <span className="label">🏔️ Landlocked</span>
              <span>{country.landlocked ? "Ya (terkurung daratan)" : "Tidak"}</span>
            </div>
            <div className="detail-item">
              <span className="label">🚗 Sisi Jalan</span>
              <span>{country.car?.side === "left" ? "Kiri" : "Kanan"}</span>
            </div>
            {country.name.nativeName && (
              <div className="detail-item">
                <span className="label">📝 Nama Lokal</span>
                <span>{Object.values(country.name.nativeName)[0]?.common ?? "Tidak ada"}</span>
              </div>
            )}
          </div>

          {funFacts.length > 0 && (
            <>
              <div className="section-title">💡 Fun Facts</div>
              <div className="details">
                {funFacts.map((f, i) => (
                  <div key={i} className="detail-item fact-item">
                    <span>{f.fact}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {attractions.length > 0 && (
            <>
              <div className="section-title">🏛️ Tempat Wisata</div>
              <div className="details">
                {attractions.map((a, i) => (
                  <div key={i} className="detail-item fact-item">
                    <div>
                      <p style={{ color: "white", fontWeight: "600" }}>{a.name}</p>
                      {a.description && <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>{a.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {foods.length > 0 && (
            <>
              <div className="section-title">🍜 Makanan Khas</div>
              <div className="details">
                {foods.map((f, i) => (
                  <div key={i} className="detail-item fact-item">
                    <div>
                      <p style={{ color: "white", fontWeight: "600" }}>{f.name}</p>
                      {f.description && <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Negara Tetangga */}
          {neighbors.length > 0 && (
            <>
              <div className="section-title">🗺️ Negara Tetangga</div>
              <div className="neighbors">
                {neighbors.map((n, i) => (
                  <a key={i} href={`/country/${n.name.common}`} className="neighbor-card">
                    <img src={n.flags.png} alt={n.name.common} />
                    <span>{n.name.common}</span>
                  </a>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default CountryDetail