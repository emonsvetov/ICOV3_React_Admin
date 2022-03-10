## Setup

### `git clone & yarn install`

`git clone [github path to repository] new_directory (optional)`<br />
`cd to new_directory`<br />
`yarn install`<br />

### `.env file`

Create .env file and make necessary changes

### `Run the app`

`yarn start`

## `Code Helpers`

### Using flash helper

Flash Helper is used to display flash messages at the top of the page or under the main navigation bar.<br />
Import at the top<br />
`import {useDispatch, sendFlashMessage} from "@/shared/components/flash"`<br />

Intialize at the top of default method<br />
`const dispatch = useDispatch()`

Trigger<br />
`dispatch(sendFlashMessage('Permission created successfully', 'alert-success'))`

Note - Additional component `ApiErrorMessage` can be used to parse Api's validation errors in a listed format. For example:<br />

Import<br />
`import ApiErrorMessage from "@/shared/components/ApiErrorMessage"`

use<br />
`dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))`<br />

where `error.response.data` is the response returned from api call<br />

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

### Code Splitting
