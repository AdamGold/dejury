import Head from 'next/head'
import Layout from '../../components/layout'
import { answerQuestion, getQuestion, awardAnswer } from "../../lib/questions"
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react"
import { BASE_PATH } from "../../lib/consts"
import styles from '../../styles/question.module.css'
import sanitizeHtml from 'sanitize-html';
import { NextSeo } from 'next-seo';

export async function getServerSideProps(context) {
    // const data = getPostData(params.id)
    const { owner, title } = context.query
    return {
        props: await getQuestion(owner, decodeURIComponent(title)), // will be passed to the page component as props
    }
}

export default function Question(props) {
    const router = useRouter()
    const { owner, award } = router.query
    const title = decodeURIComponent(router.query.title)
    const [content, setContent] = useState("");

    useEffect(() => {
        if (award) {
            awardAnswer(title, award)
        }
    });

    const sendMail = async (owner, title, content, sender, to) => {
        content = `
<h1>A new answer has been received for your question!</h1>
<p>${sanitizeHtml(content)}</p>
To award this answer, <a href="${BASE_PATH}/questions/${owner}?award=${sender}&title=${encodeURIComponent(title)}">click here.</a>
        `
        try {
            const res = await fetch("/api/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content, to })
            })
            return res
        } catch (error) {
            return error
        }
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        answerQuestion(owner, title, content)
        const mailResp = await sendMail(owner, title, content, props.walletInfo.wallets[0], props.email)
        console.log(mailResp)
    }

    return (
        <Layout>
            <NextSeo
                title={`Dejury - ${sanitizeHtml(title)}`}
                description={sanitizeHtml(content)}
            />
            <section className={styles.questionHeader}>
                <div className={styles.questionTitleArea}>
                    <label className={styles.questionLabel}>Question</label>
                    <h1 className={styles.questionTitle}>{sanitizeHtml(title)}</h1>
                </div>
                <div className={styles.bountyArea}>
                    <div className={styles.bounty}>{props.bounty}</div>
                    <p className={styles.tauBounty}>TAU</p>
                </div>
            </section>
            <section className={styles.questionContent}>
                {sanitizeHtml(props.content)}
            </section>
            {
                !award &&
                <section className={styles.answer}>
                    <h3>Post your answer</h3>
                    <p className={styles.answerDesc}>Your answer will be sent to the post owner via email, with a link to award you the bounty.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <textarea id="content" name="content" type="text" value={content}
                                onChange={e => setContent(e.target.value)} required />
                            <i className="bar"></i>
                        </div>
                        <div className="button-container">
                            <button type="submit" className="button"><span>Submit</span></button>
                        </div>
                    </form>
                </section>
            }
        </Layout >
    )
}
