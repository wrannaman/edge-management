cp config.prod.json config.json
docker build -t gcr.io/seismic-trail-221522/sugar-vision/app -f Dockerfile.prod .
docker push gcr.io/seismic-trail-221522/sugar-vision/app
