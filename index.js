//create classes representing rooms & houses 
//house service that uses ajax/http request to the prexisitng api
//class to manage the DOM (clear out DOM every time we put in new house data)

class House {
    constructor(name) {
        this.name = name;
        this.rooms = [];

    }
}

class Room {
    constructor(name,area) {
        this.name = name;
        this.area = area;
    }
}

class HouseService {
    static url = "https://ancient-taiga-31359.herokuapp.com/api/houses";

    //need a call for each step of the CRUD application

    static getAllHouses() {
        return $.get(this.url);
    }

    static getHouse(id) {
        return $.get(this.url + `/${id}`);
    }

    //below takes instance of a house class which means it takes text name and an array
    static createHouse(house) {
        return $.post(this.url, house);
    }

    static updateHouse(house) {
        return $.ajax({
            url: this.url + `/${house._id}`,
            dataType: "json",
            data: JSON.stringify(house),
            contentType: "application/json",
            type: "PUT"
        });
    }
}