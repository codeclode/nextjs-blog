import styles from './blogCard.module.css'
import Date from './date'
import utilStyles from '../styles/utils.module.css';
import { useRouter } from 'next/router';

export default function BlogCard({ title, date, logo, id }) {
  const router = useRouter()
  return (
    <div onClick={() => {
      router.push(`/posts/${id}`)
    }} className={styles.card}>
      <div>{logo}</div>
      <div>{title}</div>
      <small className={utilStyles.lightText}>
        <Date dateString={date} />
      </small>
    </div>
  )
}