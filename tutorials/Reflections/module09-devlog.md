# Module 08 Devlog

## Proof of Completion




Figure 1 The t08 project in VS Code showing the MVC folder structure (controllers, models and routes, each containing both the User and Post files) alongside server.js mounting both routers.

t08 Figure 1 ![MVC Structure](<../imgs/imgs/Tut08 Image1.png>) This shows the project split into separate concerns: models/ holds the Mongoose schemas (User.js and Post.js), controllers/ holds the async CRUD logic (userController.js and postController.js), and routes/ maps HTTP verbs and URLs to those controller functions. server.js stays small, connecting to the database and mounting each router with app.use('/api/users', userRoutes) and app.use('/api/posts', postRoutes).


Figure 2 requests.http beside the REST Client response panel showing the PUT /api/users/:email request returning 200 OK with the updated user object.

t08 Figure 2 ![Update Response](<../imgs/imgs/Tut08 image2.png>) This shows the PUT request for jane.doe@example.com returning a 200 status and the updated document, with the name changed to "Jane Doe-Smith" and an updatedAt timestamp later than createdAt. This confirms the returnDocument: 'after' option is returning the new version of the document rather than the old one.



**Extension task completed successfully** [Yes]



## Concept Mapping

Identify the specific theoretical concepts from this week's lectures that you applied to solve the practical work for this week.

- **Concept 1** MVC Architecture and Modular Routing with Express Router
  - **Implementation** Instead of putting every route and database call in server.js, I separated the application into a Model (the Mongoose schema), a Controller (the async functions that talk to the database) and a Router (which maps each HTTP verb and URL to a controller function). I then mounted each router in server.js with a base path, so the router files only define the remaining part of the URL (for example /:email). Because the Post resource follows exactly the same pattern, adding it only required three new files and one new app.use line, without touching any of the existing User code.

  Code snippet
  ```JS
  // routes/userRoutes.js
  const router = express.Router();

  router.post('/', createUser);
  router.get('/', getUsers);
  router.get('/:email', getUserByEmail);
  router.put('/:email', updateUser);
  router.delete('/:email', deleteUser);

  export default router;

  // server.js
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  ```

- **Concept 2** Async CRUD Operations, Validation and Explicit Error Responses
  - **Implementation** Each controller function is async and wrapped in a try/catch block, using await so the server doesn't block while MongoDB responds. For the targeted operations (read one, update, delete) I used a URL parameter (req.params.email) to identify the document. Mongoose returns null rather than throwing an error when no document matches, so I added an explicit !user check that returns a 404 before anything else runs. For updates I passed an options object with returnDocument: 'after' so the response contains the new data, and runValidators: true so the update still has to obey the schema rules. I used different status codes deliberately: 201 for a created resource, 400 for bad client data, 404 for a missing document and 500 for server-side failures.

  Code snippet
  ```JS
  const updateUser = async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        { returnDocument: 'after', runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User missing" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  ```

## AI Transparency and Critical Reflection

Detail how Generative AI was used during this lab.

**Table 1 AI Tool Usage Log**

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
| --- | --- | --- | --- |
| Claude | Debugging npm run dev failing with Cannot find module server.js, then a SyntaxError about a missing default export | Pasted the terminal output each time the server crashed | Modified — Claude explained that server.js had not been created in the t08 folder yet and that routes/userRoutes.js was missing its export default router line. I copied server.js across from t07, edited the imports and router mount as the sheet describes, and added the export line myself. |
| Claude | Debugging the database connection, first ENOTFOUND mongo and then a buffering timed out error on POST | Pasted the nodemon output and the 400 response from requests.http | Modified — Claude explained that the hostname mongo does not resolve from the Codespace terminal, and that the timeout error meant Mongoose had never connected. I ran docker ps -a to confirm the container was running, changed MONGO_URI in .env to localhost, and restarted nodemon myself, since changes to .env are not picked up automatically. |
| Claude | Debugging a "header name must be a valid http token" error in requests.http | Pasted the request block and the error message | Modified — Claude identified that a stray line of text placed straight after the Content-Type header was being read as a second header. I removed it and made sure there was a blank line between the headers and the JSON body. It also helped me notice that I had accidentally edited the t07 requests file instead of the t08 one, so I restored the t07 file with git checkout. |

## Analysis and Implications

AI was most useful this week for working out why something failed rather than for the Express and Mongoose logic itself. Most of the problems I hit (a missing file, a missing export, an unreachable database host, a malformed request file) were environment or file-structure problems, and the code I had written was fine. Claude was good at telling me which category an error belonged to and explaining the mechanism, for example why Mongoose returns null instead of throwing, which is why the explicit 404 check is necessary, or why a buffering timeout means the connection never happened. I still had to understand the MVC separation and the CRUD options (returnDocument and runValidators) myself in order to apply them to the Post resource without help, and building that second resource from scratch was the best test of whether I understood the pattern. I also learned not to trust the tutorial sheet blindly, since it contained small typos that would have broken the routes, and that checking each step by sending a request and reading the response is more reliable than assuming the code works.

---

