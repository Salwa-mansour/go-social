import * as userService from '../servises/userService.js';
import catchAsync from '../utils/catchAsyncError.js';

 export const updateProfile = catchAsync(async (req, res, next) => {
  try {
    // 1. Grab values from the frontend JSON payload
    const { bio, avatarUrl } = req.body;
    
    // 2. req.user is set by your boilerplate's authenticateToken middleware
   const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user context" });
    }

    // 3. Construct a dynamic update object (only changes fields the user sent)
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined && avatarUrl !== '') updateData.avatarUrl = avatarUrl;

    // 4. Update the record in your database via Prisma
    const updatedUser = await userService.updateProfile(userId,updateData);

    // 5. Send back the updated information
    return res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    
    // Catch-all for database errors (e.g., if user record wasn't found)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "User profile record not found" });
    }

    return res.status(500).json({ error: "An internal server error occurred" });
  }
});
