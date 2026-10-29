# Module 10 Devlog

## Proof of Completion

Provide a minimum of two screenshots OR one short GIF (under 10 seconds) demonstrating the completed work running in your Codespace.

![Options Added](<../imgs/Module 10 options added.png>)

Figure 1 The completed t10 app in the browser after logging in, showing the Add New Item form and two items, Carrot and Potatoes, each with an Edit and a Delete button.

t10 Figure 1 (Authenticated Frontend) This shows the React frontend rendering the logged-in view. The token returned by the Express API after login is held in React state and localStorage, and it is attached as a Bearer token to the GET request that loaded these items, so only the items belonging to this user are returned. The Add New Item form creates new records, and the Edit and Delete buttons on each card update or remove that item.


![Options](<../imgs/Module 10 options .png>)


Figure 2 The same page for a logged-in user with no items, showing the Add New Item form with the "No records found." message beneath it.

t10 Figure 2 (Empty State) This shows the frontend handling a response with no data. The request succeeded but returned an empty list, so the page shows a "No records found." message instead of a blank area. The Logout button and the Add New Item form are still available, so the user can start adding items straight away.

Extension task completed successfully [Yes]

## Concept Mapping

Identify the specific theoretical concepts from this week's lectures that you applied to solve the practical work for this week.
- **Concept 1** Password Hashing and JWT Authentication
  - **Implementation** Passwords are never stored in plain text. In the User model a Mongoose pre('save') hook checks whether the password was modified, generates a salt with 10 rounds and replaces the plain text password with the bcrypt hash, so it is impossible to save a user without hashing first. At login the controller uses bcrypt.compare to check the typed password against the stored hash, since a plain equality check cannot work on a hash. On a successful register or login the server signs a JSON Web Token with the JWT_SECRET from the .env file and returns it as the user's digital ID card. Failed logins return a generic "Invalid credentials" message so an attacker cannot tell which emails exist.

  Code snippet
  ```JS
  userSchema.pre('save', async function () {
      if (!this.isModified('password')) {
          return;
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  });

  const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  };
  ```

- **Concept 2** Protect Middleware and Data Ownership
  - **Implementation** I wrote a protect middleware that acts as a bouncer in front of the item routes. It reads the Authorization header, extracts the token after "Bearer", verifies it with jwt.verify and the secret, loads the user with .select('-password') so the hash is never attached to the request, and calls next(). If the header is missing or the token fails, it responds with 401 before the controller runs. Because the middleware guarantees req.user exists, the controllers take the owner from req.user.id instead of trusting the client, and every query (find, findOneAndDelete and findOneAndUpdate) filters on both the item _id and the user id, so a user can only read, edit or delete their own items. The Item schema links each item to its owner with an ObjectId reference to the User model.

  Code snippet
  ```JS
  router.put('/:id', protect, updateItem);

  const updateItem = async (req, res) => {
      try {
          const updatedItem = await Item.findOneAndUpdate(
              { _id: req.params.id, user: req.user.id },
              { name: req.body.name, description: req.body.description },
              { new: true, runValidators: true }
          );
          if (!updatedItem) {
              return res.status(404).json({ error: 'Item not found or unauthorised' });
          }
          res.status(200).json(updatedItem);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };
  ```

- **Concept 3** Pessimistic Updates and Immutable State in React
  - **Implementation** On the frontend the token is stored in React state and localStorage so a page refresh does not log the user out, and each request injects it into the Authorization header. For updating an item I used a pessimistic pattern: ItemCard keeps isEditing, editName, editDesc and isUpdating in local state, disables the Save button while the PUT request is pending, and only after response.ok is true does it parse the returned item, call the parent's onUpdate and close the edit view. In App.jsx the state is updated immutably, using .map to replace the updated item, .filter to remove a deleted one and the spread operator to add a new one, so React sees a new array and re-renders.

  Code snippet
  ```JS
  const handleSave = async () => {
      setIsUpdating(true);
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/${item._id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ name: editName, description: editDesc })
          });
          if (response.ok) {
              const updatedItem = await response.json();
              onUpdate(updatedItem);
              setIsEditing(false);
          }
      } catch (error) {
          console.error(error);
      } finally {
          setIsUpdating(false);
      }
  };

  const handleUpdate = (updatedItem) => {
      setItems(items.map(item => item._id === updatedItem._id ? updatedItem : item));
  };
  ```

## AI Transparency and Critical Reflection

Detail how Generative AI was used during this lab.

