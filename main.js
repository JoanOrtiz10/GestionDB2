import express, { response } from "express"   
import { createClient, REDIS_FLUSH_MODES } from "redis";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

//clase 9 Marzo 

const client= new MongoClient("mongodb://localhost:27017")

const connection = async () => {

    try{
        await client.connect();
        return client.db("test")
        }catch (e){
            console.log("========ERROR======");
            console.log(e);

        }
}

app.get("/post", async (req,res)=>{
const db = await connection();
const torneo = db.collection("torneo")
const result=  torneo.insertOne({
    "nombre":'Joan',
    "apellido ":' Ortiz'
})
 res.json(result)
})


app.get("/getMongo/:id", async (req,res)=>{
    const {id}= req.params;
    const db = await connection();
    const torneo = db.collection("torneo")
    const objectId = new ObjectId(id)
    const result=  await torneo.findOne({ _id :objectId })
    console.log(id,objectId);
    res.json(result)


})








// const redis = createClient({ url : 'redis://localhost:6379' });
// redis.connect();


app.get("/save", async(req, res)=> {
    const json = {
        "nombre": "Joan",
        "apellido": "Ortiz"
    }
    await redis.set(
        'info:03578',
        JSON.stringify(json),
        {
            EX: 60
        }

    )

    res.send("Hola beach");
})

app.get("/get", async (req, res)=> {
    const data = await redis.get('info:03578');
    console.log(data);
    const json = JSON.parse(data);
    console.log(json)
    res.send(data)

})
app.get("/update", async (req, res)=> {
    const edad= 32;
    let data= await redis.get("info:03578")
    if(!data){
        return res.json({'succes': false,'data':[],'msg':'not found'},404) 
    }

    let json = data.parse(data);
    json.edad=edad;
    const response = await redis.set('info:03578',
        json.stringify(json)
      
     )
     const r =await redis.set('info:03578');
     res.json({"succes": response =='ok',data :r,msg:response},200)
})

app.get('/hset', async (req,res)=>{

    const response= await redis.hSet('info:03578',{
        
        'name':'Joan',
        'lastname':'Ortiz',
        'age':32


    })
    await redis.expire('info:03578',300)
    res.send(response)
})

app.get('/getHas',async(req,res)=>{

    const response= await redis.hGetAll('info:03578');
    const ttl = await redis.ttl('info:03578')
    res.json({succes:true , data:response,ttl})


})

app.get('/delete', async (req,res)=>{
// const data = await redis.hDel('info:03578')
const data= await redis.hDel('info:03578','age')

const data2 = await redis.hSet('info:03578', 'company','ufpso')
const response =   await redis.hGetAll ('info:03578')
res.send(response)

})

app.listen(8000, ()=> {
    console.log("Hello");
})