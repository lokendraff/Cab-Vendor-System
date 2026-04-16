const mongoose = require('mongoose');

/**
 * Fetches an array of all vendor IDs at or below the given root vendor ID
 * using MongoDB's recursive $graphLookup aggregation.
 * 
 * @param {ObjectId|String} rootVendorId 
 * @returns {Array<ObjectId|String>} Array containing the root ID and all descendant IDs
 */
const getDescendantVendorIds = async (rootVendorId) => {
    // Ensure the ID is cast to a strict ObjectId for the $match stage
    const objectId = new mongoose.Types.ObjectId(rootVendorId);

    const hierarchy = await mongoose.model('Vendor').aggregate([
        { $match: { _id: objectId } },
        {
            $graphLookup: {
                from: 'vendors',           // The underlying strictly pluralized MongoDB collection
                startWith: '$_id',         // Start building the graph from the root _id
                connectFromField: '_id',   // The Node's identifier
                connectToField: 'parentId',// The child's field that links to the Node
                as: 'descendants'          // Output array field name
            }
        }
    ]);

    if (!hierarchy.length) return [rootVendorId];
    
    // Extract array of all child IDs, plus the initial root ID
    const descendantIds = hierarchy[0].descendants.map(d => d._id);
    return [rootVendorId, ...descendantIds];
};

module.exports = {
    getDescendantVendorIds
};
