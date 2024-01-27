import { useState } from 'react'
import Gallery from './gallery'
import ScrollContent from './scroll-content'

export default function Profiles({ profiles }) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <ScrollContent className="gap-6">
        {profiles.map((image, index) => (
          <div key={image.file_path} className="aspect-poster h-96">
            <img
              className="flex-shrink-0 rounded-xl h-full cursor-zoom-in"
              src={`https://image.tmdb.org/t/p/h632${image.file_path}`}
              onClick={() => {
                setIndex(index)
                setIsOpen(true)
              }}
              alt=""
            />
          </div>
        ))}
      </ScrollContent>
      <Gallery
        isOpen={isOpen}
        options={{
          index,
        }}
        setIsOpen={setIsOpen}
        images={profiles.map((image) => ({
          src: `https://image.tmdb.org/t/p/original${image.file_path}`,
          w: image.width,
          h: image.height,
        }))}
      />
    </>
  )
}
