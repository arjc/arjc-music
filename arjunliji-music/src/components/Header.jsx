export default function Header({ volume, onVolumeChange }) {
  return (
    <header className="header">
      <a className="brand" href="/">
        <img src="/assets/face.webp" alt="Arjun Liji" />
        <span>Music</span>
      </a>
      <label className="volume-control">
        <span>vol</span>
        <input type="range" min="0" max="100" value={volume} onChange={(event) => onVolumeChange(event.target.value)} />
      </label>
    </header>
  )
}
