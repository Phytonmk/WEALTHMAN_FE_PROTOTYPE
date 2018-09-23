module.exports = (app) => {
  app.get('/api/server-time', async (req, res, next) => {
    res.send(Date.now());
    res.end();
  });
}