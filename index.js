const express = require("express");
const app = express(); // Change variable name to 'app'
const jwt = require("jsonwebtoken"); 
const secretKey = "ThisismysecretKey@123";

app.listen(3000, () => {
    console.log("listening to port number 3000"); 
});

app.use(express.json());


const logRequests = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


const validateSignup = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required." });
    }

    next();
};


app.use(logRequests);

// Routes
app.get("/home", authenticateToken, (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

app.post("/contact", authenticateToken, (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Request body is empty." });
    }

    console.log(req.body);
    
});


app.post("/signup", validateSignup, (req, res) => {
    
    res.json({ message: "Signup successful" });
});

app.post("/login",(req, res) => {
    const username = req.body.username;
    const user = { username: username };

    const token = jwt.sign(user, secretKey);
    res.json({token: token});
});
