# AltSchool Africa Second Semester Assignment H

-  ### Improve your assignment G by expanding the functionality of each route, use filesystem as database as done in assignment E, but use NodeJS file handling module). All your routes must be authenticated. Ensure you write tests for each route
   
    - ## Users:
        - CreateUser- register a new user
            - You should have two users (a.)admin and (b.) visitor
        - AuthenticateUser - authenticate a user(login)
            - Consider the types of user you have
        - getAllUsers - return all users (should only be available to admin alone)

    - ## Books:
        - Create - admin user can create a book
        - Delete - admin user can delete a book 
        - LoanRequest - visitor can request for a book (check that the book is available)
        - ReturnBook - visitor can return a loaned book
        - Update - admin user can update a book

    - if I visit a route that does not exist, return `404`