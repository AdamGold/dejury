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
    const { content, to } = req.body
    console.log(content, to)

    // Check if fields are all filled
    if (content === "" || to === "") {
        res.status(403).send("")
        return
    }

    const mailerRes = await mailer(req.body)
    res.send(mailerRes)
}

const mailer = ({ content, to }) => {
    const message = {
        from: "Dejury <ronalister@gmail.com>",
        to,
        subject: `New answer for your Dejury question`,
        content,
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) =>
            error ? reject(error) : resolve(info)
        )
    })
}
