echo "Zipping sources"
mkdir build
cd public
zip -r ../build/admin.zip .
cd ..

echo "Deploy $TRAVIS_TAG version to S3"
aws s3 cp infra/admin.cfn.yml s3://chatanoo-deployments-eu-west-1/infra/admin/$TRAVIS_TAG.cfn.yml
aws s3 cp build/admin.zip s3://chatanoo-deployments-eu-west-1/admin/$TRAVIS_TAG.zip

echo "Upload latest"
aws s3api put-object \
  --bucket chatanoo-deployments-eu-west-1 \
  --key infra/admin/latest.cfn.yml \
  --website-redirect-location /infra/admin/$TRAVIS_TAG.cfn.yml
aws s3api put-object \
  --bucket chatanoo-deployments-eu-west-1 \
  --key admin/latest.zip \
  --website-redirect-location /admin/$TRAVIS_TAG.zip
