import fetch from "node-fetch";
import { expect } from "chai";

const BASE_URL = "https://belajar-bareng.onrender.com/api";

describe("API Delete: Pick from List and Destroy", function () {
    
    // --- TARGET USER YANG MAU DIHAPUS ---
    const targetName = "karina"; // Ganti dengan nama yang mau lu incar
    // ------------------------------------

    let token = "";
    let userIdFound = "";

    it("1. Login - Get Token", async function () {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "admin" })
        });
        const data = await response.json();
        token = data.token;
        expect(response.status).to.equal(200);
    });

    it(`2. Get Users - Find ID for '${targetName}' (Case Insensitive)`, async function () {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    const userList = data.users || data;

    // --- TRIK CASE INSENSITIVE DI SINI ---
    const targetUser = userList.find(u => 
        u.username.toLowerCase() === targetName.toLowerCase()
    );
    // -------------------------------------

    expect(targetUser, `Target '${targetName}' gak ketemu di list!`).to.not.be.undefined;

    userIdFound = targetUser.userId;
    console.log(`\t🎯 Ketemu! Nama asli di DB: ${targetUser.username} | ID: ${userIdFound}`);
});

    it("3. Delete User - Execution", async function () {
        // Pastikan kita punya ID sebelum lanjut
        expect(userIdFound).to.not.be.empty;

        const response = await fetch(`${BASE_URL}/delete-user/${userIdFound}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });

        expect(response.status).to.be.oneOf([200, 204]);

        const data = await response.json();
        console.log(`\t🔥 Boom! Server say: ${data.message || "User deleted"}`);
    });

    it("4. Verify - Check list again", async function () {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        const userList = data.users || data;
        
        // Pastikan nama tadi beneran udah gak ada
        const checkAgain = userList.find(u => u.username === targetName);
        expect(checkAgain, `Waduh, si ${targetName} masih sakti, belum kehapus!`).to.be.undefined;
        
        console.log(`\t✅ Konfirmasi: ${targetName} sudah resmi jadi kenangan.`);
    });
});