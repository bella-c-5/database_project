# database_project
Project for CSI 3450 - Database Implementation &amp; Design

SeenIt implements the OMDB API to help users search for movies to add to their watched list. When the user begins typing in the search bar, movie titles will appear automatically.

For security purposes, you must generate **your own API key** and add it to the code before running the project. Follow the instructions below to do so. 

---

## Instructions

1. Click the following link to request an API key:  
   https://www.omdbapi.com/apikey.aspx?__EVENTTARGET=freeAcct&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUKLTIwNDY4MTIzNQ9kFgYCAQ9kFgICBw8WAh4HVmlzaWJsZWhkAgIPFgIfAGhkAgMPFgIfAGhkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYDBQtwYXRyZW9uQWNjdAUIZnJlZUFjY3QFCGZyZWVBY2N0oCxKYG7xaZwy2ktIrVmWGdWzxj%2FDhHQaAqqFYTiRTDE%3D&__VIEWSTATEGENERATOR=5E550F58&__EVENTVALIDATION=%2FwEdAAU%2BO86JjTqdg0yhuGR2tBukmSzhXfnlWWVdWIamVouVTzfZJuQDpLVS6HZFWq5fYpioiDjxFjSdCQfbG0SWduXFd8BcWGH1ot0k0SO7CfuulHLL4j%2B3qCcW3ReXhfb4KKsSs3zlQ%2B48KY6Qzm7wzZbR&at=freeAcct&Email=

2. You'll be prompted to the main page and have two options to pick from: "Patreon" and "FREE"

3. Click **FREE**, then fill in the required information.

4. Submit the form and wait for an email from OMDB.

5. Once you receive the email, locate the **API key** they provide.

6. Open the `script.js` file located in the **Frontend** folder.

7. In the `fetchOMDbList` function, replace APIKEY with your personal API key. 

---

How to Run the Project:

This project includes a frontend interface and an optional backend connected to an Oracle XE database.
The frontend can run independently using the OMDB API.
The backend requires Node.js and Oracle XE if the user chooses to enable database storage.

Requirements:
Frontend:
- Web browser (Chrome recommended)
- Text editor (VS Code)

Backend (optional)
- Node.js (version 18+)
- Oracle Database Express Edition (XE)
- SQL scripts included in this repository
  
Running the Frontend (No Backend Needed):
1. Navigate to the Frontend folder
2. Open mainpage.html in a web browser.
3. The application will load immediately.
4. To enable movie search, add your OMDB API key to the script as described below.

OMDB API Key Setup:
(Refer to API Setup Instructions section)

Running the Backend (Optional):
These steps are only required if you want the app to store and retrieve data using Oracle XE.
1. Install Oracle XE
Download and install Oracle Database Express Edition (XE):
https://www.oracle.com/database/technologies/xe-downloads.html
2. Create the Database Tables
   1. Open the SQL Command Line included with Oracle XE.
   2. Run the SQL scripts located in the repository (example):

@schema.sql
   3. Verify that tables such as USER, MOVIE, DIRECTOR, ACTOR, USER_MOVIE, and MOVIE_ACTOR were created.

3. Install Backend Dependencies
From the project root or /Backend directory:
npm install

4. Start the Server
node backend.js

(or node server.js, depending on your file name)
If successful, the server will indicate that it is running and connected to the database.

5. Use the Application with Backend Enabled
Open the frontend (mainpage.html) in a browser.
Movie additions and edits will now be sent to the database.

Notes:
- If the backend is not set up, the frontend will still work for UI interactions and OMDB API search.
- The database is local to the user's machine and is not hosted online.
- Database credentials are not included and must be configured by the user.
  
ENJOY GUYS :D