**Table 1 AI Tool Usage Log**

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
| --- | --- | --- | --- |
| Claude | Debugging npm run dev failing with "Missing script: dev" and then "Cannot find module server.js" | Pasted the terminal output from the backend folder | Modified. Claude explained that package.json did not yet have the dev script from Task 1, and that once it did, the server failed because the Task 2 and Task 3 files had not been created. I added the scripts, checked the folders with ls, and created the missing files. |
| Claude | Debugging getaddrinfo ENOTFOUND mongo when the server started | Pasted the nodemon error, then the output of cat on my t09 .env and ls .devcontainer | Modified. Claude explained that the hostname mongo does not resolve in my Codespace, and the t09 .env showed I had used localhost. I changed MONGO_URI to localhost, and since only Docker was installed I started a MongoDB container with docker run and docker start mongo, then confirmed port 27017 was reachable before restarting the server. |
| Claude | Making port 5000 reachable and setting the frontend VITE_API_URL | Pasted a github.dev sign-in redirect link, then the contents of my frontend .env | Modified. Claude explained the sign-in redirect meant port 5000 was still private and showed how to build the correct forwarded URL from my Codespace name. My .env had accidentally contained the commands I typed instead of the variable, so I rewrote it with a single VITE_API_URL line, set the port to Public and restarted Vite, which only reads .env at startup. |
| Claude | Debugging a white screen in the browser | Described the white screen, then pasted ls output for src and src/components | Modified. Claude identified from the listing that the components folder was empty, styles.css was missing and main.jsx and App.jsx were still the Vite defaults. I pasted the file blocks it gave me, confirmed the files existed, restarted the dev server and the login form appeared. |

## Analysis and Implications

This module was about securing a full-stack application, and the main ideas were that passwords must be hashed, that identity is proved by a signed token, and that the server, not the client, must decide who owns data. The most useful design detail was putting the ownership check in the database query itself, so a request for someone else's item simply finds nothing instead of relying on the frontend to behave. Most of the time spent debugging was about the environment rather than the security code: a missing script, empty folders, a database hostname that did not exist in my Codespace, a private port, and files committed to git that should have been ignored. Claude was most helpful in reading terminal output and explaining why each error happened, such as why a hostname only resolves inside a Docker network and why the token secret must never be committed in a real project. It also found real mistakes in the handout, which showed me that both course material and AI output need to be checked against what actually runs. I still had to understand the flow myself, from register to token to protected route to ownership filter, and I verified it by registering, adding, editing and deleting items and inspecting the hashed password and item documents in MongoDB.

---

# Module 11 Devlog

## Proof of Completion

![T11 App completed](<../imgs/Module 11.png>)

Figure 1 The completed t11 app in the browser showing the Flinders Tech Store navbar, the debounced search bar and the product list loaded from the Express API, with Ergonomic Mouse and USB-C Hub shown as Liked.

t11 Figure 1 (Full Stack Result) This shows the React frontend running on port 5173 displaying data that travelled the full stack: the browser calls the Express API through the public Codespaces address, the route queries MongoDB via Mongoose (after a deliberate 1.5 second delay so the loading skeletons are visible), and the JSON comes back to be rendered by ProductList and ProductItem. The Liked and Like buttons reflect the likes field stored in each product document.

![T11 Error](<../imgs/Module 11 error .png>)

Figure 2 The same page after a Like click failed, showing the "Sync error: could not update your like. Reverting." alert with the buttons rolled back to their original state.

t11 Figure 2 (Optimistic UI Rollback) This shows the optimistic Like toggle failing. The PATCH route has a simulated 10% failure rate, so occasionally the server returns a 500 after the button has already changed. The catch block alerts the user and restores the saved previous value of isLiked, so the interface matches the database again (Ergonomic Mouse and USB-C Hub are still Liked, the others are still not).

**Extension task completed successfully** [Yes]

## Concept Mapping

Identify the specific theoretical concepts from this week's lectures that you applied to solve the practical work for this week.

- **Concept 1** Global State with the Context API (Avoiding Prop Drilling)
  - **Implementation** Passing user data down through every intermediate component as props makes code rigid, so I created a UserContext with createContext and a UserProvider component that holds the user state and a mock login function. The provider wraps <App /> in main.jsx, which means any component can read the shared state directly with useContext. Navbar uses this to show either a Login button or "Welcome, Senior Engineer" with a ternary, and App.jsx never has to pass the user down as a prop. Keeping the context and the provider in one file is a common industry pattern, so I added an eslint-disable comment for the fast refresh warning rather than splitting the file.

  Code snippet
  ```JS
  // context/UserContext.jsx
  export const UserContext = createContext(null);

  function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const login = () => setUser({ name: "Senior Engineer", role: "Admin" });

    return (
      <UserContext.Provider value={{ user, login }}>
        {children}
      </UserContext.Provider>
    );
  }

  // components/Navbar.jsx
  const { user, login } = useContext(UserContext);
  ```

