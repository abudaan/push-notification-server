### Push Notification Server

Simple nodejs server using [express](http://expressjs.com/) webserver that can be used as provider for both GCM and APNs.



### Installation

Clone the repository and `cd` into the `server` folder and run `npm install`:

```
 $ git clone git@github.com:abudaan/push-notification-server.git
 $ cd push-notification-server/server
 $ npm install
```



Next we set up a database, in this database we store the device tokens of the registered devices. Assuming you have PostgreSQL server and psql client installed run:

```
 $ psql
```

You can use your default database:

```\connect {your_username}```

![default database](./readme-images/psql-1.jpg "default database")


Alternately you can create a new database with SQL:

```CREATE DATABASE your_new_database```

![new database](./readme-images/psql-2.jpg "new database")


Now create a table tokens by running the file `table.tokens.sql`:

```\i table.tokens.sql```

![create table tokens](./readme-images/psql-3.jpg "create table tokens")


Before we can run the server we need to have a connection key and certificate to be able to connect to APNs, and a server key for connecting to GCM. We are going to setup the first test client, which is iOS only to get a connection key and certificate for APNs.

First ```cd``` to the 'client' folder then initialize react-native:

```
 $ cd ../client
 $ react-native init pushtest1
```

Now you get a warning "Directory pushtest1 already exists. Continue?", type "yes" and press enter.
![continue](./readme-images/react-native-init-1.jpg "continue")

During initialization you get several conflict warnings; always choose "n" for "do not overwrite"
![do not overwrite](./readme-images/react-native-init-conflict.jpg "do not overwrite")

Now open the file `./client/pushtest1/ios/pushtest1.xcodeproj` in Xcode. The app needs to be configured for push notifications, follow the steps outlined [here](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6). In the last step we finally create the connection certificate and key that are needed to run our server, we will get back to that after we have finished setting up the client.

Because you can not test push notification in an emulator, connect a physical iOS device, enable wifi, select this device as build target and build the project.

