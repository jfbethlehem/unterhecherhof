import https from 'https';

https.get('https://maps.app.goo.gl/yrafsNPso69HArwf9?g_st=ic', (res) => {
  console.log(res.headers.location);
});
