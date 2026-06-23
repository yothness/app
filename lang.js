const fs = require("node:fs/promises");
const readline = require("node:readline/promises");
const {
  stdin,
  stdout
} = require("node:process");
const O = require("./lang.json");
const languages = Object.entries(O).sort((a,b)=>(a[1].NAME.codePointAt(0) - b[1].NAME.codePointAt(0))).map(a=>a[0])
const T = {}

console.info("\n> Languages:", languages.join(", "));

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});
(async()=> {
  try {
    let key = "";

    while (!key) {
      key = (await rl.question("> Key: ")).trim();

      if (!key) {
        console.info("[ERR] Key is required.");
      }
    }
    for (const lang of languages) {
      T[lang] = O[lang]
      let value = "";

      while (!value) {
        value = (await rl.question(`> ${lang}: `)).trim();

        if (!value) {
          console.info("[ERR] Value is required.");
        }
      }

      T[lang][key] = value;
    }

    await fs.writeFile(
      "./lang.json",
      JSON.stringify(T, null, 2),
      "utf8"
    );

    console.info("[INFO] lang.json saved.");
  } finally {
    rl.close();
  }
})()