# Serverless image transformation

AWS Serverless function for high-speed image transformation leveraged by [npm sharp](https://www.npmjs.com/package/sharp).

## Highlights

- Non-opinionated, dead-simple on-the-fly image resizing
- Blazing fast, rich interface with chain-able methods
- S3 integration
- No upload file size restrictions due to pre-signed upload URLs
- Best-in-class for speed and features thanks to the underlying [libvips](https://www.libvips.org/) image processing library

## Example 1

Resize and greyscale a 2000x3000 pixels 1Mb JPG image, upload to S3 and return the image to the client
![Postman testing](./docs/postman-testing.png)

## API input/output table

This API was built with flexibility in mind and offer below input/output combinations.
| Image source | Image destination | Use case |
| :----------- | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| HTTP | HTTP | Load image from HTTP source > Apply transformations > Return result to client as `Content-Type image/*` |
| HTTP | S3 | Load image from HTTP source > Apply transformations > Upload result to S3 > Return the absolute S3 public image URL |
| S3 | HTTP | Load image from S3 bucket > Apply transformations > Return result to client as `Content-Type image/*` |
| S3 | S3 | Load image from S3 > Apply transformations > Upload result to S3 > Returns the absolute S3 public image URL |

## Key features

This API has two jobs:

- Apply image transformations and convert between common image formats
- Issue pre-signed upload URLs for secure and direct streaming to am S3 bucket

This solutions offers a good balance between the low cost and speed of AWS Lambda combined with rich image processing capabilities neatly packaged up in a one-click deployment package.

## Example 2

TODO

## Example 3

TODO

## Prerequisites

An AWS account with CLI and API access in a non-restricted account

Install the Serverless framework globally:

```
npm i -g serverless
```

## Install

```
yarn install
```

## Run locally

```
sls offline
```

## Deploy to AWS

```
sls deploy
```

## Why I built this

I prefer working with agnostic, re-usable and decoupled components in the cloud. I also prefer keepingmy running costs down and avoid on-going monthly subscription fees to 3rd party paid services like [Cloudinary](https://cloudinary.com/).

I would hardly compare my efforts with the fantastic features of Cloudinary, but often I've seen large companies pay MILLIONS OF DOLLARS a year on silly 3rd party IT subscriptions and only using A FRACTION of the features, that an in-house team of developers easily could have built putting a few Lambda functions together.

I like low cost and simplicity, that's what I built this service.
If you think about it, for the majority of use-cases the requirement for image transformations can be reduced to creating thumbnails and different sizes for different screens and storing it in the cloud. I'd say that covers 80% of use-cases.

## TODO

- Unit tests
- Integration test
