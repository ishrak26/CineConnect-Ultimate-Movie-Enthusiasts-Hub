import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function Modal({ children, isOpen, setIsOpen }) {
  if (typeof window === 'object')
    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 grid place-items-center z-50"
          >
            <div
              className="fixed inset-0 bg-black-65"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="relative"
              initial={{ translateY: 10 }}
              animate={{ translateY: 0 }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.querySelector('#__next')
    )
}
