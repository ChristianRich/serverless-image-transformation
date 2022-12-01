# Build sharp Lambda layer

macOS and AMZ Linux do not support the same runtime version of Sharp.
This means, we cannot bundle and upload Sharp to Lambda, since the Amazon runtime is incompatible with our local version.

Hence we are creating a Lambda layer with an AMZ compatible installation of Sharp.
This means we're excluding sharp from the bundle, and relying on deploying a Lambda Layer. See `serverless.yml` for details.

The sharp distribution is this folder was made using an AMZ compatible Docker image:
https://github.com/ChristianRich/aws-lambda-layer-npm-sharp
https://github.com/woss/aws-lambda-layer-sharp

Other useful stuff:
https://www.webiny.com/blog/learn-how-to-use-lambda-layers

Sharp requirements for AWS Lambda
https://sharp.pixelplumbing.com/install#aws-lambda
