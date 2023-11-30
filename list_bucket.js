const {Storage} = require('@google-cloud/storage');

const storage = new Storage({projectId:"befitoutfit", keyFilename:"befitoutfit-508985152d9c.json"});

storage
  .getBuckets()
  .then((results) => {
    const buckets = results[0];

    console.log('Buckets:');
    buckets.forEach((bucket) => {
      console.log(bucket.name);
    });
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });