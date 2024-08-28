import React, { useRef, useEffect, useState } from 'react'
import Layout from './layout'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Form.module.css'
// import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const userRef = useRef()
  // const errRef = useRef()

  // const [errMsg, setErrMsg] = useState('') // error message

  useEffect(() => {
    userRef.current.focus()
  }, [])

  const submit = async (e) => {
    e.preventDefault()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
        }),
      }
    )
    if (!response.ok) {
      // setErrMsg('Invalid username or password')
      // console.log('Invalid username or password')
      toast.error('Invalid username or password')
      return
    }

    // console.log(response)

    await router.push('/')
  }

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <div className="container mx-auto">
        <Toaster position="top-center" reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center h-screen">
          <div
            className={styles.glass}
            style={{ width: '100%', paddingTop: '3em' }}
          >
            <div className="title flex flex-col items-center">
              <h4 className="text-5xl font-bold">Login</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500"></span>
            </div>
            {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
            <form className="py-1" onSubmit={submit}>
              <div className="textbox flex flex-col items-center gap-6">
                <input
                  className={styles.textbox}
                  type="text"
                  placeholder="Username"
                  required
                  id="username"
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  ref={userRef}
                />
                <input
                  className={styles.textbox}
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  id="password"
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className={`${styles.btn}`} type="submit">
                  Login
                </button>
              </div>

              {/* <div className="text-1xl text-center py-16">
                            <span className='text-gray-500'>Already Registered? <Link href="/login" className='text-red-500'>Login Now</Link></span>
                        </div> */}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login
