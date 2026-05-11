import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Skeleton from "../components/Skeleton"

const API_URL = "https://world-globe-api-production.up.railway.app"

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
          if (dataPhoto.results.length > 0) setPhoto(dataPhoto.results[0].urls.regular)
        }

        const resFacts = await fetch(`${API_URL}/api/fun-facts/${name}`)
        if (resFacts.ok) setFunFacts(await resFacts.json())

        const resAttractions = await fetch(`${API_URL}/api/attractions/${name}`)
        if (resAttractions.ok) setAttractions(await resAttractions.json())

        const resFoods = await fetch(`${API_URL}/api/foods/${name}`)
        if (resFoods.ok) setFoods(await resFoods.json())

        if (c.borders?.length > 0) {
          const resBorders = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${c.borders.join(",")}&fields=name,flags`
          )
          if (resBorders.ok) setNeighbors(await resBorders.json())
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
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px", marginBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Skeleton height="147px" />
          <Skeleton height="147px" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "4px" }}>
          <Skeleton height="48px" width="60%" />
          <Skeleton height="16px" width="40%" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
            <Skeleton height="64px" />
            <Skeleton height="64px" />
            <Skeleton height="64px" />
            <Skeleton height="64px" />
          </div>
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

      {/* Hero: bendera kiri, info kanan */}
      <div className="detail-hero">
        <div className="detail-flag-col">
          <img
            src={country.flags.png}
            alt={`Bendera ${country.name.common}`}
            className="detail-flag"
          />
          {photo && (
            <img
              src={photo}
              alt={country.name.common}
              className="detail-landscape"
            />
          )}
        </div>

        <div className="detail-info-col">
          <h1 className="detail-country-name">{country.name.common}</h1>
          <p className="detail-official-name">{country.name.official}</p>
          <div className="detail-quick-grid">
            <div className="detail-quick-item">
              <div className="detail-quick-label">Ibu Kota</div>
              <div className="detail-quick-value">{country.capital?.[0] ?? "—"}</div>
            </div>
            <div className="detail-quick-item">
              <div className="detail-quick-label">Populasi</div>
              <div className="detail-quick-value">{country.population.toLocaleString()}</div>
            </div>
            <div className="detail-quick-item">
              <div className="detail-quick-label">Region</div>
              <div className="detail-quick-value">{country.region}</div>
            </div>
            <div className="detail-quick-item">
              <div className="detail-quick-label">Luas Wilayah</div>
              <div className="detail-quick-value">{country.area?.toLocaleString() ?? "—"} km²</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wikipedia */}
      {wiki?.extract && (
        <div className="wiki-section">
          <div className="wiki-section-label">Wikipedia</div>
          <p>{wiki.extract}</p>
          <a href={wiki.content_urls?.desktop?.page} target="_blank" rel="noreferrer">
            Baca selengkapnya →
          </a>
        </div>
      )}

      {/* Detail */}
      <div className="detail-section">
        <div className="detail-section-title">Detail</div>
        <div className="detail-rows">
          {[
            ["Mata Uang", `${Object.values(country.currencies ?? {})[0]?.name ?? "—"} (${Object.keys(country.currencies ?? {})[0] ?? ""})`],
            ["Bahasa", Object.values(country.languages ?? {}).join(", ")],
            ["Kode Telepon", callingCode],
            ["Domain Internet", country.tld?.[0] ?? "—"],
            ["Zona Waktu", country.timezones?.[0] ?? "—"],
            ["Benua", country.continents?.join(", ") ?? "—"],
            ["Landlocked", country.landlocked ? "Ya" : "Tidak"],
            ["Sisi Jalan", country.car?.side === "left" ? "Kiri" : "Kanan"],
            ...(country.name.nativeName ? [["Nama Lokal", Object.values(country.name.nativeName)[0]?.common ?? "—"]] : []),
          ].map(([label, value], i) => (
            <div key={i} className="detail-row">
              <span className="detail-row-label">{label}</span>
              <span className="detail-row-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Facts */}
      {funFacts.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Fun Facts</div>
          <div className="detail-cards">
            {funFacts.map((f, i) => (
              <div key={i} className="detail-card">
                <p className="detail-card-desc">{f.fact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tempat Wisata */}
      {attractions.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Tempat Wisata</div>
          <div className="detail-cards">
            {attractions.map((a, i) => (
              <div key={i} className="detail-card">
                <div className="detail-card-title">{a.name}</div>
                {a.description && <p className="detail-card-desc">{a.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Makanan Khas */}
      {foods.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Makanan Khas</div>
          <div className="detail-cards">
            {foods.map((f, i) => (
              <div key={i} className="detail-card">
                <div className="detail-card-title">{f.name}</div>
                {f.description && <p className="detail-card-desc">{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negara Tetangga */}
      {neighbors.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Negara Tetangga</div>
          <div className="neighbors-grid">
            {neighbors.map((n, i) => (
              <a key={i} href={`/country/${n.name.common}`} className="neighbor-card">
                <img src={n.flags.png} alt={n.name.common} />
                <span>{n.name.common}</span>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default CountryDetail