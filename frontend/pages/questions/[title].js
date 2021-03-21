import Layout from '../../components/layout'
import { answerQuestion } from "../../lib/questions"

export async function getServerSideProps(context) {
    // const data = getPostData(params.id)
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default function Question({ data }) {
    return (
        <Layout>
            <form onSubmit={answerQuestion}>
                <div className="form-group">
                    <label className="control-label" htmlFor="content">Content</label>
                    <textarea id="content" name="content" type="text" required />
                    <i className="bar"></i>
                </div>
                <div className="button-container">
                    <button type="submit" className="button"><span>Submit</span></button>
                </div>
            </form>
        </Layout>
    )
}
