import Icon from './Icon'

export default function PlayerBar({ song, isPlaying, isLooping, currentTime, duration, progress, onPlay, onPrevious, onNext, onToggleLoop, onOpenMobile }) {
  return (
    <footer className="player-bar">
      <button className="player-track" onClick={onOpenMobile} type="button">
        <img src={song.cover} alt="" />
        <span><strong>{song.name}</strong><small>{song.artist}</small></span>
      </button>
      <div className="player-center">
        <div className="transport">
          <button type="button" className={isLooping ? 'active' : ''} onClick={onToggleLoop} aria-label="Loop"><Icon name="loop" size={18} /></button>
          <button type="button" onClick={onPrevious} aria-label="Previous"><Icon name="previous" size={20} /></button>
          <button type="button" className="play-button" onClick={onPlay} aria-label={isPlaying ? 'Pause' : 'Play'}><Icon name={isPlaying ? 'pause' : 'play'} size={18} /></button>
          <button type="button" onClick={onNext} aria-label="Next"><Icon name="next" size={20} /></button>
        </div>
        <div className="player-seek">
          <span>{currentTime}</span>
          <div className="seek-track" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
          <span>{duration}</span>
        </div>
      </div>
      <div className="player-actions" aria-hidden="true"><Icon name="volume" size={18} /><span className="time"><span>{currentTime}</span> / <span>{duration}</span></span></div>
    </footer>
  )
}
