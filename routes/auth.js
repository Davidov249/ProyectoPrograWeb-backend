const { createRemoteJWKSet } = require('jose/jwks/remote');
const { jwtVerify } = require('jose/jwt/verify');

const verifyJwt = async (req, res, next) => {
    const url = process.env.JwtCognitoUrl;
    const JWKS = createRemoteJWKSet(new URL(url));
    var token = req.headers.authorization;
    console.log(req.headers)
    try {
        const {payload, protectedHeader } = await jwtVerify(token, JWKS, {
            token_use: 'idToken',
            iss: process.env.JWTISS
        })
        return next()
    } catch (e) {
        console.log(e.message)
        return res.status(403).json({ "Error" : e.message})
    }
}

module.exports = {verifyJwt};