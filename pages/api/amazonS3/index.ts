import aws from "aws-sdk";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET

export default async function (req:any, res:any) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: "ap-southeast-1",
    signatureVersion: "v4",
  });
  const s3 = new aws.S3();

  //API Middleware components
  const token = await getToken({ req, secret });

  if(!token){
    return res.status(422).json({ data: "ImageUploadAPI: Access Denied" });
  }



  if(req.method === "POST") {
    try {
      const post = s3.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Fields: {
          key: req.query.dir + "/" + req.query.file,
          "Content-Type": req.query.type,
        },
        Expires: 60, // seconds
        Conditions: [
          ["content-length-range", 0, 4097152], // up to 4 MB // strict size
        ],
      });
      return res.send(JSON.stringify(post))
  
    } catch (err) {

      res.status(400).json({ message: err });
    }
  }

  else if(req.method === "GET") {
    try {
      //Slice out 
      const baseImageURL = `${process.env.NEXT_PUBLIC_CLOUDFRONT_IMAGE_URL}/`
      let filePath = req.query.file.slice(baseImageURL.length);

      s3.getSignedUrl('getObject',
        //Params
        { 
          Bucket: process.env.BUCKET_NAME , 
          Key: filePath,
          ResponseContentDisposition: 'attachment; filename ="' + req.query.fileName + '"',
        },
        //Callback
        async function (error: any, url: any) {
          if (error != null) {

          } else {
            res.status(200).json({url:url});
          }
        }
        )
    } catch (err) {

      res.status(400).json({ message: err });
    }  
  }

  else if(req.method === "DELETE") {
    try {
      //Slice out 
      const baseImageURL = `${process.env.NEXT_PUBLIC_CLOUDFRONT_IMAGE_URL}/`
      let filePath = req.body.name.slice(baseImageURL.length);
      await s3.deleteObject(
        //Params
        { 
          Bucket: process.env.BUCKET_NAME , 
          Key: filePath,
        },
        //Callback
        async function (err: any, data: any) {
          if (err) req.deleteMsg = JSON.stringify(data);

          //invalidate cloudfront cache

          const cloudfront = new aws.CloudFront();
          cloudfront.createInvalidation(
            //Params
            {
              DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
              InvalidationBatch: {
                CallerReference: `nfc-cow-${Date.now()}`,
                Paths: {
                  Quantity: 1,
                  Items: [`/${filePath}`],
                }
              }
            },
            //Callback
            function (err: any, data: any) {
              if (err) req.deleteMsg = JSON.stringify(data);
            }
          );
        }).promise()
      res.status(200).json("File deleted Successfully");
    } catch (err) {
      res.status(400).json({ message: err });
    }  
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb", // Set desired value here
    },
  },
}