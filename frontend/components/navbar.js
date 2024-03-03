import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Logo from './logo'
import Modal from './modal'
import Search from './search'
import SearchIcon from './icons/search.svg'
import clsx from 'clsx'
import { FaUserFriends, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const ref = useRef(null)
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const handleLogout = async () => {
    try {
        const response = await fetch(`http://localhost:4000/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            // Ensure you're passing necessary information if required by your backend API
            // body: JSON.stringify({
            // }),
        });
        if (!response.ok) {
            throw new Error('Failed to logout');
        }
        const data = await response.json();
        console.log('logout successful :', data);
        window.location.href = '/';
    } catch (err) {
        console.error(err); // Handle errors
    }
  };

  useEffect(() => {
    if (searchOpen) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [searchOpen])

  useEffect(() => {
    const checkLoggedIn = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/isLoggedIn`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      ).then((res) => res.json())
      // console.log('response', response)
      if (!response.loggedIn) {
        setLoggedIn(false)
      } else {
        setLoggedIn(true)
        setUserInfo(response.user)
      }
      // console.log('loggedIn', loggedIn)
      // console.log('userInfo', userInfo)
    }
    checkLoggedIn()
  }, [])

  return (
    <header className="navbar">
      <div className="container flex items-center">
        <Link href="/" className="text-[40px]">
          <Logo />
          <span className="sr-only">CineConnect</span>
        </Link>

        <div className="search-bar flex-grow mx-40">
          <Search forwardedRef={ref} />
        </div>

        <nav className="ml-auto flex items-center">
          {!loggedIn && (
            <Link
              href="/login"
              className={clsx(
                'nav-link',
                router.pathname === '/login' && 'text-white-100'
              )}
            >
              Login
            </Link>
          )}

          {!loggedIn && (
            <Link
              href="/register"
              className={clsx(
                'nav-link',
                router.pathname === '/register' && 'text-white-100'
              )}
            >
              Register
            </Link>
          )}
          {loggedIn && <p>{userInfo.username}</p>}
          {loggedIn && (
            // <Link href="/requests">
            <a href="/requests" className="icon-button">
              <FaUserFriends
                style={{ color: 'black' }}
                className="icon"
                size={25}
              />
            </a>
            // </Link>
          )}

          {loggedIn && (
            <button className="icon-button">
              <img
                src="/notification.png"
                alt="Notifications"
                className="icon"
              />
            </button>
          )}
          {loggedIn && (
            <a href={`/profile/${userInfo.username}`}>
              <button className="profile-button">
                <img
                  src={userInfo.image_url}
                  alt="Profile"
                  className="profile"
                />
              </button>
            </a>
          )}
          {/* {loggedIn && (
            <button className="icon-button">
              <img src="/settings.png" alt="Settings" className="icon" />
            </button>
          )} */}
          {loggedIn && (
            <button className="icon-button" onClick={() => handleLogout()}>
              <FaSignOutAlt style={{ color: 'black' }} className="icon" size={25} />
            </button>
          )}

          {/* <Link
            href="/movie"
            className={clsx(
              'nav-link',
              router.pathname === '/movie' && 'text-white-100'
            )}
          >
            Movies
          </Link> */}
          {/*
          <Link
            href="/tv"
            className={clsx(
              'nav-link',
              router.pathname === '/tv' && 'text-white-100'
            )}
          >
            TV Shows
          </Link> */}
          {/* <button
              className="ml-4 text-xl"
              onClick={() => {
                setSearchOpen(true)
                ref?.current?.focus()
              }}
            >
              <SearchIcon />
              <span className="sr-only">Search</span>
            </button> */}
        </nav>
      </div>
    </header>
  )
}
