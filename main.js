import express from "express"   
import { createClient, REDIS_FLUSH_MODES } from "redis";
const app = express();

const redis = createClient({ url : 'redis://localhost:6379' });
redis.connect();


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

    res.send("Hola");
})

app.get("/get", async (req, res)=> {
    const data = await redis.get('info:03578');
    console.log(data);
    const json = JSON.parse(data);
    console.log(json)
    res.send(data)

})


app.listen(8000, ()=> {
    console.log("Hello");
})