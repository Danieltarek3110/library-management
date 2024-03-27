class Book {
    constructor(db) {
      this.db = db;
    }
  
    // Method to list all Books
    async listBooks() {
        try {
            const sql = 'SELECT * FROM books';
            const [rows] = await this.db.promise().query(sql);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
  
    // Method to get book by ID
    async getBookByID(id) {
        try {
            const sql = 'SELECT * FROM books WHERE id =?';
            const book = await this.db.promise().query(sql, id);
            return book;
        } catch (error) {
            console.error( error);
            throw error;
        }
    }

    // Method to get book by ID
    async getBookByUserID(id) {
      try {
          const sql = 'SELECT * FROM user_books WHERE user_id =?';
          const books = await this.db.promise().query(sql, id);
          return books;
      } catch (error) {
          console.error( error);
          throw error;
      }
  }
  
  
    // Method to add a new book
    async addBook(title,	author	,isbn,	available_quantity,	shelf_location) {
      try {
          const sql = 'INSERT INTO books (title,	author	,isbn,	available_quantity,	shelf_location) VALUES (? , ? , ? , ? , ? )';
          const [result] = await this.db.promise().query(sql, [title,	author	,isbn,	available_quantity,	shelf_location]);
          return result.insertId;
      }catch (error) {
        console.error( error);
        throw error;
      }
    }

    // Method to update a book
    async updateBook(id, title = null, author = null, isbn = null, available_quantity = null, shelf_location = null) {
      try {
        const sql = 'UPDATE books SET title = COALESCE(?, title), author = COALESCE(?, author), isbn = COALESCE(?, isbn), available_quantity = COALESCE(?, available_quantity), shelf_location = COALESCE(?, shelf_location) WHERE id = ?';
        await this.db.promise().query(sql, [title, author, isbn, available_quantity, shelf_location, id]);
      } catch (error) {
        console.error('Error updating book:', error);
        throw error;
      }
    }

  
    // Method to delete a book
    async deleteBook(id) {
      try {
          const sql = 'DELETE FROM books WHERE id = ?';
          const book = await this.getBookByID(id);
          console.log(book[0])
          if(book[0].length ===0){
              return null;
          }else{
              await this.db.promise().query(sql, [id]);
              return id
          }
      } catch (error) {
          console.error( error);
          throw error;
      }
    }
  
  
  }
  
  module.exports = Book;