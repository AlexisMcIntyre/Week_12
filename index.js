//create classes representing rooms & houses 
//house service that uses ajax/http request to the prexisitng api
//class to manage the DOM (clear out DOM every time we put in new house data)

class House {
    constructor(name) {
        this.name = name;
        this.rooms = [];

    }

    addRoom(name, area) {
        this.rooms.push(newRoom(name, area));
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

    static deleteHouse(id) {
        HouseService.deleteHouse(id)
        .then(() => {
            return HouseService.getAllHouses();
        })
        .then((houses) => this.render(houses));
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
            dataType: 'json',
            data: JSON.stringify(house), //turns whatever is typed in and turns it into a string
            contentType: 'application/json',
            type: 'PUT' //this is the same as the "get" and "post" listed above
        });
    }

    static deleteHouse(id) {
        return $.ajax ({
            url: this.url + '/${id}',
            type: 'DELETE'
        });
    }
}

//next part will rerender DOM each time we create a new class
class DOMManager {
    static houses;

    //this method will call the "getAllHouses" method above (in the HouseService and render it to the DOM)
    static getAllHouses() {
        HouseService.getAllHouses().then(houses => this.render(houses));

    } 


    static render(houses) {
        this.houses = houses;
        $('#app').empty();  //everytime we call this it will empty out the div and rerender
        for (let house of houses) {
            $('#app').prepend(
                `<div id="${house._id}" class="card">
                    <div class="card-header">
                        <h2>${house.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
                    </div>  
                    <div class="card body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${house._id}-room-name" class="form control" placeholder="Room Name">

                    </div>
                    <div class="col-sm">
                    <input type="text" id="${house._id}-room-area" class="form control" placeholder="Room Area">
                    </div>
                    <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>
                </div><br>`

            );

            for (let room of house.rooms) {
                $(`#${house._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                    <span id="name-${room._id}"><strong>Area: </strong> ${room.area}</span>
                    <button clas="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Room</button>`
                );
            }
        }
    }
}

DOMManager.getAllHouses();