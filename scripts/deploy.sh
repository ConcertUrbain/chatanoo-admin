echo "Zipping sources"
mkdir build
cd public
zip -r ../build/admin.zip .
cd ..

echo "Deploy $TRAVIS_TAG version to S3"
aws s3 cp infra/admin.cform s3://chatanoo-deployment/infra/admin/$TRAVIS_TAG.cform
aws s3 cp build/admin.zip s3://chatanoo-deployment/admin/$TRAVIS_TAG.zip

echo "Upload latest"
aws s3api put-object \
  --bucket chatanoo-deployment \
  --key infra/admin/latest.cform \
  --website-redirect-location /infra/admin/$TRAVIS_TAG.cform
aws s3api put-object \
  --bucket chatanoo-deployment \
  --key admin/latest.zip \
  --website-redirect-location /admin/$TRAVIS_TAG.zip
