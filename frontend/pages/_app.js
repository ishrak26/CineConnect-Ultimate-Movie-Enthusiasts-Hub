import Error from 'next/error'
import NextNProgress from 'nextjs-progressbar'
import '../styles/globals.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import Script from 'next/script'
import ScrollTop from '@components/scroll-top'
import { SidebarProvider } from 'context/SidebarContext'
import { Suspense } from 'react'
import { RecoilRoot } from 'recoil'


function MyApp({ Component, pageProps }) {
  if (pageProps.error)
    return (
      <Error
        statusCode={pageProps.error.status}
        title={pageProps.error.statusMessage}
      />
    )

  return (
    <>
     {/* Google Analytics implementation  */}
      {/* <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-YRMKVQ13FX"
      />
      <Script strategy="afterInteractive" id="ga">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-YRMKVQ13FX');
        `}
      </Script> */}

      <NextNProgress color="#f1c232" />

      <RecoilRoot>
      <SidebarProvider>
        <Component {...pageProps} />
      </SidebarProvider>
      </RecoilRoot>

      <ScrollTop />
    </>
  )
}

export default MyApp
