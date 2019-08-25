"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); //const express = require('express');

app.get("/", function (req, res) {
	return console.log("Hello express");
});

app.get("/greet", function (req, res) {
	res.json("Greeting from nodejs");
});

app.listen("3000", function (req, res) {
	return console.log("listenting on port number 3000");
});