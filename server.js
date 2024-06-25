import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
    try {
        const allUsers = await prisma.users.findMany();

        res.status(201).json(allUsers);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post("/users", async (req, res) => {
    try {
        await prisma.users.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age,
            },
        });

        res.status(201).json(req.body);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.put("/users", async (req, res) => {
    try {
        const { email, name, age, new_email } = req.body;
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (user) {
            const newUser = await prisma.users.update({
                data: { name, age, email: new_email ? new_email : email },
                where: user,
            });
            res.json(newUser);
            return;
        }
        res.status(400).json({
            msg: "Usuário não encontrado",
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

app.delete("/users", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.users.findUnique({
            where: { email },
        });
        if (user) {
            await prisma.users.delete({
                where: user,
            });
            res.json(user);
            return;
        }
        res.status(401).json({
            msg: "Usuário não encontrado",
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

app.listen(3000);

console.log("");
console.log("[  Servidor Iniciado ]");
console.log("Executando em: http://localhost:3000");
