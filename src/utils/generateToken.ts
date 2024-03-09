import jwt from "jsonwebtoken"

export const generateToken = (id: any) => {
    return jwt.sign({ id }, process.env.JWT_Secret, {
        expiresIn: "15d"
    })
}
export const generateVerificationToken = (id: any) => {
    return jwt.sign({ id }, process.env.VERIFICATION_TOKEN, {
        expiresIn: "24"
    })
}
