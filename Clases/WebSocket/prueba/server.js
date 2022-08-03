const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


app.use(express.static("./public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname});
})


httpServer.listen(3000, () => console.log("SERVER ON"))

io.on("connection", (socket)=> {
    console.log("usuario conectado")
    socket.emit("mi mensaje", "Este es el mensaje desde el servidor")

    socket.on("notificacion", (data) => {
        console.log(data)
    })
});

io.on('connection', socket => {
    console.log('¡Nuevo cliente conectado!');


    /* Envio los mensajes al cliente que se conectó*/
    socket.emit('mensajes', mensajes);

    /*Escucho los mensajes enviados por el cliente y se los propago a todos*/
    socket.on('mensaje', data => {
        mensajes.push({ socketid: socket.id, mensaje: data })
        io.sockets.emit('mensajes', mensajes);
    });
});


