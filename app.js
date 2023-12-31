const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us21.api.mailchimp.com/3.0/lists/9a4556c041";

	const options = {
		method: "POST",
		auth: "arthur1:0c7b7bb69e3c027181901fe2594ee7d5-us21",
	};

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
	});

	request.write(jsonData);
	request.end();
});

app.post("/failure", (req, res) => {
	res.redirect("/");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));
