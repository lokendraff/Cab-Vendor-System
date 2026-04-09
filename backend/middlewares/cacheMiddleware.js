const NodeCache = require('node-cache');
// Cache data for 300 seconds (5 minutes)
const cache = new NodeCache({ stdTTL: 300 }); 

const cacheMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }
    
    // Unique key generate karna
    const key = req.originalUrl + '_' + req.vendor._id;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log('Serving from Cache');
        return res.status(200).json(cachedResponse);
    } else {
        console.log('Serving from Database');
        
        const originalJson = res.json.bind(res);
        
        res.json = (body) => {
            cache.set(key, body);
            originalJson(body); // Wapas original function call karna safely
        };
        next();
    }
};

module.exports = cacheMiddleware;