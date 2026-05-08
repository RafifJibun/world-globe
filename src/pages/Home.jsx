import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Globe from "react-globe.gl"
import SearchBar from "../components/SearchBar"

function Home() {
  const globeRef = useRef()
  const [countries, setCountries] = useState([])
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,population,latlng")
      .then(res => res.json())
      .then(data => setCountries(data))
  }, [])

 useEffect(() => {
  if (countries.length > 0 && globeRef.current) {
    setTimeout(() => {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.2
    }, 500)
  }
}, [countries])

  const handleSelect = (country) => {
    if (globeRef.current && country.latlng?.length === 2) {
      globeRef.current.controls().autoRotate = false
      globeRef.current.pointOfView({
        lat: country.latlng[0],
        lng: country.latlng[1],
        altitude: 1.5
      }, 1500)
    }
  }

  const markers = countries
    .filter(c => c.latlng?.length === 2)
    .map(c => ({
      lat: c.latlng[0],
      lng: c.latlng[1],
      name: c.name.common,
      flag: c.flags.png,
      population: c.population,
      region: c.region
    }))

  return (
    <div className="globe-container">
      <div className="globe-title">
        <h1>🌍 World Globe</h1>
        <p>Klik negara manapun buat liat info nya</p>
      </div>
      <div className="globe-search">
        <SearchBar countries={countries} onSelect={handleSelect} />
      </div>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={markers}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#6c63ff"}
        pointAltitude={0.01}
        pointRadius={hovered ? 0.6 : 0.4}
        pointLabel={d => `
          <div style="background:#1a1a2e;padding:8px 12px;border-radius:8px;border:1px solid #6c63ff;color:white;font-size:13px">
            <b>${d.name}</b><br/>
            ${d.region}
          </div>
        `}
        onPointHover={setHovered}
        onPointClick={d => navigate(`/country/${d.name}`)}
        width={window.innerWidth}
        height={window.innerHeight - 56}
      />
    </div>
  )
}

export default Home