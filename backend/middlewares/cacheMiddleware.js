const NodeCache = require('node-cache');
// Cache data for 300 seconds (5 minutes)
const cache = new NodeCache({ stdTTL: 300 }); 

const cacheMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }
    
    const key = req.originalUrl + '_' + req.vendor._id;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log('Serving from Cache');
        return res.status(200).json(cachedResponse);
    } else {
        console.log('Serving from Database');
        res.originalSend = res.json;
        res.json = (body) => {
            cache.set(key, body);
            res.originalSend(body);
        };
        next();
    }
};

module.exports = cacheMiddleware;