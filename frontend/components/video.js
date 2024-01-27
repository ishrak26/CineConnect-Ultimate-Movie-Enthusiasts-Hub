import { useState } from 'react'
import PlayIcon from './icons/play.svg'
import Modal from './modal'

export default function Video({ id, name, ...props }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div {...props}>
      <img
        src={`https://img.youtube.com/vi/${id}/0.jpg`}
        alt={name}
        width={384}
        height={288}
        className="w-full h-full object-cover rounded-xl"
      />
      <div
        className="absolute inset-0 grid place-items-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <button className="button button-trans text-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <PlayIcon />
          <span className="sr-only">Play Button</span>
        </button>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <iframe
          className="w-[70vw] aspect-video"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="YouTube video player"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen=""
        />
      </Modal>
    </div>
  )
}