# Module 09 Devlog

## Proof of Completion




Figure 1 The completed t09 app in the browser showing the User Directory fetched from the backend, with the Search for user card below it displaying Grace Hopper after searching for ID 3.

t09 Figure 1 ![GraceHopper](<../imgs/imgs/Tut09 image1.png>) This shows the React frontend running on port 5173 displaying data that travelled the full stack: the browser calls the Express API through the public Codespaces address, the controller queries MongoDB via Mongoose, and the JSON comes back to be rendered. The search card below the directory calls the parameterised GET /api/users/:id route and renders the single matching user in the result box.


Figure 2 The same page during the 2 second simulated delay, showing the "Establishing bridge... Loading data." card.

t09 Figure 2![Loading State](<../imgs/Tut09 image2.png>) This shows the defensive UI handling the loading state. The backend controller deliberately delays its response by 2 seconds with setTimeout to simulate real-world network latency, and the component shows a loading message in the meantime instead of a blank page.



**Extension task completed successfully** [Yes]



## Concept Mapping

Identify the specific theoretical concepts from this week's lectures that you applied to solve the practical work for this week.

- **Concept 1** Separating the Frontend and Backend: CORS and Environment Variables
  - **Implementation** The React app (Vite, port 5173) and the Express API (port 5000) run as two separate applications, so the browser's Same-Origin Policy would normally block the frontend from reading the backend's responses. I installed the cors middleware and applied it with app.use(cors()) before the routes, which adds the Access-Control-Allow-Origin header to the API's responses. Rather than hardcoding the Codespaces address into the components, I stored it in frontend/.env as VITE_API_URL and read it with import.meta.env.VITE_API_URL, so only one value has to change if the backend moves. Vite only exposes variables that start with VITE_ and reads the file at startup, so the dev server has to be restarted after any change to it.

  Code snippet
  ```JS
  // backend/server.js
  app.use(cors());
  app.use(express.json());
  app.use('/api/users', userRoutes);

  // frontend component
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
  ```

- **Concept 2** Defensive UI: Handling Loading, Error and Success States
  - **Implementation** Network requests can be slow or fail, so each component tracks three pieces of state with useState: the data, a loading flag and an error message. The request is started once on mount with useEffect and an empty dependency array, which prevents an infinite fetching loop. Inside it I used try/catch/finally: the try block checks response.ok and throws an error for a bad status, the catch block stores the message so it can be displayed, and the finally block always turns the loading flag off whether the request succeeded or failed. The component then renders a loading card, an error banner or the data depending on the state. For the extension task I applied the same pattern to the user lookup, which fetches on a button click instead of on mount, and added a 404 check in the controller for IDs that don't exist.

  Code snippet
  ```JS
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="card"><p>Establishing bridge... Loading data.</p></div>;
  if (error) return <div className="card"><div className="error-banner">Error: {error}</div></div>;
  ```

## AI Transparency and Critical Reflection

Detail how Generative AI was used during this lab.

**Table 1 AI Tool Usage Log**

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
| --- | --- | --- | --- |
| Claude | Debugging a completely white page on port 5173 and a "Failed to resolve import" error | Pasted the output of ls src and the Vite error overlay | Modified — Claude spotted from the ls output that styles.css and the components folder were missing, so the imports in main.jsx and App.jsx could not resolve. I recreated the files from the terminal, which guaranteed they landed in the right folder, and restarted the frontend. |
| Claude | Finding why the frontend still could not reach the API | Pasted the output of ls -a for the backend and frontend folders and the contents of the .env files | Modified — Claude noticed that frontend/.env was missing and that a stray copy of the Vite project had been created inside backend/ because I ran the scaffold command from the wrong directory. I generated the .env using the Codespaces environment variables, deleted the stray folder with rm -rf, and rewrote the backend .env cleanly. |
| Claude | Debugging a red "Error: Load failed" banner in the browser | Shared a screenshot of the error banner | Modified — Claude explained that this is the browser's wording for a fetch that never received a response, and that port 5000 was most likely not set to Public in the Codespaces PORTS tab. I changed the port visibility, confirmed with curl that the API responded, restarted the frontend and the page then loaded the directory. |

## Analysis and Implications

This module made me think about the two halves of a full stack application as separate systems that each need to be correct and reachable on their own. Almost all the problems I hit were not logic errors but wiring problems: files in the wrong folder, a missing .env, a stray scaffold, and a port that was private. The useful debugging habit was testing each layer in isolation first, for example hitting the API directly with requests.http and in the browser before involving React, which shows whether a failure is in the backend, the connection or the frontend. Claude was most helpful for reading terminal output and screenshots and narrowing down the cause, and the defensive UI states in my own components turned out to be a debugging tool as well, since the error banner showed me that the page itself was working and only the request was failing. I still needed to understand the concepts to apply them: why CORS is needed, why Vite reads .env only at startup, and why the finally block should always clear the loading state, since the extension task asked me to reuse that pattern in a new component without the steps being spelled out. It also reinforced that I should verify each fix by checking the result myself rather than assuming a suggestion has worked.
