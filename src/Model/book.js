class Book {
  constructor(db) {
    this.db = db;
  }

  // Method to list all Books
  async listBooks(){
    try{
      const sql = 'SELECT * FROM books';
      const [rows] = await this.db.promise().query(sql);
      return rows;
    } catch(error){
      console.error(error);
      throw error;
    }
  }

  // Method to get book by ID
  async getBookByID(id){
    try{
      const sql = 'SELECT * FROM books WHERE id =?';
      const book = await this.db.promise().query(sql, id);
      return book;
    }catch (error){
      console.error( error);
      throw error;
    }
  }

  //Method for borrowing a book
  async borrowBook( userid , bookid){
    const sql = 'INSERT INTO user_books (user_id, book_id) VALUES (?,?)';
    try{
      await this.db.promise().query(sql, [userid , bookid]);
      await this.reduceStock(bookid);
    }catch(err){
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error("User already has this book.");
    }else {
      console.error("Error occurred while borrowing the book:", err);
      }
    }
  }

  //Helper functipn for borrow book
  async reduceStock(bookid) {
    try{
      const book = await this.getBookByID(bookid);
      if (!book || !book.length) {
          throw new Error("Book not found");
      }else{
        console.log(book[0][0])
      }
      const currentQuantity = book[0][0].available_quantity;
      console.log("Curr Quantity  "+currentQuantity);
      if(currentQuantity > 0){
        const newQuantity = currentQuantity - 1;
        await this.updateBook(bookid, null, null, null, newQuantity, null);
        return newQuantity;
      }else{
        throw new Error("No more copies of this book available.");
      }
  }catch(error){
    console.error(error);
    throw error;
  }
}
  
  

  // Method to get book by ID
  async getBookByUserID(id) {
    try{
      const sql = 'SELECT * FROM user_books WHERE user_id =?';
      const books = await this.db.promise().query(sql, id);
      return books;
    }catch(error){
      console.error( error);
      throw error;
    }
  }
  
  
  // Method to add a new book
  async addBook(title,	author , isbn ,	available_quantity,	shelf_location) {
    const sql = 'INSERT INTO books (title,	author	,isbn,	available_quantity,	shelf_location) VALUES (? , ? , ? , ? , ? )';
    try{
      const [result] = await this.db.promise().query(sql, [title,	author	,isbn,	available_quantity,	shelf_location]);
      return result.insertId;
    }catch(error){
      console.error( error);
      throw error;
    }
  }

  // Method to update a book
  async updateBook(id, title = null, author = null, isbn = null, available_quantity = null, shelf_location = null) {
    const sql = 'UPDATE books SET title = COALESCE(?, title), author = COALESCE(?, author), isbn = COALESCE(?, isbn), available_quantity = COALESCE(?, available_quantity), shelf_location = COALESCE(?, shelf_location) WHERE id = ?';
    try {
      await this.db.promise().query(sql, [title, author, isbn, available_quantity, shelf_location, id]);
    }catch(error){
      console.error('Error updating book:', error);
      throw error;
    }
  }

  // Method to delete a book
  async deleteBook(id){
    try{
      const sql = 'DELETE FROM books WHERE id = ?';
      const book = await this.getBookByID(id);
      console.log(book[0])
      if(book[0].length ===0){
        return null;
      }else{
        await this.db.promise().query(sql, [id]);
        return id
      }
    }catch (error){
      console.error( error);
      throw error;
    }
  }

} 
 
module.exports = Book;