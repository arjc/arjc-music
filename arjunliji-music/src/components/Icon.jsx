export default function Icon({ name, size = 24 }) {
  const paths = {
    play: 'M8 5v14l11-7z',
    pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    previous: 'M6 6h2v12H6zm3.5 6l8.5 6V6z',
    next: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
    loop: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
    close: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
    volume: 'M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zm0-8.5v2.07A8.01 8.01 0 0 1 16.5 18.43v2.07C20.45 19.34 23 15.92 23 12s-2.55-7.34-6.5-8.5z',
    down: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={paths[name]} /></svg>
}
