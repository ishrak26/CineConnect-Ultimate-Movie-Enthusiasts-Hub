import useScrollPosition from '@react-hook/window-scroll'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ArrowIcon from './icons/arrow.svg'

export default function ScrollTop() {
  const [show, setShow] = useState(false)
  const scrollPosition = useScrollPosition()

  // Fix for hydration mismatch
  useEffect(() => {
    setShow(true)
  }, [])
  //

  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {scrollPosition > 200 && show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 right-8"
        >
          <button onClick={handleClick} className="button button-primary mt-8">
            <ArrowIcon className="-rotate-90" />
            <span className="sr-only">Scroll up</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
