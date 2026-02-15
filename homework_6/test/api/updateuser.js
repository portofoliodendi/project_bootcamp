import fetch from "node-fetch";
import { expect } from "chai";

const BASE_URL = "https://belajar-bareng.onrender.com/api";

describe("API Update Functionality: Find & Modify User", function () {
    
    // --- TARGET DATA ---
    const targetName = "Usertest2"; // Nama yang mau dicari di list
    const newName = "Jule"; // Nama baru setelah diupdate
    const newAge = 26; // Umur baru
    // --------------------

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

    it(`2. Get Users - Find ID for '${targetName}'`, async function () {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        const userList = data.users || data;

        // Cari user (Case Insensitive)
        const targetUser = userList.find(u => 
            u.username.toLowerCase() === targetName.toLowerCase()
        );

        expect(targetUser, `Target '${targetName}' gak ketemu di database!`).to.not.be.undefined;
        userIdFound = targetUser.userId;
        console.log(`\t🎯 Target ditemukan! ID: ${userIdFound}`);
    });

    it("3. Update User - Change Name and Age", async function () {
        const updatePayload = {
            username: newName,
            age: newAge
        };

        const response = await fetch(`${BASE_URL}/update-user/${userIdFound}`, {
            method: 'PUT', // Biasanya update pake PUT atau PATCH, sesuaikan dengan API lu
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatePayload)
        });

        expect(response.status).to.be.oneOf([200, 204]);

        const resData = await response.json();
        console.log(`\t✅ Update Berhasil! Pesan: ${resData.message || "User Updated"}`);
    });

    it("4. Verify Update - Check if data changed", async function () {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        const userList = data.users || data;

        // Cari user dengan ID yang sama tadi
        const updatedUser = userList.find(u => u.userId === userIdFound);

        // Validasi apakah data sudah berubah sesuai payload di step 3
        expect(updatedUser.username).to.equal(newName);
        expect(Number(updatedUser.age)).to.equal(newAge);

        console.log(`\t✨ Verifikasi Sukses: Nama sekarang '${updatedUser.username}' dan umur '${updatedUser.age}'`);
    });
});