### Push Notification Server

Simple nodejs server using [express](http://expressjs.com/) webserver that can be used as provider for both GCM and APNs.



#### installation


After you have cloned the repository ```cd``` into the 'server' folder and run:

```npm install```

Next we set up a database, in this database we store the device tokens of the registered devices. Assuming you have PostgreSQL server and psql client installed run:

```psql ```

You can use your default database:

![default database](./readme-images/psql-1.jpg "default database")


Alternately you can create a new database:

![new database](./readme-images/psql-2.jpg "new database")

Now create a table tokens by running the file 'table.tokens.sql':

![create table tokens](./readme-images/psql-3.jpg "create table tokens")

