### Folder structure

##### Controllers
Responsible for database queries. 

##### Helpers
Heplers and utils that can be used across the project

##### Models
Mongoose models.
Example - If you have a booking module and need a bookings table/collection. 
Create `Booking` folder inside this folder and add two files. `schema.js` and `validators.js`. 
Schema file contains the actual mongoose schema and validators contains various Jio validators to validate request body.

#### Routes
Main directory and little complex. We have two subdirectories to separate admin and app routes. Admin routes are basically those which can be access only by an admin. 
##### admin
Holds route files for admin routes. All these routes are imported in the index.js file and we export the admin router
Example: For booking module we will create a `booking.routes.js` file and add routes whichever routes that are relavent to bookings and the admin, for example marking a booking as complete once the customer completes this service.
After creating the `booking.routes.js` file and exporting the router, import the router in the `index.js` file. Mount the router on the route like `/booking`
``` js
const BookingRouter = require('./booking.routes')
AdminRouter.use('/bookings', BookingRouter)
```
##### app
Same as admin but for app routes. Routes that will be used the frontend application for user side. Routes such as getting booking, login, register, etc.

#### server.js
Main part here is 
```js
const AppRouter = require('./routes/app/')
const AdminRouter = require('./routes/admin')
app.use('/app', AppRouter)
app.use('/admin', AdminRouter)
```
We mount admin routes at `/admin` and app routes at `/app` to provide clear distinguishing between the admin and app routes. 
Example:
To get all bookings on app side we can access it at the below endpoint
`<DOMAIN>/app/bookings`
Same on the admin side would be
`<DOMAIN/admin/bookings`

Run node build_db.js to setup mock data

Emaily
Hubspot
