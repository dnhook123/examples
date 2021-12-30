import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { handlerFactory } from "./handlerFactory";

const self = new pulumi.StackReference(
  `daniel-pulumi/${pulumi.getProject()}/${pulumi.getStack()}`
);

const ping = new aws.lambda.CallbackFunction("ping", {
  callbackFactory: handlerFactory,
  environment: {
    variables: {
      OPPONENT_FN_NAME: self
        .getOutput("pongName")
        .apply((pongName) => pongName ?? ""),
    },
  },
});

const pong = new aws.lambda.CallbackFunction("pong", {
  callbackFactory: handlerFactory,
  environment: {
    variables: {
      OPPONENT_FN_NAME: ping.name,
    },
  },
});

export const pingName = ping.name;
export const pongName = pong.name;
