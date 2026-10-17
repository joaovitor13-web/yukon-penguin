const rooms = [
    { id: 330, name: 'pizza', member: 0, maxUsers: 80, game: 0, spawn: 0 },
    { id: 910, name: 'pizzatron', member: 0, maxUsers: 80, game: 1, spawn: 0 }
];

function claimPizzatronReward(user, coins) {
    if (user.room?.id !== 910 || user.pizzatronClaimed || !Number.isInteger(coins) || coins < 0 || coins > 2000) return false;
    user.pizzatronClaimed = true;
    return true;
}

module.exports = { rooms, claimPizzatronReward };
