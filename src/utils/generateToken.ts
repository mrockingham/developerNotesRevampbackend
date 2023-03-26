import jwt from "jsonwebtoken"

const generateToken = (id: any) => {
    return jwt.sign({ id }, process.env.JWT_Secret, {
        expiresIn: "15d"
    })
}

export default generateToken