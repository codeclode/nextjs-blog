import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { IconArrowBack, IconBallpen, IconBrandGithub, IconBrandHtml5, IconHome, IconPhone, IconSocial } from '@tabler/icons-react';
import { useRouter } from 'next/router';
export const siteTitle = 'Oh!!!';
const tags = ['js', 'html', 'css', 'Vue', 'Reactjs', 'D3', 'nest', 'next', 'ts', 'uniapp']
function Tags() {
  return <div className={styles.tags}>{tags.map((v) => {
    return <div className={styles.tag} key={v} > {v}</div>
  })}
  </div>
}
function Infos() {
  const router = useRouter()
  return <>
    <div className={styles.info}><IconBallpen />XDU本科</div>
    <div className={styles.info}><IconBrandHtml5 />前端</div>
    <div className={styles.info}><IconPhone />13853849013</div>
    <div onClick={() => {
      window.open("https://juejin.cn/user/3839909526244861")
    }} className={styles.info}><IconSocial />掘金首页</div>
    <div onClick={() => {
      window.open("https://github.com/codeclode")
    }} className={styles.info}><IconBrandGithub />Github首页</div>
    <div onClick={() => {
      router.push('/')
    }} className={styles.info}><IconHome />返回首页</div>
  </>
}

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <nav className={styles.nav}>
        <a href="https://github.com/codeclode" target="__blank">
          <Image
            priority
            src="/images/profile.png"
            className={utilStyles.borderCircle}
            height={144}
            width={144}
            alt=""
          />
        </a>
        <h3>codeclode</h3>
        <Tags></Tags>
        <Infos></Infos>
      </nav>
      <main className={styles.main}>
        {children}
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">← Back to home</Link>
          </div>
        )}
      </main>
    </div>
  );
}