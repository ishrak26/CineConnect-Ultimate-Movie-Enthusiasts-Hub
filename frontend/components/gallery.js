import { PhotoSwipe } from 'react-photoswipe'
import 'react-photoswipe/lib/photoswipe.css'

export default function Gallery({ isOpen, setIsOpen, images, options }) {
  return (
    <PhotoSwipe
      isOpen={isOpen}
      items={images}
      options={{
        history: false,
        ...options,
      }}
      onClose={() => {
        setIsOpen(false)
      }}
    />
  )
}
