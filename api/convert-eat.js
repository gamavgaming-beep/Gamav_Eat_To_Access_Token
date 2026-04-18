export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // টোকেন ভেরিফিকেশন
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
        if (!tokenData.authenticated || tokenData.expires < Date.now()) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token format' });
    }

    // মূল ফাংশন (আপনার দেওয়া)
    const { eat_token } = req.body;
    if (!eat_token) {
        return res.status(400).json({ error: 'eat_token is required' });
    }

    const TARGET_API = 'https://gamav-eat-to-access.vercel.app/Eat';

    try {
        const url = new URL(TARGET_API);
        url.searchParams.append('eat_token', eat_token);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`External API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(502).json({ error: 'Failed to fetch from external API' });
    }
}
