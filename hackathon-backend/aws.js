var https = require('https');

exports.handler = function (event, context) {

    try {

        if (event.session.new) {
            console.log("NEW SESSION");
        }

        switch (event.request.type) {
            case "LaunchRequest":
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to CG Technosoft Hackathon Version 4. Please tell me your tweet and i will predict sentiment for it", true),
                        {}
                    )
                );
                break;

            case "IntentRequest":
                // Intent Request
                console.log(`INTENT REQUEST`);

                switch (event.request.intent.name) {
                    case "getpopulation":
                        var slot_value = event.request.intent.slots.statenames.value;
                        var request = {
                            tweet: slot_value
                        }
                        //console.log(slot_value);
                        var options =
                        {
                            hostname: 'http://13.57.238.187/',
                            port: 3001,
                            path: `/api/getSentiment`,
                            method: 'POST',
                            rejectUnauthorized: false
                        };



                        var request = https.request(options, request, function (response) {
                            response.setEncoding("UTF-8");
                            var body = '';
                            var sentiment = ''
                            response.on("data", function (chunk) {
                                body += chunk;
                                console.log(body);

                            });

                            response.on("end", function () {
                                var val = JSON.parse(body);
                                var result = [];
                                result[0] = val[0] * 100;
                                result[1] = val[1] * 100;
                                if (result[0] > result[1]) {
                                    if ((result[0] - result[1]) < 15) {
                                        sentiment = 'NUETRAL';
                                    } else {
                                        sentiment = 'NEGATIVE';
                                    }
                                } else if (result[0] < result[1]) {
                                    if ((result[1] - result[0]) < 15) {
                                        sentiment = 'NUETRAL';
                                    } else {
                                        sentiment = 'POSITIVE';
                                    }
                                }
                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(`Sentiment is ${sentiment}`, true),
                                        {}
                                    )
                                );

                            });

                        });
                        request.end();
                        break;

                    default:
                        throw "Invalid intent";
                }

                break;

            case "SessionEndedRequest":
                // Session Ended Request
                console.log(`SESSION ENDED REQUEST`);
                break;

            default:
                context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);

        }


    } catch (error) { context.fail(`Exception: ${error}`) }

};

// Helpers
function buildSpeechletResponse(outputText, shouldEndSession) {

    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    };

}


function generateResponse(speechletResponse, sessionAttributes) {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };

}