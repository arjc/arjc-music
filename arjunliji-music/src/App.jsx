import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import Header from './components/Header'
import SongCard from './components/SongCard'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import MobilePlayer from './components/MobilePlayer'

const formatTime = (seconds) => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00'
const MUSIC_API = 'https://arjc-back.onrender.com/api/music'
const MUSIC_ASSET_BASE = 'https://arjc.github.io/music'

const mapMusicRecord = (record) => ({
  id: record.alias,
  name: record.title || record.alias,
  artist: record.artist || 'Unknown artist',
  url: `${MUSIC_ASSET_BASE}/${record.alias}/audio.mp3`,
  cover: `${MUSIC_ASSET_BASE}/${record.alias}/cover.png`,
  date: record.date,
  description: record.desc_lyrics || 'No description yet...',
})

function App() {
  const audio = useRef(new Audio())
  const autoplayNext = useRef(false)
  const [songs, setSongs] = useState([])
  const [index, setIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [volume, setVolume] = useState(50)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const song = songs[index]
  const changeSong = useCallback((step, shouldPlay = true) => {
    if (!songs.length) return
    autoplayNext.current = shouldPlay
    setIndex((value) => (value + step + songs.length) % songs.length)
    setCurrent(0)
    if (!shouldPlay) setIsPlaying(false)
  }, [songs.length])

  useEffect(() => {
    let active = true
    fetch(MUSIC_API)
      .then((response) => {
        if (!response.ok) throw new Error(`Music API returned ${response.status}`)
        return response.json()
      })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Music API returned an invalid data format')
        const fetchedSongs = data.map(mapMusicRecord)
        if (!fetchedSongs.length) throw new Error('Music API returned no songs')
        if (!active) return
        const savedAlias = localStorage.getItem('lastSong')
        const savedIndex = fetchedSongs.findIndex((item) => item.id === savedAlias)
        setSongs(fetchedSongs)
        setIndex(savedIndex >= 0 ? savedIndex : 0)
        setIsLoading(false)
      })
      .catch((error) => {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Unable to load music')
        setIsLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!song) return undefined
    const player = audio.current
    player.src = song.url
    player.load()
    localStorage.setItem('lastSong', song.id)
    const onTime = () => setCurrent(player.currentTime)
    const onMetadata = () => setDuration(player.duration)
    const onEnded = () => changeSong(1, true)
    player.addEventListener('timeupdate', onTime)
    player.addEventListener('loadedmetadata', onMetadata)
    player.addEventListener('ended', onEnded)
    return () => { player.removeEventListener('timeupdate', onTime); player.removeEventListener('loadedmetadata', onMetadata); player.removeEventListener('ended', onEnded) }
  }, [changeSong, index, song])

  useEffect(() => {
    audio.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    audio.current.loop = isLooping
  }, [isLooping])

  useEffect(() => {
    if (!autoplayNext.current) return
    autoplayNext.current = false
    audio.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }, [index])

  const togglePlay = async () => {
    if (isPlaying) { audio.current.pause(); setIsPlaying(false); return }
    try { await audio.current.play(); setIsPlaying(true) } catch { setIsPlaying(false) }
  }
  const selectSong = (nextIndex) => {
    if (!songs.length) return
    autoplayNext.current = true
    setIndex(nextIndex)
    setCurrent(0)
  }
  const seek = (value) => { const next = Number(value) / 1000 * duration; audio.current.currentTime = next; setCurrent(next) }

  if (isLoading) return <div className="app-shell"><Header volume={volume} onVolumeChange={setVolume} /><div className="app-message">Loading music...</div></div>
  if (loadError) return <div className="app-shell"><Header volume={volume} onVolumeChange={setVolume} /><div className="app-message app-error">Unable to load music: {loadError}</div></div>

  return <div className="app-shell">
    <Header volume={volume} onVolumeChange={setVolume} />
    <main className="main-content"><section className="library"><h1>FL Studio Recomposes</h1><div className="song-grid">{songs.map((item, itemIndex) => <SongCard key={item.id} song={item} active={itemIndex === index} onPlay={() => selectSong(itemIndex)} />)}</div></section><Sidebar song={song} duration={formatTime(duration)} /></main>
    <PlayerBar song={song} isPlaying={isPlaying} isLooping={isLooping} currentTime={formatTime(current)} duration={formatTime(duration)} progress={duration ? current / duration * 100 : 0} onPlay={togglePlay} onPrevious={() => changeSong(-1)} onNext={() => changeSong(1)} onToggleLoop={() => setIsLooping((value) => !value)} onOpenMobile={() => setMobileOpen(true)} />
    <input className="progress" type="range" min="0" max="1000" value={duration ? current / duration * 1000 : 0} onChange={(event) => seek(event.target.value)} aria-label="Track progress" />
    <MobilePlayer song={song} open={mobileOpen} isPlaying={isPlaying} isLooping={isLooping} current={formatTime(current)} duration={formatTime(duration)} progress={duration ? current / duration * 1000 : 0} onClose={() => setMobileOpen(false)} onSeek={seek} onToggleLoop={() => setIsLooping((value) => !value)} onPlay={togglePlay} onPrevious={() => changeSong(-1)} onNext={() => changeSong(1)} />
  </div>
}

export default App
