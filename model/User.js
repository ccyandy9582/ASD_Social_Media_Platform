class User {
    constructor (user) {
        this.user = user || {
            "user_id": null,
            "username": null,
            "living_area": null,
            "age": null,
            "ASD_lvl": null,
            "gender": null,
            "img": null,
            "email": null,
            "details": null,
            "hobbies": [],
            "activities": [],
            "friends": [],
            "recommendedList": {"user": [], "activities": {}},
        }
    }
}

module.exports = User