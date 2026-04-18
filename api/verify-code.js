export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.body;
    const CORRECT_CODE = '143';  // আপনার ইচ্ছেমতো পরিবর্তন করতে পারেন

    if (!code || code.trim().toUpperCase() !== CORRECT_CODE) {
        return res.status(401).json({ error: 'Invalid security code' });
    }

    // সিম্পল টোকেন তৈরি (base64 এনকোডেড JSON)
    const token = Buffer.from(JSON.stringify({
        authenticated: true,
        timestamp: Date.now(),
        expires: Date.now() + (10 * 60 * 1000) // 10 মিনিট
    })).toString('base64');

    return res.status(200).json({
        success: true,
        token: token,
        expires_in: 600
    });
}
