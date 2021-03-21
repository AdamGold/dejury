import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'


export default function Home({ data }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <p align="center">Think StackOverflow, but on the blockchain. And with real bounties.</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.margin100px}`}>
        In order to answer a question and receive its bounty, you would have to know its URL.
        In the meantime, you can <Link href="/questions/new"><a>post</a></Link> a new question.
      </section>
    </Layout>
  )
}
