# AWS S3 Static Hosting

## AWS Details

Route53 Domain: igilkes.staff.adaptavist.com
Root Bucket: igilkes.staff.adaptavist.com

## Steps

### Static Hosting via S3

[AWS Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-custom-domain-walkthrough.html)

1. Create two buckets:
   - `igilkes.staff.adaptavist.com`
   - `www.igilkes.staff.adaptavist.com`
     - Requests to this one will be redirected to the root bucket
2. Navigate to the root bucket & enable static website hosting
   - Bucket --> Properties --> Static website hosting
   - Enable & configure the setting (e.g. set the index.html)
3. Navigate to the www bucket & redirect requests to the root bucket
   - Bucket --> Properties --> Static website hosting
   - Hosting Type --> Redirect requests
   - NOTE: I chose no protocol here; I do want SSL
4. Enable traffic logging
   - Create a new bucket `logs.igilkes.staff.adaptavist.com`
   - Create a folder `logs`
     - This is where we will write our logs
   - Create a folder `cdn`
     - This is used for CloudFront
   - Enable logging
     - From the root bucket `igilkes.staff.adaptavist.com`
     - Properties --> Server access logging
     - Enable
     - Set the destination to be `logs.igilkes.staff.adaptavist.com`
   - Logs will be updated every two hours
5. Upload your static files to the root bucket
   - Root Bucket -> Upload -> Files
6. Edit "Block public access settings"
   - Permissions --> Block public access (bucket settings) --> Edit
   - Clear the "Block all public access" checkbox
7. Create & attach a bucket policy
   - root bucket --> Permissions --> Bucket Policy --> Edit
   - Update the policy to be:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": ["s3:GetObject"],
         "Resource": ["arn:aws:s3:::Bucket-Name/*"]
       }
     ]
   }
   ```
   - Ensure to replace the placeholder "Bucket-Name" to reflect your root bucket
8. Test your endpoint
   - root bucket --> Properties --> Static website hosting
   - Click the URL shown at the bottom
   - NOTE: It will be http via an Amazon URL
9. Add alias records for your Route53 Domain
   - Route53 --> Hosted Zones --> Your chosen domain
   - Create Record
   - Switch to Wizard
   - Simple Routing --> Define simple record
   - (Optional) Choose the subdomain

### SSL

NOTE: The certificate must be in the US East (N. Virginia) Region (us-east-1).

1. Navigate to AWS ACM (Certificate Manager)
2. Click on “Request a certificate”
3. Select “Request a public certificate”
4. Enter the domain(s) you wish to get a certificate for
5. Use DNS Validation
6. Click "View the certificate"
7. Under "Domains", click "Create records in Route 53" OR manually add the CNAME records

### CloudFront

NOTE: The distribution must include an alternate domain name that matches the domain name that you want to use for your URLs instead of the domain name that CloudFront assigned to your distribution.

1. Navigate to the [CloudFront Dashboard](https://console.aws.amazon.com/cloudfront/v4/home)
2. Click "Create distribution"
3. Under Origin: Select your S3 bucket's website endpoint
4. Set the desired default cache behaviour
5. Ensure to enable IPV6
6. Toggle redirect http --> https
7. Add the Custom SSL Certificate we created in the previous step
8. Where you're using a sub-domain; ensure to add it as an alias :o)
