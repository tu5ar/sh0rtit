const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const crypto = require("crypto");
const supabaseURL = "https://fgzrvuqqusxvmszfxbrq.supabase.co";
const supabaseKey = "sb_publishable_zN7LIQuGisQvooBKMas2Zg_HizlMvDu";
const supabase = createClient(supabaseURL, supabaseKey);
const path = require("path");

const app = express();
app.use(express.json());

app.use(express.static("public"));

async function addRecord(longURL, shortURL) {
  const { data, error } = await supabase
    .from("main")
    .insert([{
      original_link: longURL, short_link: shortURL
    }]);
  if (error) {
    console.log("ERROR: ", error);
    return;
  } else {
    return 1;
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/new/", async (req, res) => {
  const longURL = req.body.original_link;
  const shortURL = shortHash(longURL);
  const status = await addRecord(longURL, shortURL);
  res.send(shortURL);
})

app.get("/api/:id", async (req, res) => {
  const shortURL = req.params.id;
  const data = await getRecord(shortURL);
  res.redirect(302, data["original_link"]);
})

app.listen(3000, () => {
  console.log("server running")
})
