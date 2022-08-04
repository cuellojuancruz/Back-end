const fs = require("fs");

class Contenedor {
  constructor(fileName) {
    this._filename = fileName;
    this._readFileOrCreateNewOne();
  }

  async _readFileOrCreateNewOne() {
    try {
      await fs.promises.readFile(this._filename, "utf-8");
    } catch (error) {
      error.code === "ENOENT"
        ? this._createEmptyFile()
        : console.log(
            `Error Code: ${error.code} | There was an unexpected error when trying to read ${this._filename}`
          );
    }
  }

  async _createEmptyFile() {
    fs.writeFile(this._filename, "[]", (error) => {
      error
        ? console.log(error)
        : console.log(`File ${this._filename} was created since it didn't exist in the system`);
    });
  }

  async getById(id) {
    id = Number(id);
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      return parsedData.find((producto) => producto.id === id);
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to get an element by its ID (${id})`
      );
    }
  }

  async deleteById(id) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeRemoved = parsedData.find(
        (producto) => producto.id === id
      );

      if (objectIdToBeRemoved) {
        const index = parsedData.indexOf(objectIdToBeRemoved);
        parsedData.splice(index, 1);
        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} does not exist in the file`);
        return null;
      }
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to delete an element by its ID (${id})`
      );
    }
  }

  async updateById(id, newData) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeUpdated = parsedData.find(
        (producto) => producto.id === id
      );
      if (objectIdToBeUpdated) {
        const index = parsedData.indexOf(objectIdToBeUpdated);
        const {title, price, thumbnail} = newData;

        parsedData[index]['title'] = title;
        parsedData[index]['price'] = price;
        parsedData[index]['thumbnail'] = thumbnail;
        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} does not exist in the file`);
        return null;
      }

    } catch (error) {
      `Error Code: ${error.code} | There was an error when trying to update an element by its ID (${id})`
    }
  }

  async save(object) {
    try {
      const allData = await this.getData();
      const parsedData = JSON.parse(allData);

      object.id = parsedData.length + 1;
      parsedData.push(object);

      await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
      return object.id;
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to save an element`
      );
    }
  }

  async deleteAll() {
    try {
      await this._createEmptyFile();
    } catch (error) {
      console.log(
        `There was an error (${error.code}) when trying to delete all the objects`
      );
    }
  }

  async getData() {
    const data = await fs.promises.readFile(this._filename, "utf-8");
    return data;
  }

  async getAll() {
    const data = await this.getData();
    return JSON.parse(data);
  }
}

module.exports = Contenedor;

// const express = require("express");
// const app = express();
// const fs = require("fs");
// const { resolve } = require("path");
// const { Router } = express;




// const router = Router();
// //Esto concatenara un string de la direccion de la carpeta mas el archivo segun el sistema operativo que uses
// const path = require('path')

// // funcion donde concateno el path para utilizarlo en la misma carpeta
// const pathFin = (archivo) => {
//     return path.join(__dirname, archivo)
// }

// class Contenedor {

//     constructor(archivo) {
//         this.archivo = archivo
//         this.id = 1
//         this.read = null
//         this.products = []
//         this.random = {}

//         router.get('/', this.getAll);
//         router.get('/:id', this.getById);
//         router.post('/', this.save);
//         router.put('/:id', this.updateProduct);
//         router.delete('/:id', this.deleteById);
//     }

//     // async existe(){
//     //     await fs.readFile(pathFin(this.archivo), "utf-8", (err, data) => {
//     //         if (!data) {
//     //             // console.log({ data })
//     //             fs.writeFileSync(this.archivo, '[]')
//     //             console.log('El archivo ya fue creado con su contenido : [] ')
//     //         } else {
//     //             console.log({ data })
//     //             // console.log(`el archivo ya existe.
//     //             // aqui esta la informacion: ${data}`)
//     //         }
//     //     })
//     // }

//     save(req, res) {
//         // await this.existe();

//     let product = req.body.product

//     if(product){
//         fs.readFile(this.archivo, "utf-8", (err, data) =>{
//             if(err){
//                 throw new Error("hubo un error, revisa el codigo pa")
//             }
//             this.read = JSON.parse(data)
//             if(this.read.length === 0){
//                 producto.id = this.id
//                 this.read.push(producto)
//                 fs.unlink(this.archivo, err => {
//                     if(err){
//                         throw new Error("hubo un error, revisa el codigo pa")
//                     }
//                 })
//                 fs.appendFile(this.archivo, String(JSON.stringify(this.read)), err =>{
//                     if(err){
//                         throw new Error("hubo un error, revisa el codigo pa")
//                     }
//                     res.status(201).send("el producto se guardo correctamente")
//                 })
//             }else{
//                 this.read = JSON.parse(data)
//                 producto.id = this.read[this.read.length-1].id + 1
//                 this.read.push(producto)
//                 fs.unlink(this.archivo, err => {
//                     if(err){
//                         throw new Error("hubo un error, revisa el codigo pa")
//                     }
//                 })
//                 fs.appendFile(this.archivo, String(JSON.stringify(this.read)), err =>{
//                     if(err){
//                         throw new Error("hubo un error, revisa el codigo pa")
//                     }
//                     res.status(201).send("el producto se guardo correctamente")
//                 })
//             }
//         })            
//     }}


//     getAll(req, res) {
//         // await this.existe();
//         // let products
//         return new Promise((resolve, reject) => {
//             fs.readFile(this.archivo, "utf-8", (err, data) => {
//                 if (err) {
//                     reject("ocurrio un error inesperado, revisa el codigo pa")
//                     // throw new Error("ocurrio un error inesperado, revisa el codigo pa")
//                 }
//                 this.products = JSON.parse(data)
//                 resolve(this.products)
//                 res.status(201).send(this.products);
//             })
//         }) 
//     }


//     updateProduct(req, res) {
//         const { id } = req.params;
//         const productModify = req.body;
    
//         if (id >= 1 && id <= this.productos.length) {
//           const saveProduct = { ...productModify, id: parseInt(id) };
//           productos.splice(id - 1, 1, saveProduct);
//           res.status(201).send(saveProduct);
//         } else {
//           res.status(400).send({ error: 'producto no encontrado' });
//         }
//       };


//     getById(req, res) {
//         // await this.existe();
//         const id = req.params.id

//         return new Promise ((resolve, reject) => {
//             fs.readFile(this.archivo, "utf-8", (err, data) => {
//                 if (err) {
//                     reject("ocurrio un error inesperado, revisa el codigo pa")
//                 }
    
//                 let product = JSON.parse(data)
//                 this.random = product.find(product => product.id === id)
//                 resolve("ok")
//                 res.status(201).send(this.random);
//             })
//         }) 
//     }

//     async deleteById(res, req) {
//         // await this.existe();
//         const id = req.params.id

//         fs.readFile(this.archivo, "utf-8", (err, data) => {
//             if (err) {
//                 throw new Error("ocurrio un error inesperado, revisa el codigo pa")
//             }
//             let products = JSON.parse(data)
//             let product = products.filter(product => product.id !== id)
//             res.status(201).send(product)
//             fs.writeFile(this.archivo, JSON.stringify(product), err => {
//                 if (err) {
//                     throw new Error("ocurrio un error inesperado, revisa el codigo pa")
//                 }
//             })
//         })
//     }

//     deleteAll() {
//         // otra forma seria borrar el archivo con fs.unlink y crear uno nuevo con append o write y metiendo solo un array vacio
//         fs.writeFile(this.archivo, JSON.stringify([]), err => {
//             if (err) {
//                 throw new Error("ocurrio un error inesperado, revisa el codigo pa")
//             }
//         })
//     }

// }

// const productos = new Contenedor("C:\\Users\\KAKU1\\Desktop\\Back-Git\\Desafios\\producto.txt")

// module.exports = router;