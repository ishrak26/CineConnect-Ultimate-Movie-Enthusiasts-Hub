import { useRef, useState } from 'react'

export function useScrollFade() {
  const [scrollClass, setScrollClass] = useState('masked-overflow-x')
  const ref = useRef(null)

  function onScroll() {
    setScrollClass(
      ref.current.scrollLeft > 0
        ? ref.current.clientWidth + ref.current.scrollLeft ===
          ref.current.scrollWidth
          ? 'masked-overflow-x masked-overflow-x-end'
          : 'masked-overflow-x masked-overflow-x-both'
        : 'masked-overflow-x'
    )
  }

  return {
    ref,
    scrollClass,
    onScroll,
  }
}
