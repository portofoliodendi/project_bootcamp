import fetch from "node-fetch";
import { expect } from "chai";
import Ajv from "ajv";
import schema from "../schema/schema.js";

const BASE_URL = "https://belajar-bareng.onrender.com/api";
const ajv = new Ajv();

describe("API Automation: Login, Add User & Validasi User", function () {
    
    // --- INPUT DATA ---
    const inputUser = "sulung";
    const inputAge = 29;

    let token = "";

    it("1. Login - Get Authorization Token", async function () {
        const loginPayload = { username: "admin", password: "admin" };
        
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginPayload)
        });

        const data = await response.json();
        expect(response.status).to.equal(200);
        
        token = data.token;
        expect(token).to.not.be.empty;
        console.log("✅ Berhasil mendapatkan token.");
    });

    it("2. Add User - Create & Validate Schema", async function () {
        const userPayload = { 
            username: inputUser, 
            age: inputAge 
        };

        const response = await fetch(`${BASE_URL}/add-user`, { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userPayload)
        });

        const data = await response.json();

        if (response.status !== 200 && response.status !== 201) {
            console.log("❌ Gagal menambahkan user! Respon Server:", data);
        }

        expect(response.status).to.be.oneOf([200, 201]);

        const validate = ajv.compile(schema);
        const valid = validate(data);
        
        if (!valid) {
            console.log("❌ Schema Error:", validate.errors);
        }
        expect(valid, "Struktur JSON Add User tidak sesuai!").to.be.true;

        expect(data.username).to.equal(inputUser);
        console.log(`✅ Berhasil menambahkan '${inputUser}' sebagai user dan dibuat dengan Schema yang valid.`);
    });

    it("3. Get Users - Verify User in List", async function () {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        expect(response.status).to.equal(200);
        const userList = data.users || data;
        const userFound = userList.find(user => user.username === inputUser);
        expect(userFound, `User '${inputUser}' tidak ditemukan dalam list user!`).to.not.be.undefined;
        expect(Number(userFound.age)).to.equal(inputAge);

        console.log(`✅ Verifikasi Sukses: User '${inputUser}' berhasil ditemukan di dalam daftar user.`);
    });
});