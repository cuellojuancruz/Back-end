const express = require("express");
const app = express();
const fs = require("fs");
const { resolve } = require("path");

//Esto concatenara un string de la direccion de la carpeta mas el archivo segun el sistema operativo que uses
const path = require('path')

// funcion donde concateno el path para utilizarlo en la misma carpeta
const pathFin = (archivo) => {
    return path.join(__dirname, archivo)
}

class Contenedor {

    constructor(archivo) {
        this.archivo = archivo
        this.id = 1
        this.read = null
        this.products = []
        this.random = {}
    }

    // async existe(){
    //     await fs.readFile(pathFin(this.archivo), "utf-8", (err, data) => {
    //         if (!data) {
    //             // console.log({ data })
    //             fs.writeFileSync(this.archivo, '[]')
    //             console.log('El archivo ya fue creado con su contenido : [] ')
    //         } else {
    //             console.log({ data })
    //             // console.log(`el archivo ya existe.
    //             // aqui esta la informacion: ${data}`)
    //         }
    //     })
    // }

    async save(producto) {
        // await this.existe();
        fs.readFile(this.archivo, "utf-8", (err, data) =>{
            if(err){
                throw new Error("hubo un error, revisa el codigo pa")
            }
            this.read = JSON.parse(data)
            if(this.read.length === 0){
                console.log(this.read[this.read.length-1])
                producto.id = this.id
                this.read.push(producto)
                fs.unlink(this.archivo, err => {
                    if(err){
                        throw new Error("hubo un error, revisa el codigo pa")
                    }
                })
                fs.appendFile(this.archivo, String(JSON.stringify(this.read)), err =>{
                    if(err){
                        throw new Error("hubo un error, revisa el codigo pa")
                    }
                })
            }else{
                this.read = JSON.parse(data)
                console.log(this.read[this.read.length-1])
                producto.id = this.read[this.read.length-1].id + 1
                this.read.push(producto)
                fs.unlink(this.archivo, err => {
                    if(err){
                        throw new Error("hubo un error, revisa el codigo pa")
                    }
                })
                fs.appendFile(this.archivo, String(JSON.stringify(this.read)), err =>{
                    if(err){
                        throw new Error("hubo un error, revisa el codigo pa")
                    }
                })
            }
        })            
    }


    async getById(id) {
        // await this.existe();
        return new Promise ((resolve, reject) => {
            fs.readFile(this.archivo, "utf-8", (err, data) => {
                if (err) {
                    reject("ocurrio un error inesperado, revisa el codigo pa")
                }
    
                let product = JSON.parse(data)
                this.random = product.find(product => product.id === id)
                resolve("ok")
            })
        }) 
    }

    getAll() {
        // await this.existe();
        // let products
        return new Promise((resolve, reject) => {
            fs.readFile(this.archivo, "utf-8", (err, data) => {
                if (err) {
                    reject("ocurrio un error inesperado, revisa el codigo pa")
                    // throw new Error("ocurrio un error inesperado, revisa el codigo pa")
                }
                this.products = JSON.parse(data)
                resolve("ok")
            })
        }) 
    }

    async deleteById(id) {
        // await this.existe();
        fs.readFile(this.archivo, "utf-8", (err, data) => {
            if (err) {
                throw new Error("ocurrio un error inesperado, revisa el codigo pa")
            }
            let products = JSON.parse(data)
            let product = products.filter(product => product.id !== id)
            fs.writeFile(this.archivo, JSON.stringify(product), err => {
                if (err) {
                    throw new Error("ocurrio un error inesperado, revisa el codigo pa")
                }
            })
        })
    }

    deleteAll() {
        // otra forma seria borrar el archivo con fs.unlink y crear uno nuevo con append o write y metiendo solo un array vacio
        fs.writeFile(this.archivo, JSON.stringify([]), err => {
            if (err) {
                throw new Error("ocurrio un error inesperado, revisa el codigo pa")
            }
        })
    }

}



let contenido = new Contenedor("producto.txt")
console.log("contenido")


const server = app.listen(8080, () => {
    console.log("escuchando el puerto 8080")
})

app.get("/productos",(req, res) => {
    contenido.getAll()
    .then((resp) => {
        res.send(contenido.products)
    })
    // console.log(contenido.products)
})

app.get("/productoRandom", (req, res) => {
    num = Math.floor(Math.random() * 3 + 1)
    contenido.getById(num)
    .then((resp) => {
        res.send(contenido.random)
    })
})

// app.get("/fyh", (req, res) => {

//     res.send(moment().format('MMMM Do YYYY, h:mm:ss a'))
// })



