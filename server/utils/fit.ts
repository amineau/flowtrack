import { Decoder, Stream, Profile } from "@garmin-fit/sdk";

export default {
  decode: async (bytes: Uint8Array) => {
    const stream = Stream.fromByteArray(bytes);
    const decoder = new Decoder(stream);
    const recordFields = new Set();
    console.log("isFIT (instance method): " + decoder.isFIT());
    console.log("checkIntegrity: " + decoder.checkIntegrity());
    const { messages, errors } = decoder.read({
      mesgListener: (messageNumber: number, message: any) => {
        if (Profile.types.mesgNum[messageNumber] === "record") {
          Object.keys(message).forEach((field) => recordFields.add(field));
        }
      },
    });
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
    messages.recordFields = [...recordFields];
    return messages;
  },
};
