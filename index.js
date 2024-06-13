import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BlogWebsite",
    password : "root",
    port : 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true}));

let blogarr = [];

async function getallblogs(){
    const result = await db.query("SELECT id,Blogname,BlogContent FROM Blogs;")
    blogarr = result.rows;
    //console.log(result.rows);
}



var idx = -1;

app.get("/",async(req,res) => {
    await getallblogs();
    res.render("index.ejs",{
        blogarr : blogarr
    });
})

app.get("/read", async(req, res) => {

    //Before database is connected
    //res.render("read.ejs", { blog: blog });
    
    
    // Code After database is connected

    const id = req.query.id; // Get the id from the query parameter
    //console.log(id);

    try{

        let result = await db.query("SELECT * FROM Blogs WHERE id = $1",[id]);
        let data = result.rows;
        //console.log(data);
        res.render("read.ejs",{
            blog : data
        })
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error reading blog");
    }
    
});

app.post("/submit",async (req,res) => {
    var blogname = req.body['blogName'];
    var blogbody = req.body['blogBody'];

    // Before database is connected
    
    // var blgarr = [blogname , blogbody];
    // blogarr.push(blgarr);
    // res.render("index.ejs",{
    //      blogarr : blogarr
    //})

    // After database is connected

    try{
        await db.query("INSERT INTO Blogs (Blogname,BlogContent) VALUES ($1,$2);",[blogname,blogbody]);
        res.redirect("/");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error submitting blog");
    }


    
})

app.get("/edit", async(req,res) => {

    // Code before Database is connected

    // const index = req.query.index;
    // var blgarr = blogarr[index];
    // console.log(index);
    // console.log(blogarr[index]);
    // idx = index;
    // //res.render("index.ejs");
    // res.render("edit.ejs",{
    //     blogarr : blgarr
    // })

    // Code After Database is connected

    const id = req.query.id; // Get the id from the query parameter
    console.log(id);

    try{

        let result = await db.query("SELECT * FROM Blogs WHERE id = $1",[id]);
        let data = result.rows;
        //console.log(data);
        res.render("edit.ejs",{
            blog : data
        })
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error reading blog");
    }
})

app.post("/edit-render", async(req,res) => {

    // Code Before Database is Connected 

    // var blogname = req.body['blogName'];
    // var blogbody = req.body['blogBody'];
    // var blgarr = [blogname , blogbody];
    // blogarr[idx] = blgarr;

    // res.render("index.ejs",{
    //     blogarr : blogarr
    // })

    // Code After Database is connected

    //console.log(req.body['id']);
    var id = req.body['id']
    var blogname = req.body['blogName'];
    var blogbody = req.body['blogBody'];

    try{

        await db.query("UPDATE Blogs SET blogname = $1 WHERE id = $2",[blogname,id]);
        await db.query("UPDATE Blogs SET blogcontent = $1 WHERE id = $2",[blogbody,id]);
        res.redirect("/");

    }
    catch(err){
        console.error(err);
        res.status(500).send("Error editing blog");
    }

})

app.post("/delete",async(req,res) => {

    // Code Before Database is connected

    // const index = req.query.index; 
    // console.log(blogarr[index]);
    // blogarr.splice(index,1);
    // res.render("index.ejs",{
    //     blogarr : blogarr
    // })

    //Code After database
    const id = req.body['id'];
    try {
        await db.query("DELETE FROM Blogs WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting blog");
    }


})
app.listen(port , () => {
    console.log("The website is live at port 3000");
})

