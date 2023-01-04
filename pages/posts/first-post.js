import Link from "next/link";
import Head from 'next/head'
import Layout from '../../components/layout';
import Script from 'next/script'

export default function FirstPost() {
  return <>
    {/* <Head> */}
    <title>first post</title>
    {/* <Script strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        } src="https://connect.facebook.net/en_US/sdk.js" /> */}
    {/* </Head> */}
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <h2>
        <Link href="/">← Back to home</Link>
      </h2>
    </Layout>
  </>
}