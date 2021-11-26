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

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * ============================================================================
 *                      TESTS FOR DEPRECATED IMPLEMENTATION
 * ============================================================================
 */

(async () => {
    console.log("Start xplora-api.js common tests ...");

    try {

        //  Create a new GraphQL handler for Xplora Cloud service
        console.log("Create GQLHandler ...");

        const gqlHandler = new xpa.GQLHandler(
            credentials.countryPhoneNumber, 
            credentials.phoneNumber, 
            credentials.password,
            "en-US", "");
    
        if (!gqlHandler) throw new Error("Failed to create GQLHandler!");

        //  Login to Xplora Cloud service
        console.log("Logging in ....");

        const issueToken = await gqlHandler.login();
        
        if (!issueToken) throw new Error("Failed to receive an issueToken!");
        if (issueToken.errors) throw new Error(`Error creating an issueToken: ${JSON.stringify(issueToken.errors)}`);

        //  Get detailed information about the logged in account

        console.log("Get detailed information about the logged in account ...");
        console.dir(await gqlHandler.getMyInfo(), {depth: null, colors: true});
    
        //  Run the following tests only if there is at least one child!
        if (issueToken.user && issueToken.user.children && (issueToken.user.children.length > 0)) {
            //  Get the first child for further tests.
            const xpaChild = issueToken.user.children[0].ward;

            //  Get a list of watches
            console.log("Query a list of watches ...");
            console.dir(await gqlHandler.getWatches(xpaChild.id), {depth: null, colors: true});

            //  Get a list of contacts
            console.log("Get list of contacts ...");
            console.dir(await gqlHandler.getContacts(xpaChild.id), {depth: null, colors: true});

            //  Get a list of alarms
            console.log("Get list of alarms ...");
            console.dir(await gqlHandler.getAlarms(xpaChild.id), {depth: null, colors: true});

            //  Let watch report its current location
            console.log("Invoke watch reporting its current location ...");
            console.dir(await gqlHandler.askWatchLocate(xpaChild.id), {depth: null, colors: true});
        
            console.log("    ... waiting 5 sec. for the watch reporting its location to the Xplora Cloud service ...");
            await Sleep(5000);
        
            //  Get the last reported location
            console.log("Report the watch's last location ...");
            console.dir(await gqlHandler.getWatchLastLocation(xpaChild.id), {depth: null, colors: true});

            //  Activate tracking (shutdown after 1 minute automatically)
            console.log("Activate location tracking for 1 minute ...");
            console.dir(await gqlHandler.trackWatch(xpaChild.id), {depth: null, colors: true});
        }
        else {
            console.warn("Check your Xplora account. Do you have assigned any child or watch to this account?");
        }
        
    } catch (error) {
        //  Failed to run common tests.
        console.error(error);
        process.exit(1);
    }
})();
