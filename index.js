export const handler = async (event, context, callback) => {
  try {
    // console.log("event =====>",event);
    const intent = event.sessionState.intent.name;
    const slots = event.sessionState.intent.slots;
    // const firstname = event.sessionState.intent.slots.firstname;
    // const phoneNumber = event.sessionState.intent.slots.phoneNumber;
    const invocationSource = event.invocationSource;

    console.log({ invocationSource }, { intent });
    const validate = (slots) => {
      if (!slots.firstname) {
        return {
          isvalid: false,
          violatedSlot: "firstname",
        };
      }
      if (!slots.phoneNumber) {
        return {
          isvalid: false,
          violatedSlot: "phoneNumber",
        };
      }
      return { isvalid: true };
    };

    var response = {};
    const validate_res = validate(slots);
    console.log("result =====> ", validate_res);

    if (invocationSource == "DialogCodeHook") {
      if (!validate_res.isvalid) {
        // console.log("inside if ===>", validate_res.isvalid, validate_res.violatedSlot);
        response = {
          sessionState: {
            dialogAction: {
              slotToElicit: validate_res.violatedSlot,
              type: "ElicitSlot",
            },
            intent: {
              name: intent,
              slots: slots,
            },
          },
        };
      } else {
        response = {
          sessionState: {
            dialogAction: {
              type: "Delegate",
            },
            intent: {
              name: intent,
              slots: slots,
            },
          },
        };
      }
    }
    if (invocationSource == "FulfillmentCodeHook") {
      response = {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            name: intent,
            slots: slots,
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Request is forwarded.. please wait....!!",
          },
        ],
      };
    }
    return response;
  } catch (err) {
    console.log("error ===> ", err);
  }
};
