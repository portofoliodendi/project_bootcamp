import fetch from "node-fetch";
import { expect } from "chai";
import Ajv from "ajv";
import schema from "../schema/schema.js";

const BASE_URL = "https://belajar-bareng.onrender.com/api";
const ajv = new Ajv();

describe("API Automation: Login & Add User", function () {
    
    // --- INPUT DATA ---
    const inputUser = "Minah";
    const inputAge = 29;
    // ------------------

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
});