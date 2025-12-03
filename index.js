import express from "express";
import Listing from "./models/Listing.js";
import mongoose from "mongoose";

const app = express();

app.use(express.json());


main().catch(err => console.log(err));