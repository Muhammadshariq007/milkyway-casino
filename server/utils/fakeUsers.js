function generateFakeUsers(count, fakeNamesPool) {
    const fakeUsers = [];

    for (let i = 0; i < count; i++) {
        if (fakeNamesPool.length === 0) break; // Exit if no names are left

        // Select a random name from the pool
        const randomIndex = Math.floor(Math.random() * fakeNamesPool.length);
        const randomName = fakeNamesPool[randomIndex];

        // Remove the selected name from the pool
        fakeNamesPool.splice(randomIndex, 1);

        // Generate random coins
        const randomCoins = Math.floor(Math.random() * 100) + 1; // Between 1 and 100

        fakeUsers.push({
            user: { fullName: randomName },
            coins: randomCoins,
        });
    }

    return fakeUsers;
}
module.exports = { generateFakeUsers };
