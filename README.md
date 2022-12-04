# Serverless image transformation

AWS Serverless function for high-speed image transformation powered by [npm sharp](https://www.npmjs.com/package/sharp).

## Highlights

- Non-opinionated, dead-simple on-the-fly image resizing and manipulation
- Blazing fast, rich interface with chain-able methods
- S3 integration
- No upload file size restrictions
- Best-in-class for speed and features thanks to the underlying [libvips](https://www.libvips.org/) image processing library

## Example: Resize image to fill given dimensions

![](https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=300&q=80)

> Image credits [@nickxjones | Unsplash](https://unsplash.com/@nickxjones_)

```sh
curl --location --request POST 'https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com' \
--header 'Content-Type: application/json' \
--data-raw '{
   "source":{
      "http":{
         "url":"https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=300&q=80"
      }
   },
   "destination":{
      "http":true
   },
   "options": {
     "outputFormat": "jpg"
   },
   "commands":[
      {
         "name":"resize",
         "options":{
            "width":150,
         }
      }
   ]
}
'
```

Result

![](./docs/photo-1444021465936-c6ca81d39b84.png)

# [More examples here](./examples.md)

## API input/output table

This API was built with flexibility in mind and offer below input/output combinations for image transformation.
| Image source | Image destination | Use case |
| :----------- | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| HTTP | HTTP | Load image from HTTP source > Apply transformations > Return result to client as `Content-Type image/*` |
| HTTP | S3 | Load image from HTTP source > Apply transformations > Upload result to S3 > Return the absolute S3 public image URL |
| S3 | HTTP | Load image from S3 bucket > Apply transformations > Return result to client as `Content-Type image/*` |
| S3 | S3 | Load image from S3 > Apply transformations > Upload result to S3 > Returns the absolute S3 public image URL |

## Why I built this

I prefer working with agnostic, re-usable and decoupled components in the cloud while keeping cost down. There are number of great image transformation services available, however they are commercial products and comes with hefty monthly subscription fees (e.g with Cloudinary).

If your requirements are image resizing / manipulation and hosting, this free solution will serve you well.

## Prerequisites

- AWS account
- AWS CLI
- S

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
