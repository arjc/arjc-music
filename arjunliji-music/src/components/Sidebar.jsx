export default function Sidebar({ song, duration }) {
  return (
    <aside className="sidebar">
      <h3>Now Playing</h3>
      <img className="large-cover" src={song.cover} alt={song.name} />
      <div>
        <h2>{song.name}</h2>
        <p className="muted">{song.artist}</p>
      </div>
      <div className="details">
        <Detail label="Duration" value={duration} />
        <Detail label="Release Date" value={new Date(song.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
      </div>
      <div className="about">
        <h4>About This Track</h4>
        <p>{song.description || 'No description yet...'}</p>
      </div>
    </aside>
  )
}

function Detail({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}
