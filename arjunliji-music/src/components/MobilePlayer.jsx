import Icon from './Icon'

export default function MobilePlayer({ song, open, isPlaying, isLooping, current, duration, progress, onClose, onSeek, onToggleLoop, onPlay, onPrevious, onNext }) {
  return (
    <div className={`mobile-player${open ? ' open' : ''}`}>
      <div className="mobile-header"><button type="button" onClick={onClose} aria-label="Close"><Icon name="down" size={28} /></button><span>Now Playing</span><i /></div>
      <div className="mobile-content">
        <img className="mobile-cover" src={song.cover} alt={song.name} />
        <div className="mobile-title"><h2>{song.name}</h2><p>{song.artist}</p></div>
        <div className="mobile-seek"><span>{current}</span><input type="range" min="0" max="1000" value={progress} onChange={(event) => onSeek(event.target.value)} /><span>{duration}</span></div>
        <div className="mobile-transport">
          <button type="button" onClick={onPrevious} aria-label="Previous"><Icon name="previous" size={28} /></button>
          <button type="button" className="mobile-play" onClick={onPlay} aria-label={isPlaying ? 'Pause' : 'Play'}><Icon name={isPlaying ? 'pause' : 'play'} size={28} /></button>
          <button type="button" onClick={onNext} aria-label="Next"><Icon name="next" size={28} /></button>
        </div>
        <div className="mobile-info">
          <div className="mobile-info-meta">
            <div><span>Duration</span><strong>{duration}</strong></div>
            <button type="button" className={`mobile-mode${isLooping ? ' active' : ''}`} onClick={onToggleLoop} aria-label="Toggle shuffle"><Icon name="loop" size={16} /><span>Loop</span></button>
            <div><span>Release Date</span><strong>{new Date(song.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
          </div>
          <p className="mobile-description">{song.description || 'No description yet...'}</p>
        </div>
      </div>
    </div>
  )
}
