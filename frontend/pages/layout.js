import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import Navbar from '@components/navbar'

const Layout = (props) => {
  const router = useRouter()

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    await router.push('/login')
  }

  let menu

  if (!props.auth) {
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        {/* <li className="nav-item">
                    <Link href="/login" className='nav-link active'>
                        Login
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/register" className='nav-link active'>
                        Register
                    </Link>
                </li> */}
      </ul>
    )
  } else {
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item">
          <Link href="#" className="nav-link active" onClick={logout}>
            Logout
          </Link>
        </li>
      </ul>
    )
  }

  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl"
          crossOrigin="anonymous"
        />
      </Head>

      {/* <Navbar auth={props.auth} /> */}

      <main className="form-signin">{props.children}</main>
    </>
  )
}

export default Layout
