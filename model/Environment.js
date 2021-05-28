class Environment {
    constructor(env) {
        this.env = env || {
            "logined": false,
            "login_fail": false,
            "failed_count": 0,
        }
    }
}

module.exports = Environment