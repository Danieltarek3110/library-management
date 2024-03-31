# Node.js and MySQL Database Setup

This repository contains scripts and instructions for setting up a Node.js application with a MySQL database. The provided `createDB.sql` script can be used to create the necessary database schema.

## Prerequisites

Before proceeding with the setup, ensure that you have the following installed on your system:

- Node.js (https://nodejs.org/)
- MySQL Server (https://dev.mysql.com/downloads/mysql/)

## Setup Instructions

### Step 1: Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/Danieltarek3110/library-management
```

### Step 2: Create the Database

Execute the createDB.sql script to create the MySQL database schema.

You can do this via the MySQL command-line client or a MySQL GUI tool of your choice. 
Here's an example using the command-line client:
```
mysql -u root -pPassword createDB.sql
```

### Step 3: Configure the Node.js Application
Navigate to the root directory of the cloned repository and install the required Node.js dependencies using npm:
```
cd library-management
npm install library-management
```

### Step 4: Set Environment Variables

Create a .env file in the root directory of the project and define the following environment variables:
```
DB_HOST=<database-host>
DB_USER=<database-username>
DB_PASSWORD=<database-password>
DB_NAME=<database-name>
```

### Step 5: Run the Node.js Application
Start the Node.js application using the following command:
```
npm start
```

The application should now be running and connected to the MySQL database.

### Additional Notes
Ensure that your MySQL server is running before executing the createDB.sql script or starting the Node.js application.
Make sure to replace placeholder values with your actual database configuration details.
Feel free to modify the Node.js application to suit your requirements.