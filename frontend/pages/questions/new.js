import Layout from '../../components/layout'
import { postQuestion } from "../../lib/questions"
import React from 'react'

export default class NewQuestion extends React.Component {
    constructor() {
        super()
        this.state = {
            title: "",
            email: "",
            content: "",
            bounty: ""
        };
    }

    handleChange = evt => {
        // This triggers everytime the input is changed
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }

    handleSubmit = evt => {
        evt.preventDefault();
        postQuestion(this.state)
    }

    render = () => {
        return (
            <Layout>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="control-label" htmlFor="title">Title</label>
                        <input id="title" name="title" type="text" required onChange={this.handleChange} />
                        <i className="bar"></i>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="title">Your email (to send answers to)</label>
                        <input id="email" name="email" type="text" required onChange={this.handleChange} />
                        <i className="bar"></i>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="bounty">Bounty</label>
                        <input id="bounty" name="bounty" type="number" min="0" required onChange={this.handleChange} />
                        <i className="bar"></i>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="content">Content</label>
                        <textarea id="content" name="content" type="text" required onChange={this.handleChange} />
                        <i className="bar"></i>
                    </div>
                    <div className="button-container">
                        <button type="submit" className="button"><span>Submit</span></button>
                    </div>
                </form>
            </Layout >
        )
    }
}
