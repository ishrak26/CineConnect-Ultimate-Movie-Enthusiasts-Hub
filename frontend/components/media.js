import { useState } from 'react'
import clsx from 'clsx'
import Segmented from './segmented'
import Video from './video'
import Poster from './poster'
import MarkIcon from './icons/mark.svg'
import Gallery from './gallery'
import ScrollContent from './scroll-content'

export default function Media({ videos, posters, backdrops }) {
  const [tab, setTab] = useState('videos')

  return (
    <div>
      <strong className="heading block mb-2">Media</strong>
      <Segmented
        callback={(val) => setTab(val)}
        segments={[
          {
            value: 'videos',
            label: <Label label="Videos" count={videos.length} />,
          },
          {
            value: 'posters',
            label: <Label label="Posters" count={posters.length} />,
          },
          {
            value: 'backdrops',
            label: <Label label="Backdrops" count={backdrops.length} />,
          },
        ]}
        name="media"
      />
      <div>
        {tab === 'videos' && (
          <div>
            {videos.length > 0 ? <Videos videos={videos} /> : <NoResult />}
          </div>
        )}
        {tab === 'posters' && (
          <div>
            {posters.length > 0 ? <Posters posters={posters} /> : <NoResult />}
          </div>
        )}
        {tab === 'backdrops' && (
          <div>
            {backdrops.length > 0 ? (
              <Backdrops backdrops={backdrops} />
            ) : (
              <NoResult />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Label({ label, count }) {
  return (
    <span>
      <span className="mr-2">{label}</span>
      <small className="font-normal text-xs px-2 rounded-lg bg-white-10">
        {count}
      </small>
    </span>
  )
}

function NoResult() {
  return (
    <div className="h-96 my-4 grid place-items-center bg-black-10 rounded-xl">
      <div className="flex flex-col items-center">
        <MarkIcon className="text-3xl mb-4" />
        <span>No media provided</span>
      </div>
    </div>
  )
}

function Videos({ videos }) {
  return (
    <ScrollContent className={clsx(' py-4 w-full gap-8')}>
      {[
        ...videos.filter((video) => video.type === 'Trailer'),
        ...videos.filter((video) => video.type !== 'Trailer'),
      ].map((video) => (
        <Video
          key={video.id}
          id={video.key}
          name={video.name}
          className="aspect-[4/3] h-96 relative"
        />
      ))}
    </ScrollContent>
  )
}

function Backdrops({ backdrops }) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <ScrollContent className="py-4 w-full gap-8">
        {backdrops.map((backdrop, index) => (
          <div key={backdrop.file_path} className="aspect-video h-96">
            <img
              className="w-full h-full rounded-xl cursor-zoom-in"
              src={`https://image.tmdb.org/t/p/w780${backdrop.file_path}`}
              width={780}
              height={240}
              alt="backdrop"
              onClick={() => {
                setIndex(index)
                setIsOpen(true)
              }}
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
        images={backdrops.map((backdrop) => ({
          src: `https://image.tmdb.org/t/p/original${backdrop.file_path}`,
          w: backdrop.width,
          h: backdrop.height,
        }))}
      />
    </>
  )
}

function Posters({ posters }) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <ScrollContent className="py-4 w-full gap-8">
        {posters.map((poster, index) => (
          <div
            key={poster.file_path}
            onClick={() => {
              setIndex(index)
              setIsOpen(true)
            }}
          >
            <Poster
              className="h-96 cursor-zoom-in"
              path={poster.file_path}
              alt="poster"
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
        images={posters.map((poster) => ({
          src: `https://image.tmdb.org/t/p/original${poster.file_path}`,
          w: poster.width,
          h: poster.height,
        }))}
      />
    </>
  )
}
