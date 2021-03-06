import nodemailer from "nodemailer"
import { EMAIL_USER, EMAIL_PASS } from "../../lib/consts"

const transporter = nodemailer.createTransport({
    service: "SendinBlue",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
})

export default async (req, res) => {
    const { email_content, to } = req.body
    console.log(to, email_content)

    // Check if fields are all filled
    if (!email_content || !to || email_content === "" || to === "") {
        res.status(403).send("")
        return
    }

    const mailerRes = await mailer(req.body)
    res.send(mailerRes)
}

const mailer = ({ email_content, to }) => {
    const message = {
        from: "Dejury <noreply@dejury.vercel.app>",
        to: to.trim(),
        subject: "New answer for your Dejury question",
        html: email_content,
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) =>
            error ? reject(error) : resolve(info)
        )
    })
}
