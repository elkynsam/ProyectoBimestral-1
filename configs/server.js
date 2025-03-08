'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import categoryRoutes from "../src/categories/category.routes.js"
import productRoutes from "../src/products/product.routes.js"
import billsRoutes from "../src/bills/bill.routes.js"
import cartRoutes from "../src/carts/cart.routes.js"
import Category from "../src/categories/category.model.js"
import Usuario from "../src/users/user.model.js"
import { hash } from "argon2"



const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) =>{
        app.use("/onlineSale/v1/auth", authRoutes);
        app.use("/onlineSale/v1/users", userRoutes);
        app.use("/onlineSale/v1/categories", categoryRoutes);
        app.use("/onlineSale/v1/products", productRoutes);
        app.use("/onlineSale/v1/bills", billsRoutes);
        app.use("/onlineSale/v1/carts", cartRoutes);
}

const crearAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ email: "admin@gmail.com" });

        if (!adminExistente) {

            const passwordEncriptada = await hash("Admin123");

            const admin = new Usuario({
                name: "Admin",
                surname: "Principal",
                username: "admin",
                email: "admin@gmail.com",
                phone: "12345678",
                password: passwordEncriptada,
                role: "ADMIN_ROLE"
            });

            await admin.save(); 
            console.log("Administrador creado exitosamente.");
        } else {
            console.log("El administrador ya existe.");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error);
    }
};

const initializeCategories = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            await Category.create({ name: "General" });
            console.log("Categoría por defecto creada: General");
        } else {
            console.log("Categoría por defecto ya existente");
        }
    } catch (error) {
        console.error("Error al inicializar categorías:", error);
    }
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion Exitosa Con La Base De Datos");
        await initializeCategories();
    } catch (error) {
        console.log("Error Al Conectar Con La Base De Datos", error);
    }
}

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    await conectarDB();
    await crearAdmin();
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Server Running On Port ${port}`);
    });
}