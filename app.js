import express from "express"
import mongoose, { mongo } from "mongoose"
import dotenv from "dotenv"
import { Post, User, Comment } from "./models/schema.js"
dotenv.config()

const app = express()
const port = 3000


let conn = await mongoose.connect(process.env.conn)

//parse json bodies
app.use(express.json())

//parse url encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }))


app.use(express.static("public"))//this serves files at root , so no need to add /public in path of its elements
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render("sign")
}).post("/signup", async (req, res) => {
    try {
        const { username, email, pass, repass } = req.body //req.body contains all the data sent by form at this endpoint

        if (pass != repass) {
            return res.status(400).json({ error: 'Passwords do not match' })
        }
        const newUser = new User({ username: username, email: email, passwd: pass })
        await newUser.save()

        //send success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { username: username, email: email }
        })
    }
    catch (error) {
        res.status(201).json({
            success: false,
            error: 'Server error:' + error.message
        })
    }
}).post("/login", async (req, res) => {
    try {
        const { username, pass } = req.body

        if (!username || !pass) {
            return res.status(400).json({ error: "username and password required" })

        }
        const User1 = await User.findOne({ username: username })

        if (!User1) {
            return res.status(404).json({ error: 'User not found ', message: "Don't have an account create one", action: "signup" })
        }


        if (!(pass === User1.passwd)) {
            return res.status(401).json({
                error: 'Invalid password'
            })
        }
        // if not active then found valid  

        //if suuceesful then send res to client server 
        res.status(200).json({
            message: 'Login Succesful',
            redirect: `/${User1.username}`,
            user: { username: User1.username, email: User1.email }
        })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Server error during login' })
    }


}).get("/:slug", async (req, res) => {
    let posts = await Post.find({}).populate("userId", "username")
    let user = req.params.slug
    let user1 = await User.findOne({ username: user }).populate("post")
    console.log(user1)
    res.render("public", { posts: posts, user: user1, curUser: user1._id })


}).get("/:slug/comment", async (req, res) => {
    let user = req.params.slug
    let postid = req.query.postId
    let userPost = await Post.findById(postid).populate("userId", "username")
    console.log(userPost)
    let user1 = await User.findOne({ username: user }).populate("post")
    console.log(user1._id)
    let comments = await Comment.find({ post: postid }).populate("author", "username")
    console.log(comments)

    res.render("comments", { post: userPost, user: user1, comments: comments })


}).get("/:slug/:slug2", async (req, res) => {
    if (req.params.slug === req.params.slug2) {
        let posts = await Post.find({}).populate("userId", "username")
        let user = req.params.slug
        let user1 = await User.findOne({ username: user }).populate("post")
        console.log(user1)
        res.render("public", { posts: posts, user: user1, curUser: user1._id })
    }
    else {
        let posts = await Post.find({}).populate("userId", "username")
        let user = req.params.slug2
        let self = req.params.slug
        let self2 = await User.findOne({ username: self })
        let user1 = await User.findOne({ username: user }).populate("post")


        res.render("profile", { posts: posts, user: user1, curUser: user1._id, self: self2._id })
    }


}).post("/:slug/post", async (req, res) => {
    const { content } = req.body
    const userId1 = req.params.slug
    let user1 = await User.findOne({ username: userId1 })
    if (!content) {
        return res.status(400).json({ message: 'Content is required' })

    }
    try {

        const newPost = new Post({ userId: user1, content: content })
        await newPost.save()
        user1.post.push(newPost._id)
        await user1.save()
        res.status(201).json({ message: 'saved post successfully.' })
    }
    catch (error) {
        console.error("Error while saving:", error)
    }
}).post("/:slug/comment", async (req, res) => {
    console.log(req.query.postId.split("/")[0])
    const { content } = req.body
    const userId1 = req.params.slug

    const postid = req.query.postId.split("/")[0]
    let post = await Post.findById(postid)

    let user1 = await User.findOne({ username: userId1 })
    if (!content) {
        return res.status(400).json({ message: 'Content is required' })

    }
    try {
        const newCom = new Comment({ content: content, author: user1._id, post: postid })
        post.comments.push(newCom._id)
        await newCom.save()
        await post.save()
        res.status(201).json({ message: 'commented successfully.' })
    }
    catch (error) {
        console.error("Error while saving:", error)
    }
}).post("/:slug/bio", async (req, res) => {
    const { bio } = req.body
    const userId = req.params.slug
    let user1 = await User.findOne({ username: userId })
    if (!bio) {
        return res.status(400).json({ message: 'Content is required' })

    }
    try {

        user1.bio = bio
        await user1.save()

        res.status(201).json({ message: 'bio added' })
    }
    catch (error) {
        console.error("Error while bioing:", error)
    }
}).post("/:slug/:slug2/follow", async (req, res) => {
    let user1 = req.params.slug2
    let user2 = req.params.slug
    let user11 = await User.findOne({ username: user1 })
    let user22 = await User.findOne({ username: user2 })
    try {

        let followers = user11.followers
        if (!followers.includes(user22._id)) {
            user11.followers.push(user22._id)
            user22.following.push(user11._id)
            await user11.save()
            await user22.save()
            res.status(201).json({ message: "added" })
        }
        else {
            user11.followers.pull(user22._id)
            user22.following.pull(user11._id)
            await user11.save()
            await user22.save()
            console.log(user11)
            console.log(user22)
            res.status(201).json({ message: "removed" })
        }


    }
    catch (error) {
        console, log(error)
    }



}).post("/:slug/:postId", async (req, res) => {
    const postId = req.params.postId

    const user1 = req.params.slug
    let userId = await User.findOne({ username: user1 })
    const { reaction } = req.body
    if (!reaction) {
        return res.status(400).json({ message: "Reaction req." })
    }
    try {
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "not found" })

        }

        const isliked = post.likes.includes(userId._id)
        const isdis = post.dislikes.includes(userId._id)
        let action = "none"

        if (reaction === "like") {
            if (isliked) {
                post.likes.pull(userId._id)
                action = "unliked"

            }
            else {
                post.likes.push(userId._id)
                action = "liked"
            }
            if (isdis) {
                post.dislikes.pull(userId._id)
            }
        }
        else if (reaction === "dislike") {
            if (isdis) {
                post.dislikes.pull(userId._id)
                action = "undisliked"

            }
            else {
                post.dislikes.push(userId._id)
                action = "disliked"
            }
            if (isliked) {
                post.likes.pull(userId._id)
            }

        }
        await post.save()

        res.status(200).json({ message: `${action} done` })
    } catch (error) {
        console.log("error:", error)
    }
})


app.listen(port, () => {
    console.log(`example app listening on port http://localhost:${port}`)
}) 