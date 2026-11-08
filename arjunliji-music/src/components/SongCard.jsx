import Icon from './Icon'

export default function SongCard({ song, active, onPlay }) {
  return (
    <article className={`song-card${active ? ' selected' : ''}`} onClick={onPlay}>
      <div className="cover-wrap">
        <img src={song.cover} alt={song.name} loading="lazy" />
        <button type="button" className="card-play" onClick={(event) => { event.stopPropagation(); onPlay() }} aria-label={`Play ${song.name}`}>
          <Icon name="play" size={20} />
        </button>
      </div>
      <div className="song-name" title={song.name}>{song.name}</div>
      <div className="song-artist">{song.artist}</div>
      {active && <span className="on-track">ON TRACK</span>}
    </article>
  )
}
