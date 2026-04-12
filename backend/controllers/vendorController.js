const Vendor = require('../models/Vendor');

// @desc    Delegate or revoke access rights to a sub-vendor
// @route   PUT /api/vendors/delegate/:id
// @access  Private (Only SuperVendor)
const delegateAccess = async (req, res, next) => {
    try {
        const subVendorId = req.params.id;
        const { canOnboardCab, canOnboardDriver, canProcessPayments } = req.body;

        // Ensure sub-vendor exists and belongs to this SuperVendor
        // FIX: Changed req.vendor._id to req.user.id to match authMiddleware
        const subVendor = await Vendor.findOne({ _id: subVendorId, parentVendor: req.user.id });

        if (!subVendor) {
            res.status(404);
            throw new Error('Sub-vendor not found or does not belong to you');
        }

        // Update delegation rights based on request
        if (canOnboardCab !== undefined) subVendor.delegatedRights.canOnboardCab = canOnboardCab;
        if (canOnboardDriver !== undefined) subVendor.delegatedRights.canOnboardDriver = canOnboardDriver;
        if (canProcessPayments !== undefined) subVendor.delegatedRights.canProcessPayments = canProcessPayments;

        await subVendor.save();

        res.status(200).json({
            success: true,
            message: 'Delegation rights successfully updated',
            data: subVendor.delegatedRights
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { delegateAccess };