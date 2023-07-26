class CookieService {

    saveCookie = (res, key, value, options) => {
        res.cookie(key, value, options);
    };

    deleteCookie = (res, ...keys) => keys.forEach(key => res.clearCookie(key))

}

module.exports = new CookieService();
