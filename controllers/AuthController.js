"use strict";

class AuthController {

    constructor(req, res) {
        // if (! ('session' in req) || ! ('oauth' in req.session)) {
            // res.render('index', {title: 'Express' });
        // } else {
            this.req = req;
            this.res = res;
        // }
    }

    isAuth() {
        return ('userId' in this.req.session);
    }
}

module.exports = AuthController;