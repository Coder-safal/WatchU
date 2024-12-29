const ApiError = require("../utils/apierror.utils");
const User = require("../models/User");
const Sessions = require("../models/Sessions");
const Payroll = require("../models/Payroll");

class SessionService {

    startSession = async ({ _id: userId, adminId }) => {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(400, "Invalid user");
        }

        const existingSession = await Sessions.findOne({
            userId, adminId, status: 'active',
        });

        if (existingSession) {
            throw new ApiError(409, "Already session exists");
        }

        // create new session
        const sessionId = `${userId}-${Date.now()}`;
        const session = await Sessions.create(
            {
                sessionId,
                userId,
                adminId,
                startTime: new Date(),
                status: 'active',
            }
        );

        return session;
    }

    stopSession = async (userId, adminId, sessionId) => {
        const session = await Sessions.findOne({ adminId, userId, status: 'active' });

        if (!session) {
            throw new ApiError(400, "Active session isn't found or isn't active!");
        }
        session.status = 'completed';

        session.endTime = new Date();

        session.updateSession();
        await session.save();

        await Payroll.updatePayroll(userId, adminId, sessionId)

        return session;
    }

    updateSession = async ({ sessionId }) => {

        const session = await Sessions.findOne({ sessionId, status: 'active' });

        if (!session) {
            throw new ApiError(404, "Session isn't found or not active");
        }

        await session.updateSession();

        await session.save();

        return session;
    }

    getSessionDetails = async ({ userId, adminId }) => {

        const activeUser = await Sessions.find({ adminId, status: 'active' });

        const inactiveUsers = await Sessions.find({ adminId, status: { $in: ['completed', 'intrupted'] } });

        return {
            activeUser,
            inactiveUsers,
            totalActiveUser: activeUser.length,
            totalInactiveUser: inactiveUsers.length,

        }
    }

}



module.exports = new SessionService();