import '@src/App.css'
import { useEffect, useRef } from 'react'
import { World } from '@src/core'

function App() {
  const mount = useRef<HTMLDivElement>(null)
  const isDev = import.meta.env.MODE === 'development'

  useEffect(() => {
    if (!mount.current)
      return

    const world = new World(mount.current, isDev)

    return () => {
      world.destroy()
    }
  }, [mount])

  return (
    <div className="h-full w-full box-border border-5px border-solid border-sky-300">
      <div ref={mount} className="h-full w-full box-border" />
    </div>
  )
}

export default App
