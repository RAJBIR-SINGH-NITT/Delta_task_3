const crypto = require('crypto');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const [header, body, signature] = token.split('.');

    const expectedSignature = crypto
        .createHmac('sha256', process.env.DTUBE_CONSTELLATION_Conspiracy_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');

    if (signature !== expectedSignature) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) {
        return res.status(401).json({ error: 'Token expired' });
    }

    req.user = payload;
    next();
};

module.exports = verifyJWT;