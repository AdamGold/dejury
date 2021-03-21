import Layout from '../../components/layout'
import { answerQuestion, getQuestion } from "../../lib/questions"
import { useRouter } from 'next/router'

export async function getServerSideProps(context) {
    // const data = getPostData(params.id)
    const { owner, title } = context.query
    return {
        props: await getQuestion(owner, title), // will be passed to the page component as props
    }
}

export default function Question(props) {
    const router = useRouter()
    const { owner, title } = router.query
    return (
        <Layout>
            <section>
                <h1>{title}</h1>
                <h3>Bounty: {props.bounty} TAU</h3>
            </section>
            <section>
                {props.content}
            </section>
            <section>
                <h1>Write your answer</h1>
                <form onSubmit={answerQuestion}>
                    <div className="form-group">
                        <textarea id="content" name="content" type="text" required />
                        <i className="bar"></i>
                    </div>
                    <div className="button-container">
                        <button type="submit" className="button"><span>Submit</span></button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
