import Link from 'next/link'
import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { selectItems } from "./basketSlice";
// import { selectWishItems } from "./wishlistSlice";
// import nookies from 'nookies'
import { useRouter } from 'next/dist/client/router'
import { destroyCookie } from 'nookies'
import Logo from '../logo'
// import { is } from 'immer/dist/internal'

function Header() {
  const router = useRouter()
  //   const data = useSelector(selectItems);
  // const [items, setItems] = useState([])
  //   const dataWish = useSelector(selectWishItems);
  const [wish, setWish] = useState([])
  const [open, setOpen] = useState(false)
  // const [cookie, setCookie] = useState({})

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/isLoggedIn`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      ).then((res) => res.json())

      if (!response.loggedIn) {
        setIsLoggedIn(false)
      } else {
        setIsLoggedIn(true)
        setUserInfo(response.user)
      }
    }
    checkIsLoggedIn()
  }, [])

  // const [isOpen, setIsOpen] = useState(false)
  // const handleOpen = () => {
  //   setIsOpen(!isOpen)
  // }

  const signOut = () => {
    destroyCookie(null, 'token')
    destroyCookie(null, 'user')
    router.replace('/login')
  }

  return (
    <nav className="w-full mx-auto fixed bg-cusgray z-30 py-2 md:px-0 duration-200">
      <div className="navtop relative max-w-7xl mx-20 flex justify-between place-items-center py-1.5">
        <div className="burger flex items-center">
          {/* <button onClick={handleOpen}>
            <svg
              className="w-7 h-7 text-cusblack"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button> */}
          <Link href="/" className="text-[40px]">
            <Logo />
            <span className="sr-only">CineConnect</span>
          </Link>
        </div>
        <div className="profile flex items-center place-items-center">
          {isLoggedIn && (
            <Link href="/marketplace/product/upload">
              <div className="w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-500 active:bg-gray-300 cursor-pointer duration-200">
                <svg
                  style={{ color: 'white' }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  class="bi bi-upload"
                  viewBox="0 0 16 16"
                >
                  {' '}
                  <path
                    d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
                    fill="white"
                  ></path>{' '}
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"
                    fill="white"
                  ></path>{' '}
                </svg>
              </div>
            </Link>
          )}
          <Link href="/marketplace/shop">
            <div className="w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-500 active:bg-gray-300 cursor-pointer duration-200">
              <svg
                className="w-6 h-6 text-cusblack m-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </Link>
          {/* <div
            onClick={() => router.push("/basket")}
            className="w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer duration-200"
          >
            <svg
              className="w-6 h-6 text-cusblack m-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {items.length > 0 ? (
              <div
                className={`flex
                } absolute text-xs font-light justify-center text-white text-center w-4 h-4 bg-cusblack rounded-full bottom-0 right-0`}
              >
                {items.reduce((a, item) => a + item.quantity, 0)}
              </div>
            ) : (
              ""
            )}
          </div> */}
          {isLoggedIn && (
            <Link href="/marketplace/wishlist">
              <div className="w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-500 active:bg-gray-300 cursor-pointer duration-200">
                <svg
                  className="w-6 m-auto h-6 text-cusblack"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {wish.length > 0 ? (
                  <div
                    className={`flex
                absolute text-xs font-light justify-center text-white text-center w-4 h-4 bg-cusblack rounded-full bottom-0 right-0`}
                  >
                    {wish.length}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </Link>
          )}

          {/* {cookie && (
            <div
              onClick={() => router.push("/orders")}
              className="w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer duration-200"
            >
              <svg
                className="w-6 m-auto h-6 text-cusblack"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          )} */}

          <button
            onClick={() => setOpen(!open)}
            className="w-8 relative flex items-center h-8 rounded-full hover:bg-gray-500 active:bg-gray-300 cursor-pointer duration-200"
          >
            <svg
              className="w-6 m-auto h-6 text-cusblack"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {open && (
              <div className="p-3 bg-white absolute top-11 leading-relaxed right-0 rounded-lg shadow-lg text-sm text-cusblack">
                {isLoggedIn && (
                  <Link href={`/profile/${userInfo.username}`}>
                    <div className="hover:bg-gray-800 flex place-items-center justify-end rounded-lg p-3 text-cusblack">
                      <ul className="text-right text-base w-28">
                        <li className="line-clamp-1">{userInfo.username}</li>
                        {/* <li className="line-clamp-1">{cookie.email}</li> */}
                      </ul>
                    </div>
                  </Link>
                )}

                {isLoggedIn && (
                  <Link
                    href="/marketplace/user/[username]/products"
                    as={`/marketplace/user/${userInfo.username}/products`}
                  >
                    <div className="hover:bg-gray-800 flex items-center justify-end rounded-lg p-3 text-cusblack">
                      <svg
                        width="24"
                        height="24"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {' '}
                        <path
                          d="M20.485 3H16.4933L16.9933 8C16.9933 8 17.9933 9 19.4933 9C20.5703 9 21.3036 8.48445 21.6316 8.1937C21.7623 8.07782 21.8101 7.90091 21.7814 7.72861L21.0768 3.50136C21.0286 3.21205 20.7783 3 20.485 3Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />{' '}
                        <path
                          d="M16.4933 3L16.9933 8C16.9933 8 15.9933 9 14.4933 9C12.9933 9 11.9933 8 11.9933 8V3H16.4933Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />{' '}
                        <path
                          d="M11.9933 3V8C11.9933 8 10.9933 9 9.49329 9C7.99329 9 6.99329 8 6.99329 8L7.49329 3H11.9933Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />{' '}
                        <path
                          d="M7.49331 3H3.50158C3.20828 3 2.95797 3.21205 2.90975 3.50136L2.2052 7.72862C2.17649 7.90091 2.22432 8.07782 2.35502 8.1937C2.68294 8.48445 3.41626 9 4.49329 9C5.99329 9 6.99331 8 6.99331 8L7.49331 3Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />{' '}
                        <path
                          d="M3 9V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />{' '}
                        <path
                          d="M14.8333 21V15C14.8333 13.8954 13.9379 13 12.8333 13H10.8333C9.72874 13 8.83331 13.8954 8.83331 15V21"
                          stroke="currentColor"
                          stroke-miterlimit="16"
                        />{' '}
                      </svg>
                      <span className="ml-2 text-right text-base">
                        Products
                      </span>
                    </div>
                  </Link>
                )}

                {isLoggedIn && (
                  <div
                    onClick={signOut}
                    className="hover:bg-gray-800 flex place-items-center justify-end rounded-lg p-3 text-base text-cusblack"
                  >
                    <span>
                      <svg
                        className="w-6 h-6 text-cusblack"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </span>
                    <span className="ml-2 text-right text-base">Log Out</span>
                  </div>
                )}

                {!isLoggedIn && (
                  <Link href="/login">
                    <div className="hover:underline flex place-items-center">
                      <span>
                        <svg
                          className="w-6 h-6 text-cusblack"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                      </span>{' '}
                      Log In
                    </div>
                  </Link>
                )}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* <MenuNav handleOpen={handleOpen} isOpen={isOpen} /> */}
    </nav>
  )
}

export default Header
