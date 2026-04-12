const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actionType: {
        type: String,
        required: true,
        enum: ['BLOCK_VENDOR', 'UNBLOCK_VENDOR', 'BLOCK_CAB', 'APPROVE_DOCUMENT', 'REJECT_DOCUMENT']
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', 
        required: true
    },
    targetEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
    targetEntityType: {
        type: String,
        required: true,
        enum: ['Vendor', 'Cab', 'Document']
    },
    reason: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);