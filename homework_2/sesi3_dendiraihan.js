const tinggi_segitiga = 4;

for (let i = 1; i <= tinggi_segitiga; i++) {
  let baris_segitiga = "";

  for (let j = 1; j <= i; j++) {
    baris_segitiga += "*";
  }

  console.log(baris_segitiga);
}
