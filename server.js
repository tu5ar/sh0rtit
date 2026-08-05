const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const crypto = require("crypto");
const vhost = require("vhost");

const supabaseURL = "https://fgzrvuqqusxvmszfxbrq.supabase.co";
const supabaseKey = "sb_publishable_zN7LIQuGisQvooBKMas2Zg_HizlMvDu";
const supabase = createClient(supabaseURL, supabaseKey);

const sh0rtitApp = express();
const domain = "tu5ar.dev";

const mainApp = express()

mainApp.use(express.json());
mainApp.use(express.static("public"));

async function addRecord(longURL, shortURL) {
  const { data, error } = await supabase
    .from("main")
    .insert([{
      original_link: longURL, short_link: shortURL
    }]);
  if (error) {
    console.log("ERROR: ", error);
    return;
  }
}

async function getRecord(shortURL) {
  const { data, error } = await supabase
    .from("main")
    .select("original_link")
    .eq("short_link", shortURL)
    .single();

  if (error) {
    console.log("ERROR: ", error);
    return;
  }
  return data;
}

function shortHash(longURL) {
  return crypto.createHash("sha256")
    .update(longURL)
    .digest("hex")
    .slice(0, 6);
}

mainApp.post("/api/new/", (req, res) => {
  //const longURL = req.params.id;
  const longURL = req.body.original_link;
  const shortURL = shortHash(longURL);
  addRecord(longURL, shortURL);
  res.send(shortURL);
})

sh0rtitApp.get("/:id", async (req, res) => {
  const shortURL = req.params.id;
  const data = await getRecord(shortURL);
  res.redirect(302, data["original_link"]);
})

mainApp.use(vhost("sh0rtit.${domain}", sh0rtitApp));

mainApp.listen(3000, () => {
  console.log("server running")
})
