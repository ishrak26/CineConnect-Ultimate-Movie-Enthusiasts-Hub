import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { recentCategory, selectCategory } from "../slices/categorySlice";

function SideCategory({ typesData, setTag }) {
  // const dispatch = useDispatch()
  //   const data = useSelector(recentCategory);
  // const data = []
  const [recent, setRecent] = useState()

  // useEffect(() => setRecent(data))

  return (
    <div className="bg-white rounded-3xl px-5 py-6 shadow-lg w-2/3 md:w-1/2 lg:w-auto">
      <h3 className="font-semibold mb-3 text-lg text-cusblack">Tags</h3>
      <ul className="leading-10 text-xs text-gray-400">
        <li>
          <button
            className={`${
              recent == '' ? `font-semibold text-cusblack` : ``
            } cursor-pointer`}
            // onClick={() => dispatch(selectCategory(''))}
          >
            All products
          </button>
        </li>
        {typesData.map((type) => (
          <li key={type}>
            <button
              className={`${
                recent == type ? `font-semibold text-primary-600` : ``
              } cursor-pointer`}
              onClick={() => {
                setTag(type)
                setRecent(type)
              }}
            >
              {type}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SideCategory
