const mongoose = require('mongoose');

/**
 * Fetches an array of all vendor IDs at or below the given root vendor ID
 * using MongoDB's recursive $graphLookup aggregation.
 * 
 * @param {ObjectId|String} rootVendorId 
 * @returns {Array<ObjectId|String>} Array containing the root ID and all descendant IDs
 */
const getDescendantVendorIds = async (rootVendorId) => {
    // Ensure the ID is cast to a strict ObjectId internally to match types accurately
    const objectId = new mongoose.Types.ObjectId(rootVendorId);
    
    const allIds = [objectId];
    let currentIdsToSearch = [objectId];

    // Iteratively fetch children since $graphLookup limits connectToField to a single string.
    // Given the max depth of the system is 5 tiers, this iterative BFS is highly efficient.
    while (currentIdsToSearch.length > 0) {
        const children = await mongoose.model('Vendor').find({
            $or: [
                { parentId: { $in: currentIdsToSearch } },
                { parentVendor: { $in: currentIdsToSearch } }
            ]
        }, '_id').lean();

        if (children.length === 0) break;

        currentIdsToSearch = children.map(child => child._id);
        
        // Accumulate newly discovered children into our global array
        for (const id of currentIdsToSearch) {
            allIds.push(id);
        }
    }

    return allIds;
};

/**
 * Traces up the tree to find the root SuperVendor for a given vendor.
 * @param {ObjectId|String} vendorId
 */
const getRootVendorId = async (vendorId) => {
    let currentId = new mongoose.Types.ObjectId(vendorId);
    let iterations = 0;
    
    // Safety cap at 6 iterations since our hierarchy is max 5 tiers deep
    while (iterations < 6) {
        const vendor = await mongoose.model('Vendor').findById(currentId).select('parentId parentVendor role').lean();
        // If not found, or is SuperVendor, or has no parents, this is the root
        if (!vendor || vendor.role === 'SuperVendor' || (!vendor.parentId && !vendor.parentVendor)) {
            return currentId;
        }
        currentId = vendor.parentVendor || vendor.parentId;
        iterations++;
    }
    return currentId;
};

module.exports = {
    getDescendantVendorIds,
    getRootVendorId
};
