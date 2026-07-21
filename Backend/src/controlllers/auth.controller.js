const crypto = require('crypto');

// Hand-rolled JWT creation to avoid external auth libraries
const createJWT = (payload) => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', process.env.DTUBE_CONSTELLATION_Conspiracy_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');
    return `${header}.${body}.${signature}`;
};

exports.login = async (req, res) => {
    // Validate credentials against DB...
    const user = { id: '123', role: 'user' }; 
    const token = createJWT({ id: user.id, role: user.role, exp: Date.now() + 86400000 });
    res.json({ token, message: 'Logged in successfully' });
};

exports.oauthCallback = async (req, res) => {
    // Hacker Mode: Hand-implemented OAuth flow
    // 1. Receive authorization code from provider
    // 2. Make backchannel HTTP POST to provider's token endpoint
    // 3. Receive access_token, fetch user profile
    // 4. Generate local JWT and send to client
};

const crypto = require('crypto');
const bcrypt = require('bcryptjs'); // run npm install bcryptjs

const createJWT = (payload) => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', process.env.DTUBE_CONSTELLATION_Conspiracy_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');
    return `${header}.${body}.${signature}`;
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.locals.db;
    
    // 1. Find user in the database
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });

    // 2. Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    // 3. Generate custom token
    const token = createJWT({ id: user._id, role: user.role, exp: Date.now() + 86400000 });
    res.json({ token, message: 'Logged in successfully' });
};