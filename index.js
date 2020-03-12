/*
 * Required Modules
 */

const JiraClient = require("jira-connector");
const config = require("config");

/*
 * App Variables
 */

const privateKey =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    config.Jira.privateKey +
    "\n-----END RSA PRIVATE KEY-----";
const host = config.Jira.host;
const consumerKey = config.Jira.consumerKey;
const verifierCode = config.Jira.verifierCode;
const requestToken = config.Jira.requestToken;
const requestSecret = config.Jira.requestSecret;
const accessToken = config.Jira.accessToken;

/**
 * Get Jira OAuth verification URL
 */

function getUrl() {
    JiraClient.oauth_util.getAuthorizeURL(
        {
            host: host,
            oauth: {
                consumer_key: consumerKey,
                private_key: privateKey,
            },
        },
        function(error, oauth) {
            if (error) {
                console.log(error.message);
                throw new Error(error.message);
            } else {
                console.log("\n------- START OAUTH DETAILS --------\n");
                console.log(oauth);
                console.log("\n------- END OAUTH DETAILS --------\n");
            }
        },
    );
}

/*
 * Using verifierCode from verification URL swap for access token
 */

function swapTokens() {
    JiraClient.oauth_util.swapRequestTokenWithAccessToken(
        {
            host: host,
            oauth: {
                token: requestToken,
                token_secret: requestSecret,
                oauth_verifier: verifierCode,
                consumer_key: consumerKey,
                private_key: privateKey,
            },
        },
        function(error, accessToken) {
            if (error) {
                console.log(error);
                throw new Error(error.message);
            } else {
                console.log("\n------- START ACCESS TOKEN DETAILS --------\n");
                console.log(accessToken);
                console.log("\n------- END ACCESS TOKEN DETAILS --------\n");
            }
        },
    );
}

/*
 * Test connection to jira using access token
 */

function testConnection() {
    try {
        const jira = new JiraClient({
            host: host,
            oauth: {
                consumer_key: consumerKey,
                private_key: privateKey,
                token: accessToken,
                token_secret: requestSecret,
            },
        });
        console.log("\n------- START JIRA CONNECTION DETAILS --------\n");
        console.log(jira);
        console.log("\n------- END JIRA CONNECTION DETAILS --------\n");
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

/*******************************************************************************
 * First run getUrl() function after setting private key and consumer key you
 * generated in default.json. Access the returned URL to retrieve verifier code,
 * request token, and request secret. Set corresponding values in
 * config/default.json before continuing.
 *
 * Once you've set the verifier code, request token and request secret in
 * default.json, run swapTokens() function. If everything was done correctly, a
 * new access token will be printed to the console. Copy that value and paste
 * it into the corresponding key in config/default.json.
 *
 * After setting the access token value in the config, run the testConnection()
 * function. If an error is printed to the screen, something failed. Read the
 * error message to determine what went wrong. If a Jira connection object is
 * printed to the terminal, the connection was established succesfully.
 * *****************************************************************************/

//getUrl();
//swapTokens();
//testConnection();
