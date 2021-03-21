import Layout from '../../components/layout'
import { answerQuestion, getQuestion, awardAnswer } from "../../lib/questions"
import { useRouter } from 'next/router'
import React, { useState } from "react"
import { BASE_PATH } from "../../lib/consts"
import styles from '../../styles/question.module.css'

export async function getServerSideProps(context) {
    // const data = getPostData(params.id)
    const { owner, title } = context.query
    return {
        props: await getQuestion(owner, title), // will be passed to the page component as props
    }
}

export default function Question(props) {
    const router = useRouter()
    const { owner, title, award } = router.query
    const [content, setContent] = useState("");


    const sendMail = async (owner, title, content, sender, to) => {
        content = `
        <h1>A new answer has been received for your question!</h1>
        <p>${content}</p>
        To award this answer, <a href="${BASE_PATH}/questions/${owner}?award=${sender}&title=${title}">click here.</a>
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
        const mailResp = await sendMail(owner, title, content, props.walletInfo.wallets[0], props.email)
        console.log(mailResp)
        answerQuestion(owner, title, content)
    }

    if (award) {
        awardAnswer(title, award)
    }

    return (
        <Layout>
            <section className={styles.questionHeader}>
                <div className={styles.questionTitleArea}>
                    <label className={styles.questionLabel}>Question</label>
                    <h1 className={styles.questionTitle}>{title}</h1>
                </div>
                <div className={styles.bountyArea}>
                    <div className={styles.bounty}>{props.bounty}</div>
                    <div className={styles.tauBounty}>TAU</div>
                </div>
                <div style={{ clear: "both" }}></div>
            </section>
            <section className={styles.questionContent}>
                {props.content}
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
