import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Link from 'next/link'

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Date from '../components/date';
import { getSortedPostsData } from '../lib/post';
import BlogCard from '../components/blogCard';
import { useState } from 'react';

export async function getStaticProps() {//SSG对应函数。如果需要SSR那么对应函数getServerSideProps
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
const Logos = ['🥳', '📉', '📊',
  '📈', '🎉', '✨', '✅', '💯', '🆗', '▶', '🔊'
  , '🎤', '🖇', '🍾', '😋', '😭', '🥰']
export default function Home({ allPostsData }) {
  const [keyWord, setKeyWord] = useState('')
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <input className={utilStyles.searchInput} value={keyWord} onInput={(e) => {
          setKeyWord(e.target.value)
        }} placeholder="查询文章"></input>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <div className={utilStyles.listContainer}>
          {allPostsData.map(({ id, date, title }, index) => (
            keyWord.trim() === '' || title.toUpperCase().includes(keyWord.toUpperCase()) ?
              <BlogCard logo={Logos[index % Logos.length]} key={id} id={id} date={date} title={title}>
              </BlogCard> : null
          ))}
        </div>
      </section>
    </Layout>
  )
}