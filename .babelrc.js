const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:3000"

module.exports = {
  presets: ["next/babel"],
  plugins: [
    "@babel/plugin-proposal-optional-chaining",
    [
      "transform-define",
      {
        "process.env.WEBSITE_URL": WEBSITE_URL,
        "process.env.CLIENT_ID": process.env.CLIENT_ID || "1985c46fd3574370929a01d37abe354e",
        "process.env.SPOFY_ACCOUNTS_URL":
          process.env.SPOFY_ACCOUNTS_URL || "https://accounts.spotify.com",
        "process.env.SPOFY_REDIRECT_URL":
          process.env.SPOKY_REDIRECT_URL || WEBSITE_URL + "/callback",
        "process.env.SPOFY_SERVICE_URL":
          process.env.SPOFY_SERVICE_URL || "https://api.spotify.com/v1"
      }
    ]
  ]
}
