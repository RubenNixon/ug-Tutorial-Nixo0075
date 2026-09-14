# Module 06 Devlog

## Proof of Completion

Figure 1  server.js showing the GET /api/students route conditionally filtering by a major query string, and the GET /api/students/:id route using a dynamic URL parameter to look up a single record.


Figure 2 server.js showing the logger middleware mounted globally, the checkAuth gatekeeper inserted into the DELETE route, and the four-parameter global error handler.



**Extension task completed successfully** [Yes]



## Concept Mapping

Identify the specific theoretical concepts from this week's lectures that you applied to solve the practical work for this week.

- **Concept 1** RESTful Routing — Query Strings vs Dynamic URL Parameters
  - **Implementation** I built a single GET /api/students route that behaves differently depending on whether a query string is present. If req.query.major exists, I use .filter() to return a subset of the array; otherwise I return the full array. Separately, I used a dynamic URL parameter (:id) on GET /api/students/:id, extracting it with req.params.id and parsing it to an integer, since Express always delivers params as strings, to look up one specific record with .find().

  Code snippet
  ```JS
  app.get('/api/students', (req, res) => {
    if (req.query.major) {
      const filtered = students.filter(st => st.major === req.query.major);
      return res.status(200).json(filtered);
    }
    res.status(200).json(students);
  });
  ```

- **Concept 2** Custom Middleware and Global Error Handling
  - **Implementation** I wrote a logger middleware function that runs on every request via app.use(logger), logging the method and URL before calling next() to pass control along. I also implemented a global error handler recognised by Express specifically because it takes four parameters (err, req, res, next), placed after all routes, which catches a deliberately thrown error from a test route and returns a 500 instead of letting the server crash. I applied the same middleware pattern again for checkAuth, inserting it directly into the DELETE route's signature so it runs before the deletion logic and can short-circuit the request with a 401 if the Authorization header doesn't match.

  Code snippet
  ```JS
  function checkAuth(req, res, next) {
    if (req.headers.authorization === "admin123") {
      return next();
    }
    res.status(401).json({ error: "Unauthorized" });
  }

  app.delete('/api/students/:id', checkAuth, (req, res) => {
    const targetId = parseInt(req.params.id);
    students = students.filter(st => st.id !== targetId);
    res.status(204).send();
  });
  ```

## AI Transparency and Critical Reflection

Detail how Generative AI was used during this lab.

**Table 1 AI Tool Usage Log**

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
| --- | --- | --- | --- |
| Claude | Debugging requests.http showing no "Send Request" links | Explained that clicking Send Request just showed a blank/black response pane after a few seconds | Modified — Claude identified that removing the ### comment lines (which I'd asked for earlier to tidy the file) actually broke the REST Client extension's request separators. I put the ### lines back myself and confirmed the Send Request links reappeared. |
| Claude | Debugging npm run dev failing with ENOENT | Pasted terminal output showing npm error enoent Could not read package.json from the repo root | Modified — Claude pointed out I was in the wrong directory (repo root instead of tutorials/t06) and that I'd also typed the command in the wrong order (run npm dev instead of npm run dev). I corrected both myself. |
| Claude | Confirming a 200 response wasn't actually an error | Shared a screenshot of the REST Client response pane after sending a GET request | Modified — Claude read the actual response headers (200 OK, Content-Length) from the screenshot and explained the "black screen" was a UI rendering overlap, not a failed request. I scrolled down in the panel myself to confirm the JSON body was there. |

## Analysis and Implications

AI was most useful this week for interpreting terminal output and tooling behaviour rather than writing the Express logic itself — for example, recognising that REST Client depends on the ### separators structurally rather than cosmetically, and that a blank-looking response pane can still contain a valid 200 response underneath a rendering glitch. I still had to understand how query strings, dynamic route parameters, and middleware ordering work to actually build the routes correctly, since Claude explained the reasoning behind each pattern (e.g. why the four-parameter signature is what Express uses to detect an error handler) rather than just supplying code to paste in. This reinforced for me that debugging skills — reading a terminal error carefully, checking your working directory, checking process state — are just as important as knowing the framework syntax, and that AI is more reliable as a second pair of eyes on those symptoms than as an oracle that always gets the first answer right.

