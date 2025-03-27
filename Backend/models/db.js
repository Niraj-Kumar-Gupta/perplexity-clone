const { User } = require('../models/User');

const findUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    return user;
};

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    return user;
};

const addFingerprint = async (email, fingerprintData) => {
    const user = await findUserByEmail(email);
    if (user.fingerprints.some(fp => fp.credentialId === fingerprintData.credentialId)) {
        throw new Error('Fingerprint already exists');
    }

    user.fingerprints.push(fingerprintData);
    await user.save();
    return user;
};

const removeFingerprint = async (userId, credentialId) => {
    const user = await findUserById(userId);

    const updatedFingerprints = user.fingerprints.filter(fp => fp.credentialId !== credentialId);
    if (updatedFingerprints.length === user.fingerprints.length) {
        throw new Error('Fingerprint not found');
    }

    user.fingerprints = updatedFingerprints;
    await user.save();
    return user;
};

const getFingerprints = async (email) => {
    const user = await findUserByEmail(email);
    return user.fingerprints;
};

const updateFingerprintCounter = async (email, id, newCounter) => {
    const user = await findUserByEmail(email);

    const fingerprint = user.fingerprints.find(fp => fp.id === id);
    if (!fingerprint) throw new Error('Fingerprint not found');
    if (newCounter === fingerprint.counter) {
        return user;
       // throw new Error('Invalid counter value (potential replay attack)');
    }

    fingerprint.counter = newCounter;
    await user.save();
    return user;
};

module.exports = {
    findUserById,
    findUserByEmail,
    addFingerprint,
    removeFingerprint,
    getFingerprints,
    updateFingerprintCounter,
};
