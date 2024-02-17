import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

function ShopCarousel() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) return <Skeleton className="h-24 md:h-64" />
  return (
    <div className="">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showArrows={false}
        showThumbs={false}
        swipeable={true}
        transitionTime={500}
        interval={4000}
        className="rounded-2xl overflow-hidden shop shadow-lg"
      >
        <div className="relative">
          <img
            className=" bg-white h-24 object-cover md:h-64 w-full pointer-events-none"
            loading="lazy"
            src="https://theknackinitiative.files.wordpress.com/2014/03/bane-batman-standoff-the-dark-knight-rises-wall-poster1.jpg"
          />
        </div>
        <div>
          <img
            className=" bg-white h-24 object-cover md:h-64 w-full"
            loading="lazy"
            src="https://images.squarespace-cdn.com/content/v1/63bb3e8a824d7e2f7eedf0d3/1689034557973-HC4X5JFW3GJVWA8XPDUF/Oppenheimer+Horizontal.jpeg"
          />
        </div>
        <div>
          <img
            className=" bg-white h-24 object-cover md:h-64 w-full"
            loading="lazy"
            src="https://wallpaperset.com/w/full/e/e/6/366155.jpg"
          />
        </div>
      </Carousel>
    </div>
  )
}

export default ShopCarousel
