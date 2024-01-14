//create classes representing books & details
//bookshelf service that uses ajax/http request to the prexisitng api
//class to manage the DOM (clear out DOM every time we put in new books data)


/*This is the constructor for the book class composed of 2 strings and an array. It has one method that pushes the values the user inputs into the bookDetails array. */
class Book {
    constructor(name,author) {
        this.name = name;
        this.author = author;
        this.bookDetails = [];

    }

    addBookDetail(rating, summary) {
        this.bookDetails.push(new BookDetails(rating, summary));
    }
}

class BookDetails {
    constructor(rating,summary) {
        this.rating = rating;
        this.summary = summary;
    }
}


/*Here is the class that handles the API calls. There are several methods. */
class ShelfService {
    static url = "https://659e00a647ae28b0bd350923.mockapi.io/BookShelf/Books";

    //This method returns all the books data from the API.

    static getAllBooks() {
        return $.get(this.url);
    }

    //This method returns a book that has the id that is passed in. The template literal helps specifiy the unique URL.

    static getBook(id) {
        return $.get(this.url + `/${id}`);
    }

    //The method below creates the book object from the user input. This is achieved by using the "post" method with JQuery.

    static createBook(book) {
        return $.post(this.url, book);
    }


    //The method below updates the book with bookDetail information. The ajax method is used and contains the JSON data carrying the book details input byt the user. 

     static updateBook(book) {

        //console.log(this.url + `/${book.id}`)
        //console.log(JSON.stringify(book))

         return $.ajax({
             url: this.url + `/${book.id}`,
             dataType: 'json',
             data: JSON.stringify(book), // stringify turns whatever is typed in and turns it into a string
             contentType: 'application/json',
             method: 'PUT' //this methos enters the data rather than retrieving etc.
         });
     }

     //This method uses the ajax method inside it to delete the book data using the URL plus the ID.

    static deleteBook(id) {
        return $.ajax ({
            url: this.url + `/${id}`,
            method: 'DELETE'
        });
    }
}

//This class manages the DocumentObjectModel.

class DOMManager {
    static books;

    //The method below will call the "getAllBooks" method above in the ShelfService and render it to the DOM using a promise.

    static getAllBooks() {
        ShelfService.getAllBooks().then(books => this.render(books));

    } 

    //This method takes the user input to create a new book and then it gets all the books and renders a new book into the "bookshelf" (interface)

    static createBook(name, author) {
        ShelfService.createBook(new Book(name,author))
        .then(() => {
            return ShelfService.getAllBooks();
        })
        .then((books) => this.render(books));
    }

    //This method below deletes the book by id, then rerenders the interface.

    static deleteBook(id) {
        ShelfService.deleteBook(id)
        .then(() => {
            return ShelfService.getAllBooks();
        })
        .then((books) => this.render(books));
        console.log("delete book: " +id);
    }


    //This methos adds bookDetail to an existing book id by using a for loop. The for loop pushes the bookDetails into the array using the userinput and the val method to attach the data. The book is updted and the interface is refreshed.

    static addBookDetail(id) {
        console.log("add book: " + id);
        for (let book of this.books) {
            if (book.id == id) {
                book.bookDetails.push(new BookDetails($(`#${book.id}-bookDetails-rating`).val(), $(`#${book.id}-bookDetails-summary`).val()));
                ShelfService.updateBook(book)
                .then(() => {
                    return ShelfService.getAllBooks();
                })
                .then((books) => this.render(books));
            }
        }

    }


        //This method cycles through the books with a for loop, then using the indexOf method, it matches the position of the book detail in the array and splices it from the array. Then it updates and refreshes the interface.

    static deleteBookDetail(bookId, indexOfbookDetail) {
        for (let book of this.books) {
            if (book.id == bookId) {
                for (let bookDetail of book.bookDetails) {        
                    if (book.bookDetails.indexOf(bookDetail) == indexOfbookDetail) {
                        book.bookDetails.splice(book.bookDetails.indexOf(bookDetail), 1);
                        ShelfService.updateBook(book)
                        .then(() => {
                            return ShelfService.getAllBooks();
                        })
                        .then((books) => this.render(books));
                    }
                }
            }
        }
    }


    //This method refreshes the user interface and empties the app div. So every time the method is called the app is cleared and refreshed with the current data. Then in the for loop the app div has data inserted via prepend method and a template literal is used to build the elements dynamically. JQuery is used to reference the elements of the DOM. The bottom for loop hadles the book details portion of the interface, adding it using the book ID. Bootstrap is used here for styling and the actual delte buttons are created.

    static render(books) {
        this.books = books;
        $('#app').empty();  //everytime we call this it will empty out the div and rerender
        for (let book of books) {  //rebuilding using a loop through the books
            console.log(book.id)
            $('#app').prepend(
                `<div id="${book.id}" class="card">
                    <div class="card-header">
                        <h2>${book.name}</h2>
                        <h3>${book.author}</h3>
                        <button class="btn btn-danger" onclick="DOMManager.deleteBook('${book.id}')">Delete</button>
                    </div>  
                    <div class="card body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="number" id="${book.id}-bookDetails-rating" class="form control" placeholder="Rating">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${book.id}-bookDetails-summary" class="form control" placeholder="Summary">
                                </div>
                            </div>
                            <button id="${book.id}-new-bookDetails" onclick="DOMManager.addBookDetail('${book.id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );

            //below the book details are dynamically created 

            for (let bookDetail of book.bookDetails) {
                console.log("BookDetails:" + book.bookDetails.indexOf(bookDetail))
                $(`#${book.id}`).find('.card.body').append(
                    `<p>
                    <span id="name-${bookDetail.id}"><strong>Rating: </strong> ${bookDetail.rating}</span>
                    <span id="name-${bookDetail.id}"><strong>Summary: </strong> ${bookDetail.summary}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteBookDetail('${book.id}', '${book.bookDetails.indexOf(bookDetail)}')">Delete Book Details</button>`   
                );
            }
        }
        console.log($('#app').find('.card'))
    }
}


//Below is where the program actually runs, where the new book is created upon the click event. The create book method is used and takes the user input and attaches it to the element it references in the DOM.

$('#create-new-book').on("click", function() {
         DOMManager.createBook($('#new-book-name').val(),$('#new-author-name').val());
  
 });

DOMManager.getAllBooks(); 