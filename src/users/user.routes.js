import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser, unsubscribe} from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarRol } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get("/",validarJWT, getUsers);

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID Valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/unsubscribe",
    [
        validarJWT,
        validarRol(["CLIENT_ROLE", "ADMIN_ROLE"])
    ],
    unsubscribe
);

router.delete(
    "/:id",
    [
        validarJWT,
        validarRol("ADMIN_ROLE"),
        check("id", "No es un ID Valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)


export default router;