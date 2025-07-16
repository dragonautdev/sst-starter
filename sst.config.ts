/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-starter",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
        stripe: "0.0.24",
      }
    };
  },
  async run() {
    const infra = await import("./infra");

    const outputs = {} as any;
    for (const value of Object.values(infra)) {
      // @ts-ignore
      if (value.outputs) Object.assign(outputs, value.outputs);
    }
    //outputs.vpc = infra.vpc.id;
    return outputs;
  },
});