---

# Module 07 Devlog

## Proof of Completion

Provide a minimum of two screenshots OR one short GIF (under 10 seconds) demonstrating the completed work running in your Codespace.

Figure 1 server.js showing the connectDB async function, using await mongoose.connect() inside a try/catch block with process.exit(1) on fail


Figure 2 models/Topic.js showing required fields with custom error messages, a Boolean field with a default value, and an array-of-strings field, alongside the timestamps option.



**Extension task completed successfully** [Yes]



## Concept Mapping

Identify the specific theoretical concepts from this week's lectures that you applied to solve the practical work for this week.

- **Concept 1** Asynchronous Database Connections and Fail-Fast Error Handling
  - **Implementation** I wrote connectDB as an async function using await mongoose.connect(process.env.MONGO_URI) inside a try/catch block, so the server doesn't attempt to start operating before the database handshake completes. In the catch block I deliberately call process.exit(1) rather than letting the server continue running, on the principle that a server without a working database connection should crash loudly and immediately rather than stay up in a broken, unusable state.

  Code snippet
  ```JS
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully! ");
    } catch (error) {
      console.error("MongoDB connection failed: ", error.message);
      process.exit(1);
    }
  };
  ```

- **Concept 2** Schema Design, Validation, and Default Values with Mongoose
  - **Implementation** I defined two schemas, User and Topic, using required fields with custom error messages (e.g. username, title, units), a unique constraint on email to enforce a business rule at the database level, and default values (role defaulting to "student", isActive defaulting to true) so the schema fills in sensible values when a client omits them. Both schemas also used the { timestamps: true } option so Mongoose automatically manages createdAt and updatedAt fields without any manual code.

  Code snippet
  ```JS
  const topicSchema = new mongoose.Schema(
    {
      title: { type: String, required: [true, "Please provide a title."] },
      isActive: { type: Boolean, default: true },
      units: { type: Number, required: [true, "Please provide the number of units."] },
      prerequisites: { type: [String] }
    },
    { timestamps: true }
  );
  ```

## AI Transparency and Critical Reflection

Detail how Generative AI was used during this lab.

**Table 1 AI Tool Usage Log**

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
| --- | --- | --- | --- |
| Claude | Debugging a MongoDB getaddrinfo ENOTFOUND mongo error | Pasted the terminal error after npm run dev failed to connect to the database | Modified — Claude explained that the hostname mongo only resolves inside a Docker Compose network, but my server was running directly on the Codespace host against a manually-started container. I changed MONGO_URI in .env to use localhost instead, and manually started the Mongo container myself with docker start mongo. |
| Claude | Debugging Cannot POST /api/test-setup despite the route existing in server.js | Pasted the 404 response and, on request, the output of ps aux \| grep node | Modified — Claude spotted that an old t06 nodemon process was still running in the background and occupying port 5100, intercepting requests meant for t07. I killed the stray processes myself using the PIDs from ps aux and restarted only the t07 server. |
| Claude | Debugging a SyntaxError: Unexpected non-whitespace character in a POST request body | Pasted the current contents of requests.http on request | Modified — Claude identified that two POST requests had been pasted into the file back-to-back without a ### separator, so the body parser was reading both JSON objects as one malformed blob. I restructured the file with ### separators myself. |

## Analysis and Implications

This module highlighted how much of backend debugging is actually about environment and process state rather than the code itself — the getaddrinfo error, the stray server process, and the malformed request body were all cases where the Mongoose/Express code I'd written was correct, but something external to it (a container's network scope, a leftover background process, a missing file separator) was causing the failure. Claude was useful for narrowing down which category a given error fell into (e.g. distinguishing a genuine code bug from an infrastructure issue like Docker networking) and explaining the underlying mechanism rather than just prescribing a fix, which meant I understood why localhost worked where mongo didn't, rather than just pasting in a working value. I did have to independently understand schema validation, defaults, and the required error-message array syntax to design the User and Topic schemas correctly, since that logic came from the lecture material rather than the AI. This module also reinforced the importance of verifying claims practically — rather than trusting that a fix would work, I re-ran the request and checked the terminal/database directly each time, which is the same critical-evaluation habit called out in the AI transparency expectations for this course.
