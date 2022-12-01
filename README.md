# Serverless image transformation

Agnostic Serverless function for transforming images on the fly using [npm sharp](https://www.npmjs.com/package/sharp).

Features:

- HTTP interface
- Event driven interface

Using JSON you can instruct the image processor to perform any number of transformations in a series.
Using the HTTP

![Postman testing](./docs/postman-testing.png)

## Sample payload

```json
{
  "source": {
    "url": "https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg",
    "forwardHeaders": []
  },
  "outputFormat": "jpeg",
  "withMetadata": true,
  "operations": [
    {
      "command": "resize",
      "skip": false,
      "options": {
        "width": 250
      }
    },
    {
      "command": "greyscale",
      "skip": false
    },
    {
      "command": "rotate",
      "options": 45,
      "skip": false
    },
    {
      "command": "sharpen",
      "skip": false,
      "options": 2.5
    },
    {
      "command": "median",
      "skip": true,
      "options": 2
    }
  ]
}
```
