/*
 * xplora-api.js manual tests ...
 *
 * Author: MiGoller
 * 
 * Copyright (c) 2021 MiGoller
 */

"use strict";

const xpa = require("../dist/index");

let credentials;

//  Getting your credentials ...
try {
    credentials = require("./credentials.json");
} catch (error) {
    if ((error.constructor === Error) && (error.code === "MODULE_NOT_FOUND")) {
        console.error("YOU HAVE TO SET YOU CREDENTIALS FIRST!");
        console.error("Copy the \"credentials-sample.json\" file and rename it to \"credentials.json\" before running any tests.");

        process.exit(1);
    }
    else {
        throw error;
    }
}

/**
 * ============================================================================
 *                      BASIC TESTS FOR CURRENT IMPLEMENTATION
 * ============================================================================
 */

//  Run some basic tests
(async () => {

    //  Login to Xplora API and populate the basic data
    const client = await xpa.Xplora.login(
        credentials.countryPhoneNumber, 
        credentials.phoneNumber, 
        credentials.password, 
        "en-US", "");

    console.dir(client, {depth: null, colors: true});

    const myChild = client.children[0];

    //  Who is logged in?
    // console.log("Who is logged in?");
    // const me = await client.me();
    // console.dir(me, {depth: null, colors: true});

    //  Send a text message to the first child's watch.
    // console.log("Send a text message to the first child's watch.");
    // await myChild.sendChatText("Hey!");

    //  Get the last 10 chat messages for the first child
    console.dir(await myChild.getChats(0, 10, ""), {depth: null, colors: true});

    //  Now get the watch report it's current position
    console.log("Invoke watch reporting its current location ...");
    await myChild.locate();

    console.log("   ... waiting 5 sec. for the watch reporting its location to the Xplora Cloud service ...");
    await Sleep(5000);

    console.log("Report the watch's last location ...");
    console.dir(await myChild.getLastLocation(), {depth: null, colors: true});
})();

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
