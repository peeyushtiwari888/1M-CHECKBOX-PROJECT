import 'dotenv/config';
import http from "node:http"
import express from "express"
import path from "node:path"
import session from "express-session"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

import { Server } from "socket.io"
async function main() {
    const app = express();
    const rateLimitingHashMap = new Map();
    const server = http.createServer(app);

    passport.use(new GoogleStrategy({
        clientID: process.env.OAUTH_CLIENT_ID || 'dummy_client_id',
        clientSecret: process.env.OAUTH_CLIENT_SECRET || 'dummy_client_secret',
        callbackURL: process.env.OAUTH_CALLBACK_URL || "http://localhost:8000/auth/google/callback"
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    const sessionMiddleware = session({
        secret: process.env.SESSION_SECRET || "super_secret_string",
        resave: false,
        saveUninitialized: false
    });

    app.use(sessionMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/');
    });
    app.get('/auth/logout', (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    });
    app.get('/api/user', (req, res) => {
        res.json(req.user || null);
    });
    const PORT = process.env.PORT || 8000;
    app.get('/health', (req, res) => {
        res.json({
            health: true
        });
    });

    const CHECKBOX_COUNT = 500;
    const checkboxes = new Array(CHECKBOX_COUNT).fill(null);




    const io = new Server();
    io.attach(server);
    io.engine.use(sessionMiddleware);
    // socket handler
    io.on('connection', (socket) => {
        console.log("Socket connected", { id: socket.id });
        socket.emit("server:checkbox:status", checkboxes);

        socket.on("client:checkbox:change", (data) => {
            if (!socket.request.session || !socket.request.session.passport || !socket.request.session.passport.user) {
                socket.emit("server:error", { data, message: "You must be logged in to modify checkboxes." });
                return;
            }
            console.log(`Received checkbox change from client: ${socket.id}, Data:`, data);
            let lastOperationTime = rateLimitingHashMap.get(socket.id);
            if (lastOperationTime) {
                // if bellow 5 second don't allow
                if (lastOperationTime + 5000 > Date.now()) {
                    socket.emit("server:error", { data, message: "You are doing that too much. Please wait a moment before trying again." });
                    return;
                }
                else {
                    rateLimitingHashMap.set(socket.id, Date.now());
                }
            }
            else {
                rateLimitingHashMap.set(socket.id, Date.now());
            }
            checkboxes[data.index] = data.checked;
            io.emit("server:checkbox:change", data);
        })
    })


    // Express handler 
    app.use(express.static(path.resolve('./public')))
    server.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
    })

}
main();