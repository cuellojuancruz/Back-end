const socket = io()

socket.on('mi mensaje', data => {
    alert(data)
    socket.emit("notificacion", "mensaje recibido")
})