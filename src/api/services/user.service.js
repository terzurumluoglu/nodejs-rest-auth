const getUserInfo = (userResponse) => {
    const { _id, name, email, createdAt } = userResponse;
    return { id: _id, name, email, createdAt };
}

module.exports = { getUserInfo };