- **Concept 2** Debouncing User Input to Protect the Server
  - **Implementation** Firing a request on every keystroke would run one database query per letter, which does not scale to many users. In SearchBar I kept the typed text in local state so the input updates instantly, and used useEffect with [inputValue, onSearch] as dependencies to start a 500 millisecond setTimeout each time the text changes. The cleanup function returned from the effect calls clearTimeout, so each new keystroke cancels the previous timer and only the final pause lets onSearch run. Testing with the console open showed one request for "keyboard" instead of one per letter once the cleanup line was added, and the debounced value is what App passes down to ProductList as searchTerm.

  Code snippet
  ```JS
  useEffect(() => {
    const timerId = setTimeout(() => {
      onSearch(inputValue);
    }, 500);
    return () => clearTimeout(timerId);
  }, [inputValue, onSearch]);
  ```

- **Concept 3** Defensive UI and Optimistic Updates
  - **Implementation** ProductList tracks isLoading, error and products with useState, and fetches inside useEffect whenever searchTerm changes using try/catch/finally. It returns animated skeleton placeholders while loading (wrapped in a fragment, since React needs a single parent), a red error banner when the request fails, an empty state when the search returns nothing, and the list otherwise. The search term is passed through encodeURIComponent so special characters cannot break the URL. For the Like button I used an optimistic update: ProductItem saves the current isLiked value, flips it immediately for instant feedback, then sends a PATCH request and, if it fails, alerts the user and sets the state back to the saved value. This trades a more complex rollback for a much faster perceived response.

  Code snippet
  ```JS
  const handleLikeToggle = async () => {
    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${product._id}/like`,
        { method: 'PATCH' }
      );
      if (!response.ok) throw new Error('Sync failed');
    } catch (err) {
      alert('Sync error: could not update your like. Reverting.');
      setIsLiked(previousState);
    }
  };
  ```

## AI Transparency and Critical Reflection

Detail how Generative AI was used during this lab.

**Table 1 AI Tool Usage Log**

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
| --- | --- | --- | --- |
| Claude | Debugging "Cannot GET /api/products" on port 5000 | Pasted the output of curl, ss -ltnp and ps aux | Modified — Claude identified from the process list that a leftover nodemon from the t10 backend was still holding port 5000, so requests were reaching a server with no products route. I killed the old nodemon and node processes with pkill and kill, confirmed the port was free and restarted only the t11 backend. |
| Claude | Debugging the database connection (getaddrinfo ENOTFOUND mongo) | Pasted the seed.js and nodemon errors | Modified — Claude explained that the hostname mongo does not resolve from my Codespace terminal, so MONGO_URI needed to be localhost, which had connected successfully earlier. I changed the line in backend/.env back to localhost, re-ran node seed.js and restarted the server, since .env is only read at startup. |
| Claude | Debugging the red "Load failed" banner in the browser | Pasted the banner text, then the ss and curl output against the public URL | Modified — Claude explained that this is the browser's wording for a fetch that never received a response, and that the public URL returned 404 because nothing was listening on port 5000 after I stopped the server. I restarted the backend in its own terminal, set port 5000 to Public in the PORTS tab, and the page then loaded the products. |

## Analysis and Implications

This module moved the focus from making the stack work to making it feel good to use, and the patterns (context, debouncing, skeletons, error and empty states, and optimistic updates) all come down to respecting two parties: the user, who dislikes waiting and unhelpful errors, and the server, which should not be flooded with requests. The clearest example was debouncing, where removing and then restoring a single cleanup line changed the number of requests from one per keystroke to one per search. Most of my debugging time was again spent on environment problems rather than React logic: an old server from another tutorial still running on the same port, a database hostname that only works in a different setup, and a port that had to be public. Claude was most useful for reading terminal output and process lists and narrowing the cause, and testing each layer separately (curl against localhost, then against the public URL, then the browser) showed which layer was failing. The optimistic Like was also a good check on my understanding, because the rollback only works if the previous value is saved before the state is changed. I still had to understand why each fix worked, such as why the cleanup function cancels the old timer and why Vite and nodemon only read .env at startup, and I verified each change by checking the result myself rather than assuming a suggestion had worked.
