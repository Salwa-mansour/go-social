// async function getHomeFeed(currentUserId) {
//   // 1. Fetch only the IDs of accounts the current user follows
//   const followedAccounts = await prisma.followRequest.findMany({
//     where: {
//       senderId: currentUserId,
//       status: 'ACCEPTED',
//     },
//     select: {
//       receiverId: true, // Only pull the string ID, keeping the payload tiny
//     },
//   });

//   // Extract the IDs into a flat array of strings, and include the user's own ID 
//   // so they see their own posts on their feed too.
//   const authorIds = [
//     currentUserId, 
//     ...followedAccounts.map(follow => follow.receiverId)
//   ];

//   // 2. Fetch the posts matching those authors
//   const feedPosts = await prisma.post.findMany({
//     where: {
//       authorId: {
//         in: authorIds, // Uses the database index we just created!
//       },
//     },
//     orderBy: {
//       createdAt: 'desc', // Instant sort because of our composite index
//     },
//     include: {
//       author: {
//         select: { username: true, avatarUrl: true } // Don't over-fetch passwords
//       },
//       _count: {
//         select: { likes: true, comments: true } // Efficiently gets totals
//       }
//     },
//     take: 20, // ALWAYS paginate your social feeds!
//   });

//   return feedPosts;
// }